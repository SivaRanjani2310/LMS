import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moreIcon from "./../Images/more.png";
import searchIcon from "./../Images/search.png";
import testData from "./test.json"; // ✅ direct import from src

const TetsList = () => {
    const [testList, setTestList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setTestList(testData);
    }, []);

    return (
        <div className="user-page">
            {/* Header Section */}
            <div className="users-list-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    ← Back
                </button>

                <h2 className="h2-user-title">
                    All tests
                    <span> {testList.length}</span>
                </h2>

                <div className="users-header-actions-cnt">
                    <div className="search-user-cnt">
                        <img src={searchIcon} alt="search-icon" className="search-icon" />
                        <input type="text" className="search-input" placeholder="Search" />
                    </div>
                </div>
            </div>

            {/* Table Header */}
            <div className="users-list-cnt">
                <div className="users-details-header">
                    <p className="test-cell-cnt ">Student Name</p>
                    <p className="test-cell-cnt ">Student ID</p>
                    <p className="test-cell-cnt">Test Type</p>
                    <p className="test-cell-cnt">Submission Date</p>
                    <p className="test-cell-cnt">Correction Status</p>
                    <p style={{ width: "2rem" }}></p>
                </div>

                {/* Test Details */}
                {testList.length > 0 ? (
                    testList.map((test, index) => (
                        <div className="test-details-cnt" key={index}>
                            <p className="test-cell-cnt details-text">{test.studentName}</p>
                            <p className="test-cell-cnt details-text">{test.studentId}</p>
                            <p className="details-text test-cell-cnt">{test.testType}</p>
                            <p className="details-text test-cell-cnt">{test.submissionDate}</p>
                            <p className="details-text test-cell-cnt">{test.status}</p>
                            <img
                                src={moreIcon}
                                alt="more"
                                className="more-icon"
                                onClick={() => navigate('details')}
                            />
                        </div>
                    ))
                ) : (
                    <p className="no-tests-text">No tests found.</p>
                )}
            </div>
        </div>
    );
};

export default TetsList;
