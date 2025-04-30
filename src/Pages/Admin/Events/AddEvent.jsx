import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const AddEvent = () => {
  const [DegreeList, setDegreeList] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [degreeId, setDegreeId] = useState("");

  useEffect(() => {
    const fetchDegree = async () => {
      const response = await axios.get(`${apiBaeApi}/api/degrees`);
      const { degrees } = await response.data;
      setDegreeList(degrees);
    };
    fetchDegree();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resEvent = await axios.post(`${apiBaeApi}/api/admin-event`, {
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      degreeId:degreeId
    });
    console.log(resEvent);
    window.location.reload();
  };

  return (
    <div className="Add-event">
      <h3>Add Event</h3>
      <form className="d-grid event-form gap-3" onSubmit={handleSubmit}>
        <div className="">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="">
          <label>Description</label>
          <textarea
            name=""
            id=""
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div className="">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="">
          <label className="">End Date</label>
          <input
            type="date"
            className="form-control"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="">
          <label htmlFor="">Select Degree</label>
          <select name="" id="" className="form-control" onChange={(e)=>setDegreeId(e.target.value)} value={degreeId}>
            <option value="" disabled>
              Select Degree
            </option>
            {DegreeList.map((degree) => (
              <option value={degree._id}>{degree.title}</option>
            ))}
          </select>
        </div>
        <Button className="btn" type="submit">
          Add Event
        </Button>
      </form>
    </div>
  );
};

export default AddEvent;
