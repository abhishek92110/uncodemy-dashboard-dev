import React from "react";
import { useState, useContext } from "react";
import { useEffect } from "react";
import { StudentContext } from "../../context/StudentState";
import Header from "../Header";
import TrainerSlidebar from "./TrainerSlidebar";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { HashLoader } from "react-spinners";

// import './Attendence.css'

function AddAttendance() {
  const location = useLocation();
  let ContextValue = useContext(StudentContext);

  const { id } = location.state;
  console.log("id of trainer =", id);

  document.title = "StudentDashboard - Student Attendance";

  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [AttendanceStatus, setAddAttendenceStatus] = useState(false);
  const [runningBatch, setRunningBatch] = useState();
  const [currentStudent, setCurrentStudent] = useState([]);
  const [filterStatus, setFilterStatus] = useState(false);
  const [allStudent, setAllStudent] = useState([]);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [studentId, setstudentId] = useState([]);
  const [markStatus, setMarkStatus] = useState("class");
  const [attendance, setAttendance] = useState();
  const [attendanceStatus, setAttendanceStatus] = useState(false);
  const [date, setDate] = useState({
    selectedDate: "",
    day: "",
    month: "",
    year: "",
    daysName: "",
  });

  const [filter, setFilter] = useState({
    course: "",
    batch: "",
    batchDay: "",
  });

  const [currentMonth, setCurrentMonth] = useState(
    month[new Date().getMonth()]
  );
  const currentDate = new Date().toISOString().split("T")[0];
  console.log("current month =", currentMonth);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  let tempDays = new Date(currentYear, currentMonth, 0).getDate();

  useEffect(() => {
    getBatch(id);
    const currentDate = new Date();
    setDateFunc(currentDate);
    console.log("useEffect = ", ContextValue.studentId);
  }, [ContextValue.studentId]);

  const setDateFunc = (currentDate) => {
    console.log("value =", currentDate);
    const day = currentDate.getDate();
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const options = { weekday: "long" };
    const dayName = currentDate.toLocaleDateString("en-US", options);

    // Define an array of month names
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the month name using the month index
    const month = monthNames[monthIndex];

    // Format the date as "day/month/year"
    const formattedDate = `${day}/${month}/${year}`;

    console.log("Formatted Date:", formattedDate);
    console.log("Day:", day);
    console.log("Month:", monthIndex);
    console.log("Year:", year);
    console.log("dayName:", dayName);
    setDate({
      ...date,
      ["selectedDate"]: formattedDate,
      ["day"]: day,
      ["month"]: monthIndex + 1,
      ["year"]: year,
      ["daysName"]: dayName,
    });
  };

  const getBatch = async (id) => {
    console.log("get batch trainer id =", id);
    try {
      let batchData = await ContextValue.getTrainerRunningBatch(id);

      console.log("batch data =", batchData);
      setRunningBatch(batchData);
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  let dayName = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const filterStudent = async () => {
    setAttendanceStatus(false);
    setFilterStatus(true);

    let student = await ContextValue.getRunningBatchStudent(filter.batch);

    console.log("student running batch =", student, filter.batch);

    getStudentAttendance(student);
    setCurrentStudent(student);
    setMarkStatus("class");
    setAttendanceStatus(true);
  };

  const setAttendanceId = (value, id, index) => {
    let tempStudentId = [...studentId];
    console.log(
      "index of student id function=",
      typeof value,
      index,
      tempStudentId,
      studentId
    );

    // if (!tempStudentId[index]) {
    //   tempStudentId[index] = [];
    // }

    // Push the attendance object into the appropriate index.
    tempStudentId[index] = {
      studentId: id,
      status: value,
    };

    const filteredData = tempStudentId.filter((element) => {
      return element.status !== undefined && element.status !== "";
    });

    // Get the count of non-empty, non-undefined elements
    const count = filteredData.length;
    setAttendanceCount(count);

    console.log("student id =", tempStudentId, count);
    setstudentId(tempStudentId);
    ContextValue.updateStudentId(tempStudentId);
  };

  const addAttendance = async () => {
    console.log("date =", date);
    let detail = {
      fullDate: date.selectedDate,
      month: date.month,
      day: date.day,
      year: date.year,
      studentId: studentId,
      Batch: filter.batch,
      trainerId: id,
      BatchDay: filter.batchDay,
      attendanceStatus: markStatus,
    };
    console.log("detail =", detail);

    try {
      let attendance = await fetch(
        "http://localhost:8000/addStudentAttendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(detail),
        }
      );
      ContextValue.updateProgress(30);
      ContextValue.updateBarStatus(true);
      ContextValue.updateProgress(60);
      attendance = await attendance.json();
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      AttendanceAdded();
    } catch (error) {
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log("error =", error.message);
    }
  };

  const AttendanceAdded = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Attendance Added",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const AttendanceUpdated = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Attendance Updated",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const updateAttendance = async () => {
    console.log("date =", date);
    let detail = {
      fullDate: date.selectedDate,
      month: date.month,
      day: date.day,
      year: date.year,
      studentId: studentId,
      Batch: filter.batch,
      trainerId: id,
      BatchDay: filter.batchDay,
      attendanceStatus: markStatus,
    };
    console.log("detail =", detail);
    ContextValue.updateProgress(30);
    ContextValue.updateBarStatus(true);
    try {
      let attendance = await fetch(
        "http://localhost:8000/updateStudentAttendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(detail),
        }
      );
      ContextValue.updateProgress(60);
      attendance = await attendance.json();
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      AttendanceUpdated();
    } catch (error) {
      ContextValue.updateProgress(100);
      ContextValue.updateBarStatus(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log("error =", error.message);
    }
  };

  let BatchDay = [];

  const setBatch = (e) => {
    console.log("batch =", e.target.value);

    setFilter({
      ...filter,
      ["batch"]: e.target.value,
      ["batchDay"]: BatchDay[e.target.selectedIndex],
    });

    // console.log("batchday =",BatchDay,e.target.selectedIndex,BatchDay[e.target.selectedIndex])
  };

  const getStudentAttendance = async (student) => {
    let attendance = await ContextValue.getAttendance(
      date.selectedDate,
      id,
      filter.batch
    );
    console.log("attendance =", attendance, date.selectedDate);

    if (attendance.length !== 0) {
      // console.log("if att",attendance[0].studentId)
      if (attendance[0].attendanceStatus === "holiday") {
        setMarkStatus("holiday");
      } else {
        setMarkStatus("class");
      }
      setstudentId(attendance[0].studentId);
      ContextValue.updateStudentId(attendance[0].studentId);
      console.log("studentID =", attendance[0].studentId);
      setAddAttendenceStatus(true);
      setAttendance(attendance);
    } else {
      console.log("else att");
      setMarkStatus("class");
      let tempStudentId = [...studentId];

      tempStudentId = [];

      student.map((data) => {
        tempStudentId.push({
          studentId: data._id,
          status: undefined,
        });
      });

      const filteredData = tempStudentId.filter((element) => {
        return element.status !== undefined && element.status !== "";
      });

      // Get the count of non-empty, non-undefined elements
      const count = filteredData.length;
      setAttendanceCount(count);

      console.log("getstudent function =", tempStudentId, currentStudent);
      setstudentId(tempStudentId);
      ContextValue.updateStudentId(tempStudentId);
      setAddAttendenceStatus(false);
      setAttendance(attendance);
    }
  };

  const setHolidayStatus = (e, value) => {
    console.log("mark status =", markStatus, e.target.checked);
    if (e.target.checked) {
      setMarkStatus(value);
      let tempStudentId = [...studentId];
      tempStudentId = [];
      currentStudent.map((data) => {
        tempStudentId.push({
          studentId: data._id,
          status: value,
        });
      });

      setstudentId(tempStudentId);
      ContextValue.updateStudentId(tempStudentId);
      setAttendanceCount(tempStudentId.length);
      console.log("student id =", tempStudentId);
    } else {
      setMarkStatus("class");

      let tempStudentId = studentId.map((data, index) => {
        return {
          studentId: data.studentId,
          status: undefined,
        };
      });

      console.log("temp student id =", tempStudentId);

      const filteredData = tempStudentId.filter((element) => {
        return element.status !== undefined && element.status !== "";
      });

      // Get the count of non-empty, non-undefined elements
      const count = filteredData.length;
      setAttendanceCount(count);

      console.log("count =", count);

      setstudentId(tempStudentId);
      ContextValue.updateStudentId(tempStudentId);
    }
  };

  return (
    <>
      <Header />
      <div className="attendance-detail-section">
        <TrainerSlidebar />

        <div className="right-side-container">
          <div className="batch-course-filter j-c-space-between w-80">
            <div>
              {runningBatch && (
                <select
                  className="custom-select mr-sm-2"
                  name="batch"
                  onChange={(e) => setBatch(e)}
                >
                  <option disabled selected>
                    Batch
                  </option>

                  {runningBatch.map((data, index) => {
                    BatchDay[index + 1] = data.Days;
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

            {filter.batch !== "" && (
              <div className="d-flex align-center f-20 attendance-status">
                <input
                  type="checkbox"
                  className="h-f-content h-20 w-20"
                  checked={markStatus === "holiday" && true}
                  onClick={(e) => setHolidayStatus(e, "holiday")}
                ></input>
                <label className="mb-0">Holiday</label>
                <input
                  type="checkbox"
                  className="h-f-content h-20 w-20"
                  checked={markStatus === "present" && true}
                  onClick={(e) => setHolidayStatus(e, "present")}
                ></input>
                <label className="mb-0">All Present</label>
                <input
                  type="checkbox"
                  className="h-f-content h-20 w-20"
                  checked={markStatus === "absent" && true}
                  onClick={(e) => setHolidayStatus(e, "absent")}
                ></input>
                <label className="mb-0">All Absent</label>
              </div>
            )}
          </div>

          <div _ngcontent-ng-c2587924599="" className="materialTableHeader">
            <div _ngcontent-ng-c2587924599="" className="left">
              <ul
                _ngcontent-ng-c2587924599=""
                className="header-buttons-left ms-0"
              >
                <li _ngcontent-ng-c2587924599="" className="tbl-title">
                  <h3 _ngcontent-ng-c2587924599="">Student Attendance</h3>
                </li>

                <input
                  className="btn btn-primary"
                  type="date"
                  max={currentDate}
                  value={date.selectedDate}
                  onChange={(e) => setDateFunc(new Date(e.target.value))}
                />
                <button
                  className="btn btn-primary"
                  onClick={(e) => getStudentAttendance(currentStudent)}
                >
                  Filter
                </button>
                <h2>{date.selectedDate && date.selectedDate}</h2>
                <h2>{date.selectedDate && date.daysName}</h2>
              </ul>
            </div>
          </div>

          <div className="table-responsive recentOrderTable">
            <table className="table verticle-middle table-responsive-md attendence-detail-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Batch Time</th>
                  {/* <th scope="col">Status</th> */}
                  <th scope="col">Batch</th>
                  <th scope="col">Present</th>
                  <th scope="col">Absent</th>
                  {markStatus === "holiday" && <th scope="col">Holiday</th>}
                </tr>
              </thead>
              <tbody>
                {currentStudent &&
                  currentStudent.map((data, index) => 
                  {
                    console.log("student id form map", studentId);
                    return (
                      <tr key={index}>
                        <td>{data.Name}</td>
                        <td>{data.BatchTiming}</td>
                        <td>{filter.batch}</td>
                        <td>
                          <input
                            type="radio"
                            required
                            value="present"
                            checked={
                              ContextValue.studentId.length===currentStudent.length &&
                              ContextValue.studentId[index].status ===
                                "present" && true
                            }
                            name={`attendance-checkbox${index}`}
                            disabled={markStatus === "holiday" ? true : false}
                            onClick={(e) =>
                              setAttendanceId(e.target.value, data._id, index)
                            }
                          ></input>
                        </td>

                        <td>
                          <input
                            type="radio"
                            required
                            value="absent"
                            checked={
                              ContextValue.studentId.length===currentStudent.length &&
                              ContextValue.studentId[index].status ===
                                "absent" &&
                              true
                            }
                            name={`attendance-checkbox${index}`}
                            disabled={markStatus === "holiday" ? true : false}
                            onClick={(e) =>
                              setAttendanceId(e.target.value, data._id, index)
                            }
                          ></input>
                        </td>

                        {markStatus === "holiday" && (
                          <td>
                            <input
                              type="radio"
                              required
                              value="absent"
                              name={`attendance-checkbox${index}`}
                              checked={true}
                              disabled
                            ></input>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="update-attendance">
              {AttendanceStatus === false ? (
                <button
                  className="btn btn-primary"
                  disabled={currentStudent.length !== attendanceCount}
                  type="submit"
                  onClick={addAttendance}
                >
                  Add Attendance
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  disabled={currentStudent.length !== attendanceCount}
                  onClick={updateAttendance}
                >
                  Update Attendance
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAttendance;
