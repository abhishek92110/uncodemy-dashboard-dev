import React, { useEffect, useState, useContext } from 'react'
import { Link, useParams, useNavigate  } from 'react-router-dom'
import TrainerSlidebar from './TrainerSlidebar'
import Header from '../Header'
import { StudentContext } from '../../context/StudentState'
import Sidebar from '../Sidebar'


export default function AboutTrainer() {

  // const {id} = useParams()
  const navigate = useNavigate();

  document.title = "StudentDashboard - About Trainer"
  let ContextValue = useContext(StudentContext);


  let sameDateTime = [];
  let studentData = [];
  const [allStudent, setAllStudent] = useState()
  const [trainer, setTrainer] = useState()
  const [currentStudent, setCurrentStudent] = useState()
  const [runningBatch, setRunningBatch] = useState()
  const [total, setTotal] = useState()
  const [newTotal, setNewTotal] = useState()
  const [newStudent, setNewStudent] = useState()
  const [demoUpcomingList, setDemoUpcomingList] = useState()
  const [demoUpcomingStudent, setDemoUpcomingStudent] = useState()
  const [demoStudentData, setDemoStudentData] = useState()
  const [course, setCourse] = useState()
  const [allDemo, setAllDemo] = useState()
  const [allDemoStudent, setAllDemoStudent] = useState()
  const [newDemo, setNewDemo] = useState()
  const [newDemoStudent, setNewDemoStudent] = useState()
  const [filter, setFilter] = useState(
    {
      course: "",
      batch: ""
    }
  )
  const [filterStatus, setFilterStatus] = useState(false)
  const { id } = useParams()
  console.log('id =', id)
  useEffect(() => {

    fetchTrainer(id)


  }, [])
  


  const getBatch = async (trainerid) => {
    let batchData = await ContextValue.getBatchByTrainer(trainerid);

    // batchData = batchData.runningBatches.filter(data => {
    //   return data.Trainer === trainerid
    // })
    console.log('batch data =', batchData)
    setRunningBatch(batchData)

  }


  async function fetchTrainer(id) {
    try {
      const status = await ContextValue.getSingleTrainer(id);

      console.log('status of trainer =', status);
      if (status.status === "active") {
        getTrainerData(status.userIndividual)
        localStorage.setItem('trainerId', status.userIndividual._id)
        getNewTrainerStudent(status.userIndividual._id)
        getBatch(status.userIndividual._id)
        getTrainerDemo(status.userIndividual._id)
        getNewTrainerDemo(status.userIndividual._id)
        setCourse(status.userIndividual.Course)
        getTrainerUpcoming(status.userIndividual._id)
        
      }


    } catch (error) {
      console.error('Error fetching admin status:', error);
    }
  }


  const getTrainerUpcoming = async(id)=>{
    let counselorUpcoming = await ContextValue.trainerUpcomimgDemo(id)

    console.log('counselor demo upcoming =',counselorUpcoming)
    setDemoUpcomingList(counselorUpcoming.Demo)
    setDemoUpcomingStudent(counselorUpcoming.totalDemoStudent)
  }




  const getTrainerDemo =async(id)=>{
    let trainerDemo = await ContextValue.getTrainerDemo(id)
    console.log("trainer demo =",trainerDemo)
    setAllDemo(trainerDemo.Demo)
    setAllDemoStudent(trainerDemo.totalDemoStudent)
  }

  const getNewTrainerStudent = async(id)=>{
    const trainerStudent = await ContextValue.totalNewTrainerStudent(id)
    setNewStudent(trainerStudent)
    setNewTotal(trainerStudent.length)
    console.log('set new total =',trainerStudent.length,trainerStudent)
  }

  const getNewTrainerDemo = async(id)=>{
    let month = (new Date().getMonth())
    let MonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    
    let newTrainerDemo  = await ContextValue.getTrainerNewDemo(id, MonthName[month])
    console.log('newTrainerDemo =',newTrainerDemo)

    setNewDemo(newTrainerDemo.Demo)
    setNewDemoStudent(newTrainerDemo.totalDemoStudent)

  }

  // const {id} = useParams()
  // console.log('trainer id=',id)



  const getTrainerData = async (trainerData) => {

    localStorage.setItem('TrainerName', trainerData.Name);

    const response = await fetch("http://localhost:8000/getStudentByTrainer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ TrainerId: trainerData._id })
    });

    const responseData = await response.json();
    console.log('response data= ', responseData.data)
    setAllStudent(responseData.data)
    setTotal(responseData.data.length)
    setCurrentStudent(responseData.data)
    console.log('trainer data =', trainerData)
    setTrainer(trainerData)
  }

  // const filterStudent = () => {
  //   setFilterStatus(true)
  //   console.log('filter =', filter)
  //   localStorage.setItem('trainerBatch', filter.batch)


  //   let filterStudent = allStudent.filter(data => {
  //     return ((filter.course === "" ? data.Course : data.Course === filter.course) && (filter.batch === "" ? data.Batch : data.Batch === filter.batch))
  //   })

  //   console.log('filter student =', filterStudent)
  //   setCurrentStudent(filterStudent)
  //   localStorage.setItem('filterStudent', JSON.stringify(filterStudent))
  // }

  const handleClick = () => {
    // Navigate to the new route and pass studentData as a parameter
    navigate('allStudent', { state: { allStudent } });
  };

  const moveToNewStudent = ()=>{
    navigate('newStudent', { state: { newStudent } });
  }


  const moveTobatch = ()=>{
    navigate('Trainer-Running-batch', { state: { runningBatch } });
  }

  const moveToCourse = ()=>{
    navigate('Trainer-Course', { state: { course } });

  }

  const moveToAllDemo=()=>{

    navigate('All-Demo', { state: { demo:allDemo,demoStudent:allDemoStudent, user:"trainer" } });
  
  }

  const moveToNewDemo = ()=>{
    navigate('New-Demo', { state: { demo:newDemo,demoStudent:newDemoStudent, user:"trainer" } });

  }

  const moveToUpcomingDemo = ()=>{
    navigate('upcomingDemo', {state: { demo:demoUpcomingList,demoStudent:demoUpcomingStudent } });
  }

  return (
    <>
      <Header />
      <div className='sidebar-main-container'>
        <Sidebar />
        <div className="content-body">
          {/* row */}
          <div className="container-fluid">
            <div className="row page-titles mx-0">
              <div className="col-sm-6 p-md-0">
                <div className="welcome-text">
                  <h4>About Trainer</h4>
                </div>
              </div>
              <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="index.html">Home</a>
                  </li>
                  <li className="breadcrumb-item active">
                    <a href="javascript:void(0);">Students</a>
                  </li>
                  <li className="breadcrumb-item active">
                    <a href="javascript:void(0);">About Student</a>
                  </li>
                </ol>
              </div>
              
            </div>
            <div className='detail-card'>
              <div className="col-xl-3 col-xxl-3 col-sm-6">
                <div className="widget-stat card p-0 bg-primary">
                  <div className="card-body">
                    <div className="media">
                      <span className="mr-3">
                        <i className="la la-users" />
                      </span>
                     <div className="media-body text-white" onClick={handleClick}>
                        <p className="mb-1">Total Students</p>
                        <h3 className="text-white">{total ? total : ""}</h3>
                        {/* <div className="progress mb-2 bg-white">
                          <div
                            className={`progress-bar progress-animated ${processBar >= 0 ? "bg-light" : "bg-danger"}`}
                            style={{ width: `${processBar >= 0 ? processBar : 100 + processBar}%` }}
                          />
                        </div> */}
                        {/* <small>{processBar >= 0 ? `${processBar}% Increase` : `${(-processBar)}% Decrease`} in 20 Days</small> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-xxl-3 col-sm-6">
                <div className="widget-stat card p-0 bg-warning">
                  <div className="card-body">
                    <div className="media">
                      <span className="mr-3">
                        <i className="la la-user" />
                      </span>
                      <div className="media-body text-white" onClick={moveToNewStudent}>
                        <p className="mb-1">New Students</p>
                        <h3 className="text-white">{newTotal ? newTotal : ""}</h3>
                        {/* <div className="progress mb-2 bg-white">
                          <div
                            className={`progress-bar progress-animated ${pastSevenStudent >= 0 ? "bg-light" : "bg-danger"}`}
                            style={{ width: `${pastSevenStudent >= 0 ? pastSevenStudent : 100 + pastSevenStudent}%` }}


                          />
                        </div> */}
                        {/* <small>{pastSevenStudent >= 0 ? `${pastSevenStudent}% Increase` : `${(-pastSevenStudent)}% Decrease`} in past 7 Days</small> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-xxl-3 col-sm-6">
                <div className="widget-stat card p-0 bg-secondary">
                  <div className="card-body">
                    <div className="media">
                      <span className="mr-3">
                        <i className="la la-graduation-cap" />
                      </span>
                      <div className="media-body text-white" onClick={moveTobatch}>
                        <p className="mb-1">Total Batch</p>
                        <h3 className="text-white">{runningBatch && runningBatch.length}</h3>
                        {/* <div className="progress mb-2 bg-white">
                          <div
                            className="progress-bar progress-animated bg-light"
                            style={{ width: "76%" }}
                          />
                        </div> */}
                        {/* <small>76% Increase in 20 Days</small> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-xxl-3 col-sm-6">
                <div className="widget-stat card p-0 bg-danger">
                  <div className="card-body">
                    <div className="media">
                      <span className="mr-3">
                        <i className="la la-dollar" />
                      </span>
                      <div className="media-body text-white" onClick={moveToCourse}>
                        <p className="mb-1">Total COURSE</p>
                        <h3 className="text-white">{course && course.length}</h3>
                        {/* <div className="progress mb-2 bg-white">
                          <div
                            className="progress-bar progress-animated bg-light"
                            style={{ width: "30%" }}
                          />
                        </div> */}
                        {/* <small>30% Increase in 30 Days</small> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              <div className='detail-card'>
              <div className="col-xl-3 col-xxl-3 col-sm-6">
                <div className="widget-stat card p-0 bg-danger">
                  <div className="card-body">
                    <div className="media">
                      <span className="mr-3">
                        <i className="la la-dollar" />
                      </span>
                      <div className="media-body text-white" onClick={moveToAllDemo}>
                        <p className="mb-1">Total Demo</p>
                        <h3 className="text-white">{allDemo && allDemo.length}</h3>
                        {/* <div className="progress mb-2 bg-white">
                          <div
                            className="progress-bar progress-animated bg-light"
                            style={{ width: "30%" }}
                          />
                        </div> */}
                        {/* <small>30% Increase in 30 Days</small> */}
                      </div>
                    </div>
              </div>
                 
                </div>
              </div>
              <div className="col-xl-3 col-xxl-3 col-sm-6">
                <div className="widget-stat card p-0 bg-danger">
                  <div className="card-body">
                    <div className="media">
                      <span className="mr-3">
                        <i className="la la-dollar" />
                      </span>
                      <div className="media-body text-white" onClick={moveToNewDemo}>
                        <p className="mb-1">New Demo</p>
                        <h3 className="text-white">{newDemo && newDemo.length}</h3>
                        {/* <div className="progress mb-2 bg-white">
                          <div
                            className="progress-bar progress-animated bg-light"
                            style={{ width: "30%" }}
                          />
                        </div> */}
                        {/* <small>30% Increase in 30 Days</small> */}
                      </div>
                    </div>
              </div>
                 
                </div>
              </div>

              <div className="col-xl-3 col-xxl-3 col-sm-6">
              <div className="widget-stat card p-0 bg-danger">
                <div className="card-body">
                  <div className="media">
                    <span className="mr-3">
                      <i className="la la-dollar" />
                    </span>
                    <div className="media-body text-white" onClick={moveToUpcomingDemo}>
                      <p className="mb-1">Upcoming Demo</p>
                      <h3 className="text-white">{demoUpcomingList && demoUpcomingList.length}</h3>
                      {/* <div className="progress mb-2 bg-white">
                        <div
                          className="progress-bar progress-animated bg-light"
                          style={{ width: "30%" }}
                        />
                      </div> */}
                      {/* <small>30% Increase in 30 Days</small> */}
                    </div>
                  </div>
                </div>
              </div>
            </div> 

              </div>

            
            <div className="row">
              <div className="col-xl-3 col-xxl-4 col-lg-4">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card">
                      <div
                        className="text-center p-3 overlay-box"
                        style={{ backgroundImage: "url(images/big/img1.jpg)" }}
                      >
                        <div className="profile-photo">
                          <img
                            src="images/profile/profile.png"
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-3 mb-1 text-white">{trainer && trainer.Name}</h3>
                      </div>


                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h2 className="card-title">about me</h2>
                      </div>
                      <div className=" pb-0">
                        <p>
                          {trainer && trainer.bio}
                        </p>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex px-0 justify-content-between">
                            <strong>Email</strong>
                            <span className="mb-0">{trainer && trainer.Email}</span>
                          </li>
                          <li className="list-group-item d-flex px-0 justify-content-between">
                            <strong>Phone</strong>
                            <span className="mb-0">{trainer && trainer.Number}</span>
                          </li>
                          <li className="list-group-item d-flex px-0 justify-content-between">
                            <strong>Code</strong>
                            <span className="mb-0">{trainer && trainer.code}</span>
                          </li>
                          <li className="list-group-item d-flex px-0 justify-content-between">
                            <strong>Company Name</strong>
                            <span className="mb-0">{trainer && trainer.CompanyName}</span>
                          </li>

                        </ul>
                      </div>

                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header d-block">
                        <h4 className="card-title">Address </h4>
                      </div>
                      <div className="">
                        <p className="mb-0">
                          {trainer && trainer.Address}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="col-xl-9 col-xxl-8 col-lg-8">
                <div className="card w-65">
                  <div className="">
                    <div className="profile-tab">
                      <div className="custom-tab-1">
                        <ul className="nav nav-tabs">
                          <li className="nav-item">
                            <a
                              href="#about-me"
                              data-toggle="tab"
                              className="nav-link active show"
                            >
                              About
                            </a>
                          </li>
          
                         
                        </ul>
                        <div className="tab-content">
                          <div id="about-me" className="tab-pane fade active show">
                            <div className="profile-personal-info pt-4">
                              <h4 className="text-primary mb-4">
                                Personal Information
                              </h4>
                              <div className="row mb-4">
                                <div className="col-lg-3 col-md-4 col-sm-6 col-6">
                                  <h5 className="f-w-500">
                                    Name <span className="pull-right">:</span>
                                  </h5>
                                </div>
                                <div className="col-lg-9 col-md-8 col-sm-6 col-6">
                                  <span>{trainer && trainer.Name}</span>
                                </div>
                              </div>
                              <div className="row mb-4">
                                <div className="col-lg-3 col-md-4 col-sm-6 col-6">
                                  <h5 className="f-w-500">
                                    Email <span className="pull-right">:</span>
                                  </h5>
                                </div>
                                <div className="col-lg-9 col-md-8 col-sm-6 col-6">
                                  <span>{trainer && trainer.Email}</span>
                                </div>
                              </div>
                              <div className="row mb-4">
                                <div className="col-lg-3 col-md-4 col-sm-6 col-6">
                                  <h5 className="f-w-500">
                                    Course <span className="pull-right">:</span>
                                  </h5>
                                </div>
                                {/* <div className="col-lg-9 col-md-8 col-sm-6 col-6">
                                  {trainer && trainer.Course.map(data => {
                                    return (
                                      <span style={{ "marginRight": "50px" }}>{data}</span>
                                    )
                                  })}
                                </div> */}
                              </div>
                              <div className="row mb-4">
                                <div className="col-lg-3 col-md-4 col-sm-6 col-6">
                                  <h5 className="f-w-500">
                                    Bio <span className="pull-right">:</span>
                                  </h5>
                                </div>
                                <div className="col-lg-9 col-md-8 col-sm-6 col-6">
                                  <span>{trainer && trainer.bio}</span>
                                </div>
                              </div>
                              <div className="row mb-4">
                                <div className="col-lg-3 col-md-4 col-sm-6 col-6">
                                  <h5 className="f-w-500">
                                    Headline <span className="pull-right">:</span>
                                  </h5>
                                </div>
                                <div className="col-lg-9 col-md-8 col-sm-6 col-6">
                                  <span>{trainer && trainer.Headline}</span>
                                </div>
                              </div>
                              <div className="row mb-4">
                                <div className="col-lg-3 col-md-4 col-sm-6 col-6">
                                  <h5 className="f-w-500">
                                    LinkedIn <span className="pull-right">:</span>
                                  </h5>
                                </div>
                                <div className="col-lg-9 col-md-8 col-sm-6 col-6">
                                  <Link to={trainer && trainer.LinkedinId}><button className='linkedin-btn'>show</button></Link>
                                </div>
                              </div>
                            </div>



                          </div>


                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
