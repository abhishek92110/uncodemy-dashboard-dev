import React, { useEffect, useState, useContext } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import TrainerSlidebar from './TrainerSlidebar'
import Header from '../Header'
import { StudentContext } from '../../context/StudentState'


export default function TrainerDashboard() {

  document.title = "StudentDashboard - About Trainer"
  let ContextValue = useContext(StudentContext);

  const navigation = useNavigate()
  const navigate = useNavigate();

  const [allStudent, setAllStudent] = useState()
  const [demoUpcomingList, setDemoUpcomingList] = useState()

  const [trainer, setTrainer] = useState()
  const [currentStudent, setCurrentStudent] = useState()
  const [runningBatch, setRunningBatch] = useState()
  const [newTotal, setNewTotal] = useState()
  const [newStudent, setNewStudent] = useState()
  const [course, setCourse] = useState()
  const [total, setTotal] = useState()
  const [demoUpcomingStudent, setDemoUpcomingStudent] = useState()
  const [filter, setFilter] = useState(
    {
      course: "",
      batch: ""
    }
  )
  const [filterStatus, setFilterStatus] = useState(false)

  useEffect(() => {

    fetchTrainerStatus()


  }, [])

  const moveToUpcomingDemo = ()=>{
    navigate('upcomingDemo', {state: { demo:demoUpcomingList,demoStudent:demoUpcomingStudent } });
  }

  const getTrainerUpcoming = async(id)=>{
    let counselorUpcoming = await ContextValue.trainerUpcomimgDemo(id)

    console.log('counselor demo upcoming =',counselorUpcoming)
    setDemoUpcomingList(counselorUpcoming.Demo)
    setDemoUpcomingStudent(counselorUpcoming.totalDemoStudent)
  }


  const getBatch = async (id) => {
    let batchData = await ContextValue.getTrainerRunningBatch(id);

    console.log('batch data =', batchData)
    setRunningBatch(batchData)

  }


  async function fetchTrainerStatus() {
    try {
      const status = await ContextValue.checkTrainer();

      console.log('status of trainer =', status);
      if (status.status === "active") {
        getTrainerData(status.data)
        localStorage.setItem('trainerData', JSON.stringify(status.data))
        localStorage.setItem('trainerId', status.data._id)
        getBatch(status.data._id)
        getTrainerUpcoming(status.data._id)
        getNewTrainerStudent(status.data._id)
        setCourse(status.data.Course)
      }
      else {
        navigation('/')
        alert('you are not authorized')
      }

    } catch (error) {
      console.error('Error fetching admin status:', error);
    }
  }

  // const {id} = useParams()
  // console.log('trainer id=',id)

  const getStudentData = async () => {


  }

  const getTrainerData = async (trainerData) => {

    localStorage.setItem('TrainerName', trainerData.Name);
    localStorage.setItem('TrainerId', trainerData._id);

    const response = await fetch("http://localhost:8000/getStudentByTrainer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ TrainerId: trainerData._id })
    });

    const responseData = await response.json();
    console.log('response data= ', responseData.data)
    localStorage.setItem('trainerStudent', JSON.stringify(responseData.data))
    setAllStudent(responseData.data)
    setCurrentStudent(responseData.data)
    setTotal(responseData.data.length)
    console.log('total student =', responseData.data.length)
    setTrainer(trainerData)
    getStudentData()
  }

  const filterStudent = () => {
    setFilterStatus(true)
    console.log('filter =', filter)
    localStorage.setItem('trainerBatch', filter.batch)


    let filterStudent = allStudent.filter(data => {
      return ((filter.course === "" ? data.Course : data.Course === filter.course) && (filter.batch === "" ? data.Batch : data.Batch === filter.batch))
    })

    console.log('filter student =', filterStudent)
    setCurrentStudent(filterStudent)
    localStorage.setItem('filterStudent', JSON.stringify(filterStudent))
  }

  const getNewTrainerStudent = async(id)=>{
    const trainerStudent = await ContextValue.totalNewTrainerStudent(id)
    setNewStudent(trainerStudent)
    setNewTotal(trainerStudent.length)
    console.log('set new total =',trainerStudent.length,trainerStudent)
  }

  const handleClick = () => {
    // Navigate to the new route and pass studentData as a parameter
    navigate('allStudent', { state: { allStudent, user:"trainer" } });
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

  return (
    <>
      <Header />

      <div className='sidebar-main-Trainer-container'>
        <TrainerSlidebar />
        <div className="content-body w-80">

        <div className='detail-card my-2'>
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
                      <div className="card-body pb-0">
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
                      <div className="card-body">
                        <p className="mb-0">
                          {trainer && trainer.Address}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="col-xl-9 col-xxl-8 col-lg-8">
                <div className="card">
                  <div>
                    <div className="profile-tab">
                      <div className="custom-tab-1">
                        <ul className="nav nav-tabs">
                          <li className="nav-item">
                            <a
                              href="#about-me"
                              data-toggle="tab"
                              className="nav-link active show"
                            >
                              About Me
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
                                <div className="col-lg-9 col-md-8 col-sm-6 col-6">
                                  {trainer && trainer.Course.map(data => {
                                    return (
                                      <span style={{ "marginRight": "50px" }}>{data}</span>
                                    )
                                  })}
                                </div>
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
      {/***********************************
        Content body end
    ************************************/}
    </>
  )
}
