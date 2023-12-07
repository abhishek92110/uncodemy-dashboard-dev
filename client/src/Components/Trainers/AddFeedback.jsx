import React, { useEffect, useState } from 'react'
import CreateIcon from '@mui/icons-material/Create';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Cslidebar from '../Counselor/Cslidebar';
// import { NavLink} from "react-router-dom";
// import CreateIcon from "@mui/icons-material/Create";

function AddFeedback() {

    const [demo, setDemo] = useState();
    const [feedbackStatus, setFeedbackStatus] = useState()
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

  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();



  const badgeStatus = {
    Interested: "success",
    process: "warning",
    Reject: "danger",
  }

  useEffect(() => {
   
  }, []);

  const setStudentFeedback = async(studentId,status,DemoId)=>{

    console.log("status =",studentId,status)

    let feedback = await fetch("http://localhost:8000/addDemoFeedback",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({studentId,status})
    })

         feedback = await feedback.json()
    console.log("feedback =",feedback)


  }


  return (
    <>
     <Header/>
      <div className="sidebar-main-container right-side-container">
        <Cslidebar/>
        <div className="teacher-demo-container">
          <div className="">
            <div className="table-responsive recentOrderTable">
              <table className="table verticle-middle table-responsive-md">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Background</th>
                    <th scope="col">Course</th>
                    <th scope="col">Trainer</th>
                    <th scope="col">Time</th>
                    <th scope="col">Date</th>
                    <th scope="col">Add Feedback</th>
                  
                  </tr>
                </thead>
                <tbody>
                  {JSON.parse(localStorage.getItem("demoData")).map(
                    (data, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{data.Name}</td>
                          <td>{data.Background}</td>
                          <td>{data.Course}</td>
                          <td>{data.Trainer}</td>
                          <td>{data.Time}</td>
                          <td>{data.Date}</td>
                          <td>  
                              <select
                        id="exampleInputPassword1"
                        type="select"
                        name="Course"
                        class="custom-select mr-sm-2"                        
                        onChange={e=>setStudentFeedback(data._id,e.target.value)}                        
                    >
                        <option disabled selected >--Add Feedback--</option>
                    
                                <option  value="process" selected={data.status==="process"?true:false}>Process</option>
                                <option  value="Interested" selected={data.status==="Interested"?true:false}>Interested</option>
                                <option  value="Reject" selected={data.status==="Reject"?true:false}>Reject</option>                      
                        
                    </select></td>
                         
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

export default AddFeedback