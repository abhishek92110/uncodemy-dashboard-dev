import React, { useEffect, useState, useContext } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link, NavLink, useParams,useNavigate } from 'react-router-dom';
import "./TeacherDemo"
import Header from '../Header';
import Sidebar from '../Sidebar';
import TrainerSlidebar from './TrainerSlidebar';
import { StudentContext } from '../../context/StudentState'

function DemoOverview() {
 
    let sameDateTime = [];
    let studentData = [];
    const [demoList, setDemoList] = useState()
    const [demoStudentData, setDemoStudentData] = useState()
    let ContextValue = useContext(StudentContext);

    const navigation = useNavigate()

    let monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


    const date = new Date();

    const day = date.getDate()<10?`0${date.getDate()}`:date.getDate();
    console.log("day of demo overview",day)
    const month = date.getMonth();
    const year = date.getFullYear();


    // const getTrainerdemo = async () => {

    //     const res = await fetch("http://localhost:8000/getDemoes", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ TrainerId: localStorage.getItem('TrainerId'), month: monthName[month], day: day.toString(), year: year.toString() })
    //     });

    //     const data = await res.json();
    //     console.log('data of demo =', data)
    //     if (res.status === 422 || !data) {
    //         console.log("error ");

    //     }
    //     filterDemo(data)
    // }
    useEffect(() => {
        fetchTrainerStatus()
     
    }, [])

    async function fetchTrainerStatus() {
        try {
          const status = await ContextValue.checkTrainer();
          
      console.log('status of trainer =', status);
      if(status.status==="active"){
        // getTrainerdemo();
        getTrainerUpcomingDemo(status.data._id)
      }
      else{
        navigation('/')
        alert('you are not authorized')
      }
    
        } catch (error) {
          console.error('Error fetching admin status:', error);
        }
      }


      const getTrainerUpcomingDemo  =async(id)=>{
        console.log("trainer upcoming function",id)


        let counselorUpcoming = await ContextValue.trainerUpcomimgDemo(id)

        console.log('counselor demo upcoming =',counselorUpcoming)
        setDemoList(counselorUpcoming.Demo)
        setDemoStudentData(counselorUpcoming.totalDemoStudent)

        // let demo = await ContextValue.UpcomimgTrainerDemo(id)

        // console.log('upcoming trainer demo =',demo)
        // setDemoList(demo.demolist)
        // setDemoStudentData(demo.demoStudent)
      }

 

    console.log('same date =', sameDateTime,sameDateTime.length,studentData, studentData[0])

    return (
        <>
            <Header />
            <div className='sidebar-main-container'>
            <TrainerSlidebar/>
         
            <div className='main-container right-side-container'>
                <div className="w-80">
                    <div className="table-responsive recentOrderTable">
                    <table id="datatable"  className="table table-striped table-bordered"cellspacing="0" width="100%" >
                            <thead>
                                <tr>
                                    <th scope="col">No.</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">No Of Candidate</th>
                                    <th scope="col">Counsellor</th>
                                    <th scope="col">Link</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demoList && demoList.map((data, index) => {
                                    return (
                                        <tr>
                                            <td>{index+1}</td>
                                            <td>{data.Date}</td>
                                            <td>{data.Time}</td>
                                            <td>{demoStudentData[index].length}</td>
                                            <td>{data.CounselorName}</td>
                                            <td><Link to={data.link}><button className='btn btn-primary'>Class Link</button></Link ></td>
                                            <td>  <button className="btn btn-success" onClick={e=>{navigation('/trainer/teacherdemo',{state:{demoStudentData:demoStudentData[index]}})}}  ><RemoveRedEyeIcon /></button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default DemoOverview