import React, { useEffect, useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { StudentContext } from "../../context/StudentState";
import TrainerSlidebar from "./TrainerSlidebar";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Header from "../Header";

const TrainerStudent = () => {
  let ContextValue = useContext(StudentContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentStudent, setCurrentStudent] = useState([]);
  const [allStudent, setAllStudent] = useState([]);
  const [runningBatch, setRunningBatch] = useState([]);
  const [filterStatus, setFilterStatus] = useState(false);
  
  const [filter, setFilter] = useState({
    course: "",
    batch: "",
  });

  useEffect(() => {
    if (id) {
      getBatch(id);
      getTrainerData(id);
    }
  }, [id]);

  const getTrainerData = async (id) => {
    console.log("id", id);
    try {
      const response = await fetch(
        "http://localhost:8000/getStudentByTrainer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ TrainerId: id }),
        }
      );

      const responseData = await response.json();
      console.log("response data = ", responseData.data);
      localStorage.setItem("trainerStudent", JSON.stringify(responseData.data));
      setAllStudent(responseData.data);
      setCurrentStudent(responseData.data);
    } catch (error) {
      console.error("Error fetching trainer data:", error);
    }
  };

  const getBatch = async (id) => {
    try {
      let batchData = await ContextValue.getTrainerRunningBatch(id);

      console.log("batch data =", batchData);
      setRunningBatch(batchData);
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  const filterStudent = () => {
    setFilterStatus(true);
    console.log("filter =", filter);
    localStorage.setItem("trainerBatch", filter.batch);

    let filterStudent = allStudent.filter((data) => {
      return (
        (filter.course === "" ? data.Course : data.Course === filter.course) &&
        (filter.batch === "" ? data.Batch : data.Batch === filter.batch)
      );
    });

    console.log("filter student =", filterStudent);
    setCurrentStudent(filterStudent);
    localStorage.setItem("filterStudent", JSON.stringify(filterStudent));
  };

  const toggleDocument = (student) => {
    navigate('StudentAssignment', { state: { student } });
};

  return (
    <div>
      <Header />
      <div className="sidebar-main-container">
        <TrainerSlidebar />
        <div className="student-data w-80 right-side-container">
          <div className="batch-course-filter mt-4">
            {runningBatch && (
              <select
                className="custom-select mr-sm-2"
                name="batch"
                onChange={(e) => {
                  setFilter({ ...filter, [e.target.name]: e.target.value });
                }}
              >
                <option disabled selected>
                  Batch
                </option>

                {runningBatch.map((data) => {
                  return <option value={data.Batch}>{data.Batch}</option>;
                })}
              </select>
            )}

            <button
              className="btn btn-primary"
              onClick={filterStudent}
              disabled={
                filter.course === "" && filter.batch === "" ? true : false
              }
            >
              Filter
            </button>
          </div>

          <div className="mt-4">
            <div className="table-responsive recentOrderTable">
              <table
                id="datatable"
                className="table table-striped table-bordered"
                cellSpacing="0"
                width="100%"
              >
                <thead>
                  <tr>
                    <th scope="col">Enrollment No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Number</th>
                    <th scope="col">Batch</th>
                    <th scope="col">Course</th>
                    <th scope="col">Attendance</th>
                    <th scope="col">View Assignmnet</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudent &&
                    currentStudent.map((data, index) => {
                      console.log("currentStudent", currentStudent);
                      return (
                        <tr key={data.id}>
                          <td>{data.EnrollmentNo}</td>
                          <td>{data.Name}</td>
                          <td>{data.Number}</td>
                          <td>{data.BatchTiming}</td>
                          <td>{data.Course}</td>
                          <Link to={`attendencedetail/${data._id}`}>
                            <td>
                              <i className="fa-solid fa-clipboard-user"></i>
                            </td>
                          </Link>
                          <td>
                          <button className="btn btn-success text-light" onClick={e=>toggleDocument(data)}>
                                                            <RemoveRedEyeIcon />

                                                        </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerStudent;
