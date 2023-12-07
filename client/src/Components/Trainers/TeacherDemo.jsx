import React, { useEffect, useState } from 'react'
import CreateIcon from '@mui/icons-material/Create';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { useLocation } from 'react-router-dom';
// import { NavLink} from "react-router-dom";
// import CreateIcon from "@mui/icons-material/Create";

function TeacherDemo() {

  const location = useLocation()

  const {demoStudentData} = location.state
  const [filterDemoStudent, setFilterDemoStudent] = useState(demoStudentData)

  console.log("demoStudentData =",demoStudentData)

    const [demo, setDemo] = useState();
    // const [demoStudent, setDemoStudent] = useState(JSON.parse(localStorage.getItem("demoData")))
    
    let monthName = [
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

  const [detail, setDetail] = useState({
    status: null,  
  })

  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const getTrainerdemo = async () => {
    const res = await fetch("http://localhost:8000/getDemoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TrainerName: localStorage.getItem("TrainerName"),
        month: monthName[month],
        day: day.toString(),
        year: year.toString(),
      }),
    });

    const data = await res.json();
    console.log("data of demo =", data);
    if (res.status === 422 || !data) {
      console.log("error ");
    } else {
      setDemo(data);
    }
  };

  const badgeStatus = {
    Interested: "success",
    process: "warning",
    Reject: "danger",
  }

  useEffect(() => {
    getTrainerdemo();
  }, []);


  const filterDemo = ()=>{

    const filterStudent  = demoStudentData.filter(data=>{
      return (
        data.status===detail.status
      )
    })

    setFilterDemoStudent(filterStudent)

  }


  return (
    <>

    
     
      <div className="sidebar-main-container right-side-container">
       
        <div className="teacher-demo-container">
        <div className="preference-thumb thumb">
                <label className="form-label">Feedback Status :</label>
                <select className="custom-select mr-sm-2" required name='status' onChange={(e) => setDetail({...detail,["status"]:e.target.value})}>
                  <option selected>Feedback Status...</option>           
                      <option value="process">Process</option>
                      <option value="Interested">Interested</option>
                      <option value="Reject">Reject</option>
                                    
                </select>

                <button className='btn btn-primary' onClick={filterDemo}>Search</button>
                
              </div>
          <div>
            <div className="table-responsive recentOrderTable">
              <table className="table verticle-middle table-responsive-md">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Number</th>
                    <th scope="col">Background</th>
                    <th scope="col">Course</th>
                    <th scope="col">Trainer</th>
                    <th scope="col">Time</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    
                  
                  </tr>
                </thead>
                <tbody>
                  {filterDemoStudent && filterDemoStudent.map(
                    (data, index) => {
                      console.log('demo status =',data.status)
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{data.Name}</td>
                          <td>{data.Number}</td>
                          <td>{data.Background}</td>
                          <td>{data.Course}</td>
                          <td>{data.Trainer}</td>
                          <td>{data.Time}</td>
                          <td>{data.Date}</td>
                          <td>
                            <span
                              className={`badge badge-rounded badge-${
                                badgeStatus[data.status]
                              }`}
                            >
                              {data.status}
                            </span>
                          </td>
                      
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeacherDemo