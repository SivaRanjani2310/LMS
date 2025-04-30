import React, { useEffect, useState } from "react";
import "./Admin_table.css";
import defaultUserImg from "./defaultPorfileSVG.svg";
import { Edit, Trash } from "lucide-react";
import UserDetails from "./UserDetails/UserDetails";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Local JSON data
import usersData from "./users.json";
import degreesData from "./degrees.json";

const AdminTable = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewDetails, setViewDetails] = useState(false);

  const fetchUsers = async () => {
    try {
      const users = usersData.users;
      const degrees = degreesData.degrees;

      // Match degrees with users
      const usersWithDegrees = users.map((user) => {
        const degree = degrees.find((d) => d._id === user.applyingFor);
        return {
          ...user,
          degreeName: degree ? degree.title : "Unknown Degree",
        };
      });

      setUserList(usersWithDegrees);
    } catch (err) {
      setError("Failed to load local user data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = (userId) => {
    setUserList((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, adminAuth: !user.adminAuth } : user
      )
    );
    toast.success("Toggled admin access (local change only)");
  };

  const deleteAction = (userId) => {
    setUserList((prev) => prev.filter((user) => user._id !== userId));
    toast.success("User deleted (local change only)");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container-fluid mt-10 position-relative admin-table">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">Phone No</th>
              <th scope="col">Access</th>
              <th scope="col">Course</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="Admin-table-body">
            {userList.length > 0 ? (
              userList.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={user.passportPhotoFile || defaultUserImg}
                      alt={user.username}
                      height={30}
                      width={30}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.mobileNo}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={user.adminAuth}
                        onChange={() => handleAuth(user._id)}
                      />
                    </div>
                  </td>
                  <td>{user.degreeName}</td>
                  <td className="d-flex">
                    <button
                      className="btn btn-light btn-sm me-2"
                      onClick={() =>
                        navigate("/admin/userDetails", { state: { user } })
                      }
                    >
                      <Edit />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteAction(user._id)}
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {viewDetails && <UserDetails />}
    </div>
  );
};

export default AdminTable;
