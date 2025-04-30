// // src/components/Statistics.js
// import { useEffect } from "react";
// import BigCalendar from "../Calendar/BigCalendar/BigCalendar";
// import Chart from "./Chart";
// // import CourseProgress from "./courseProgress";
// // import CourseProgress from './CourseProgress'
// import MainEvents from "./MainEvents";
// import "./Statistics.css";
// import axios from "axios";

// const userInfo = JSON.parse(localStorage.getItem("userdata"));
// const Statistics = () => {
//   const apiBaseUrl = process.env.REACT_APP_BASE_API;
  
//   // const timeSpentData = {
//   //   Sunday: 5,
//   //   Monday: 10,
//   //   Tuesday: 7,
//   //   Wednesday: 12,
//   //   Thursday: 6,
//   //   Friday: 8,
//   //   Saturday: 14,
//   // };
//   const fetchDegreePercentage = async () => {
//     const response = await axios.get(`${apiBaseUrl}/api/users/${userInfo._id}/watchPercent`)
//     // console.log(response.data);
//     const { watchPercent } = response.data;
//     console.log(watchPercent);
//     return watchPercent;
//   }
//   // fetchDegreePercentage()
//   // useEffect(() => {
//   // }, [])
  

//   return (
//     <div className="statistics">
//       <div className="time-spent">
//         {/* <h3>Time Spent</h3> */}
//         {/* <div className="chart-container">
//           <div className="chart-title">Weekly Time Distribution</div>
//           <Chart data={timeSpentData} />
//           <br />
//           <div className="chart-legend">
//             <div>
//               <span className="legend-sunday"></span>Sunday
//             </div>
//             <div>
//               <span className="legend-monday"></span>Monday
//             </div>
//             <div>
//               <span className="legend-tuesday"></span>Tuesday
//             </div>
//             <div>
//               <span className="legend-wednesday"></span>Wednesday
//             </div>
//             <div>
//               <span className="legend-thursday"></span>Thursday
//             </div>
//             <div>
//               <span className="legend-friday"></span>Friday
//             </div>
//             <div>
//               <span className="legend-saturday"></span>Saturday
//             </div>
//           </div>
//         </div> */}
//         <MainEvents />
//       </div>
//       <div className="completion">
//         <h3>Completion</h3>
//         <Chart data={{ progress: fetchDegreePercentage }} />
//         {/* <CourseProgress/> */}
//       </div>
//       <div className="completion">
//         <BigCalendar/>
//       </div>
//     </div>
//   );
// };

// export default Statistics;

// src/components/Statistics.js
import { useEffect, useState } from "react";
import BigCalendar from "../Calendar/BigCalendar/BigCalendar";
import Chart from "./Chart";
import MainEvents from "./MainEvents";
import "./Statistics.css";
import axios from "axios";

const userInfo = JSON.parse(localStorage.getItem("userdata"));

const Statistics = () => {
  const [watchPercent, setWatchPercent] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_BASE_API;
  const [degree, setDegree] = useState({})
  // Function to fetch the degree percentage
  const fetchDegreePercentage = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/users/${userInfo._id}`);
      const { user } = response.data
      // const { watchPercent } = response.data;
      const findWatchPercentage = user.degreeProgress.map(data => data.progressPercentage)
      console.log(findWatchPercentage);
      
      setWatchPercent(findWatchPercentage[0] || 0);  // Store the first percentage or 0 if empty
      console.log(user);
      
    } catch (error) {
      console.error("Error fetching watch percent:", error);
    }
  };

  const fetchDegree = async () => {
    const resDegree = await axios.get(`${apiBaseUrl}/api/degrees/${userInfo.applyingFor}`)
    const { degree } = resDegree.data;
    setDegree(degree);
    console.log(degree);
    
  }

  // Fetch degree percentage when the component mounts
  useEffect(() => {
    fetchDegree()
    fetchDegreePercentage();
  }, []);

  return (
    <div className="statistics">
      <div className="time-spent">
        <MainEvents />
      </div>
      <div className="completion">
        <h3>Completion</h3>
        <p>Degree Name:{degree.title}</p>
        <p>Completed Percentage : {watchPercent} %</p>
        {watchPercent !== null ? (
          <Chart data={{ progress: watchPercent }} />
        ) : (
          <p>Loading...</p> // Show loading text until the data is fetched
        )}
      </div>
      <div className="completion">
        <BigCalendar />
      </div>
    </div>
  );
};

export default Statistics;

