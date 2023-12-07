import React, { useEffect, useContext, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import "./AboutTrainer"
import { StudentContext } from '../../context/StudentState'



export default function TrainerSlidebar() {

    const { id } = useParams()
    const navigate = useNavigate()
    let ContextValue = useContext(StudentContext);
    const navigation = useNavigate();
    const [trainerId, setTrainerId] = useState();
  
    useEffect(() => {
      fetchTrainerStatus();
    }, []);
  
    async function fetchTrainerStatus() {
      try {
        const status = await ContextValue.checkTrainer();
  
        console.log("status of trainer =", status);
        if (status.status === "active") {
          setTrainerId(status.data._id);
        } else {
          navigation("/");
          alert("you are not authorized");
        }
      } catch (error) {
        console.error("Error fetching admin status:", error);
      }
    }

    const moveToAttendance = (id)=>{
      console.log("attendance id =",id)
      navigation('/trainer/add-attendance',{state:{id}})
    }

    
  const moveToChangePasssword = ()=>{
    navigate('/Forget-Password', { state: { user:"trainer" } });
  }

    return (

        <>
            {/***********************************
      Sidebar start
  ************************************/}
            <div className="dlabnav">
                <div className="dlabnav-scroll">
                    <ul className="metismenu" id="menu">
                        {/* <li className="nav-label first">Main Menu</li> */}
                        <li>



                            <Link className="has-arrow" to={`/trainer`}>Trainer Dashboard</Link>


                        </li>
                        <li>
                            <Link className="has-arrow" to={`/trainer/TrainerMessage`}> Message</Link>
                        </li>
                        <li>
                            <Link className="has-arrow" to={`/trainer/assignment`}> Assignment</Link>
                        </li>                      
                        <li>
                            <Link className="has-arrow" to={`/trainer/demooverview`}> Demo</Link>
                        </li>
                        <li>
              <Link className="has-arrow" to={`/trainer/student/${trainerId}`}>
                Student
              </Link>
              </li>
              <li className='text-light sidebar-list cursor-pointer' onClick={e=>moveToAttendance(trainerId)}>
                
                Attendance
              
                </li>
              
         
                       
            <li onClick={moveToChangePasssword} className="text-light sidebar-list cursor-pointer">
             
             Change Password
        
         </li>

                    </ul>
                </div>
            </div>


        </>





    )
}