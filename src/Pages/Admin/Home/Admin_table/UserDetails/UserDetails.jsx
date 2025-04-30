import React from 'react';
import './UserDetails.css';
import AdminNavbar from "../../../../../Components/Sidebar/AdminNavbar";
import Header from "../../../../../Components/Header/Header";
import { useNavigate } from 'react-router-dom'; // 👈 make sure this import is here


const UserDetails = () => {
  const navigate = useNavigate(); 
  const handleBackClick = () => {
    console.log("Click Happening");
    navigate('/admin');
  };
  
  
  return (
    <AdminNavbar>
      <div className="admin">
        <Header Title={"User Details"} Address={"User Details"} />
        <div className="user-details-container">
          <div className="header-section">
            <button className="back-btn" onClick={handleBackClick}>
              Back
            </button>
          </div>

          <div className="user-content">
            <div className="left-section">
              {[
                { label: 'First Name', value: 'yakas' },
                { label: 'Last Name', value: 'R' },
                { label: 'User Name', value: 'yakashrolex' },
                { label: 'User Email', value: 'test05@zion.com' },
                { label: 'Date of Birth', value: '04-04-2025' },
                { label: 'Gender', value: 'Male' },
                { label: 'Educational Qualification', value: 'b.com' },
                { label: 'Mobile No', value: '967676767323' },
                { label: 'Degree Name', value: 'B.Th' },
                { label: 'Present Address', value: 'N0 16, Nadu Street,Kadayampatti,Sak' },
                { label: 'Ministry Experience', value: '7' },
                { label: 'Theological Qualification', value: 'kovai' },
                { label: 'Apply For', value: 'B.Th' }
              ].map((field, idx) => (
                <div key={idx} className="form-group">
                  <label>{field.label}:</label>
                  <input value={field.value} readOnly />
                </div>
              ))}
              <button className="edit-btn">Edit</button>
            </div>

            <div className="right-section">
              <div className="table-section">
                <h3>Assignments</h3>
                <table className="assignment-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Semester</th>
                      <th>Assignment</th>
                      <th>Mark</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2].map((n) => (
                      <tr key={n}>
                        <td>{n}</td>
                        <td>Semester</td>
                        <td><button className="view-btn">View</button></td>
                        <td>10</td>
                        <td><span className="status process">process</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-section">
                <h3>Payments</h3>
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Payment</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Initial Payment</td>
                      <td>₹1200</td>
                      <td><span className="status paid">Paid</span></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>month 2</td>
                      <td>₹1200</td>
                      <td><span className="status paid">Paid</span></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>month 3</td>
                      <td>₹1200</td>
                      <td><span className="status paid">Paid</span></td>
                    </tr>
                    <tr>
                      <td>Final</td>
                      <td>total Payment</td>
                      <td>₹3600</td>
                      <td><span className="status completed">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminNavbar>
  );
};

export default UserDetails;
