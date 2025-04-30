import React from "react";
import "./Assignment.css";
const Assignments = [{ name: "assignemnt 1" }];
const Assignment = ({ setIsOpenAssignment }) => {
  return (
    <div
      className={`assignment position-absolute bg-white top-50 left-50 border-1 border-dark p-5 z-10`}
    >
      <div className="assignment-header d-flex w-100 gap-5 align-items-center justify-content-between">
        <h2>Assignment</h2>
        <button
          className="btn-close"
          onClick={() => setIsOpenAssignment(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="d-flex gap-5">
        <div className="assignment-sidebar h-75">
          <ul className="list-group">
            {Assignments.map((assignment, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center gap-4"
              >
                {assignment.name}
                <button className="btn btn-light btn-sm">View</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="assignment-content h-75 border-1 border-black rounded-2">
          {/* <div className="assignment-content-header d-flex  justify-content-between align-items-center">
            <h3>Assignment 1</h3>
            <button className="btn btn-light btn-sm">Download</button>
          </div> */}
          <div className="assignment-content-body">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
              quod, voluptates dolorum, quae voluptate, ratione quidem
              dignissimos quos quas doloribus quibusdam. Quisquam, quae
            </p>
          </div>
          {/* <div className=""></div> */}
        </div>
      </div>
    </div>
  );
};

export default Assignment;
