import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import TopBar from "../TopBar/TopBar";
import Header from "../Header/Header.jsx";
import CustomCalendar from "../Calendar/Calendar.jsx";
import Statistics from "../Statistics/Statistics.jsx";
import LoadingPage from "../LoadingPage/LoadingPage";
import CourseRecommendation from "../CourseRecomend/CourseRecommendation";
import ErrorDataFetchOverlay from "../Error/ErrorDataFetchOverlay";
// import Table from "../Clienttable/Table.jsx";
import MainEvents from "../Statistics/MainEvents.jsx";
import BigCalendar from "../Calendar/BigCalendar/BigCalendar.jsx";
import { Col, Container, Row, Table, Toast } from "react-bootstrap";
import Calendar from "react-calendar/dist/cjs/Calendar.js";

import { format, formatDate } from "date-fns";
import { toast } from "react-toastify";
import ProgressBar from "../ProgressBar/ProgressBar.jsx";
function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  // Shuffle recommended courses
  const shuffledCourses = [...recommendedCourses].sort(
    () => 0.5 - Math.random()
  );

  // if (isLoading) {
  //   return <LoadingPage />;
  // }

  if (fetchError) {
    return <ErrorDataFetchOverlay />;
  }

  const userInfo = JSON.parse(localStorage.getItem("userdata"));
  const [userDetails, setUserDetails] = useState({});
  const apiBaseUrl = process.env.REACT_APP_BASE_API;
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/users/${userInfo._id}`);
        const { user } = res.data;
        setUserDetails(user);

        // toast.success("User data fetched successfully");
      } catch (error) {
        // toast.error("Error fetching user data");
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserDetails();
  }, []);
  console.log(userDetails);

  return (
    <div className="mainContent">
      <div className="rounded-3">
        <TopBar />
      </div>

      <div className="w-100% ">
        {/* Welcome Section */}
        <div className="card shadow-sm bg-primary text-white rounded-3">
          <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            <div>
              <h3 className="fw-bold">Welcome Back, {userInfo.username} 👋</h3>
              <p className="mb-0">We're glad to have you here!</p>
            </div>
            <div className="bg-body text-dark rounded-3 px-3 py-2 mt-3 mt-md-0">
              <strong>{new Date().toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="row mt-4 g-4">
          {/* Courses Table */}
          <div className="col-lg-6">
            <div className="card shadow-sm rounded-3 border">
              <div className="card-header fw-bold">
                <h5 className="mb-0">Your Courses</h5>
              </div>
              <div className="card-body p-0">
                <Table hover responsive className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Mark</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDetails?.degreeProgress?.[0]?.courses?.length > 0 ? (
                      userDetails.degreeProgress[0].courses.map(
                        (course, index) => (
                          <tr key={course._id}>
                            <td>{index + 1}</td>
                            <td>{course.courseTitle}</td>
                            <td>{course.progressPercentage}%</td>
                            <td>
                              <ProgressBar
                                progress={
                                  course.completionPercentage ||
                                  course.progressPercentage ||
                                  0
                                }
                              />
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No courses available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="card-footer d-flex align-items-center g-4">
                <div className="w-100 mt-5">
                  <h5 className="d-flex justify-content-between">
                    Degree:
                    <span>
                      {userDetails?.degreeProgress?.[0]?.degreeTitle || "N/A"}
                    </span>
                  </h5>
                  <div className="w-100">
                    <ProgressBar
                      progress={
                        userDetails?.degreeProgress?.[0]?.progressPercentage ||
                        0
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="col-lg-6">
            <div className="card shadow-sm rounded-3 border">
              <div className="card-header fw-bold">
                <h5 className="mb-0">Payment Details</h5>
              </div>
              <div className="card-body p-0">
                <Table hover responsive className="mb-0">
                  <thead className="table-bordered table-dark">
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Initial Payment</td>
                      <td>$1200</td>
                      <td>
                        <button className="btn btn-sm btn-primary">
                          Download
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Courses Calender */}
          <div className="col-lg-6 rounded-3 p-3">
            <div className="card shadow-sm rounded-3 p-2">
              <BigCalendar />
            </div>
          </div>
          {/* Courses Events */}
          <div className="col-lg-6 rounded-3 p-3">
            <div className="card shadow-sm rounded-3 h-100 p-2">
              <MainEvents />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
