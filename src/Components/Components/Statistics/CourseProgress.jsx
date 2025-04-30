import React, { useEffect } from "react";
import "./courseProgress.css";
import { ProgressBar } from "react-bootstrap";
import axios from "axios";
const apiBaseUrl = process.env.REACT_APP_BASE_API;
const CourseProgress = () => {
  const userInfo = JSON.parse(localStorage.getItem("userdata"));
  useEffect(() => {
    const getCourseProgress = async () => {
      const payLoad = {
        userId: userInfo._id,
        degreeId: userInfo.applyingFor,
      }
      const resCourseProgress = await axios.get(
        `${apiBaseUrl}/api/complete/${payLoad.userId}/${payLoad.degreeId}`
      );
      console.log(resCourseProgress.data);
    }
    getCourseProgress();
  }, [])
  

  return (
    <>
      <div className="progress-container">        
        <div className="progress-card">
          <img src="/logoShort.png" alt="" className="progress-card-image" />
          <div className="progress-wrapper">
            <p className="progress-card-title">Course Title</p>
            <div className="progress-card-bar">
              <p>Current Progress : 20%</p>
              <ProgressBar animated striped variant="info" now={20} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseProgress;
