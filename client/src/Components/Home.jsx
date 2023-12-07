import React, { useState, useEffect, useContext } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MessageIcon from '@mui/icons-material/Message';
import { NavLink, useNavigate } from 'react-router-dom';
import { adddata, deldata, updatedata } from '../context/ContextProvider';
import Swal from 'sweetalert2'
import Header from './Header';
import Sidebar from './Sidebar';
import { StudentContext } from '../context/StudentState';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Link, useParams } from 'react-router-dom';

export default function Home() {

  let ContextValue = useContext(StudentContext);

  document.title = "StudentDashboard - Admin panel"

  const navigation = useNavigate();
  const navigate = useNavigate();

  let sameDateTime = [];
  let studentData = [];

  const [allStudent, setAllStudent] = useState()
  const { dltdata, setDLTdata } = useContext(deldata);
  const { udata, setUdata } = useContext(adddata);
  const { updata, setUPdata } = useContext(updatedata);
  const [totalStudent, setTotalStudent] = useState()
  const [newStudent, setNewStudent] = useState()
  const [pastSevenStudent, setPastSevenStudent] = useState()
  const [processBar, setProcessBar] = useState()
  // const [searchQuery, setSearchQuery] = useState();
  const [allStudentData, setAllStudentData] = useState()
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(20)
  const [totalItem, setTotalItem] = useState()
  const [currentTrainer, setCurrentTrainer] = useState()
  const [user, setUser] = useState("student")
  const [currentStudent, setCurrentStudent] = useState()
  const [counselor, setCounselor] = useState()
  const [total, setTotal] = useState()
  const [newTotal, setNewTotal] = useState()
  const [totalAmount, setTotalAmount] = useState()
  const [totalrunningBatch, setTotalRunningBatch] = useState()
  const [register, setRegister] = useState()
  const [currentRegister, setCurrentRegister] = useState()
  const [allDemo, setAllDemo] = useState()
  const [newDemo, setNewDemo] = useState()
  const [demoList, setDemoList] = useState()
  const [demoStudentData, setDemoStudentData] = useState()
  const [allDemoList, setAllDemoList] = useState()
  const [newDemoStudentData, setNewDemoStudentData] = useState()
  const [newDemoList, setNewDemoList] = useState()
  const [upcomingDemoList, setUpcomingDemoList]  = useState()
  const [upcomingDemoStudent, setUpcomingDemoStudent]  = useState()
  const [allCourse, setAllCourse] = useState()
  const [course, setCourse] = useState()
  const [weekDaysBatch, setWeekDaysbatch] = useState()
  const [weekEndBatch, setWeekEndBatch] = useState()



  //All Trainer
  let tempCurrentStudent;
  const [getuserdata, setUserdata] = useState("");
  console.log('trainer')
  const getTrainerdata = async () => {
    const res = await fetch("http://localhost:8000/trainer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    console.log('trainer data =', data)
    if (res.status === 422 || !data) {
      console.log("error ");

    } else {
      setUserdata(data)
      setCurrentTrainer(data)
      localStorage.setItem('allTrainer', JSON.stringify(data))
    }
  }

  async function fetchAdminStatus() {
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
    try {
      const status = await ContextValue.checkAdmin();

      console.log('status of admin =', status);
      if (status.status === "active") {
        getdata();
        getTrainerdata();
        getCounselorData();
        getTotalStudent()
        getNewStudent()
        getTotalFees()
        getRunningBatch()
        getRegisteredStudent()
        getAllDemo()
        getNewDemo()
        getAllBatches()
        getUpcomingDemo()
        getAllCourses()
      }
      else {
        navigation('/')
        alert('you are not authorized')
        ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
      }

    } catch (error) {
      Swal.fire({   
        icon:  'error',
        title: 'Oops...',
        text:  'Something went Wrong Try Again',
      }) 
      ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
      console.error('Error fetching admin status:', error);
    }
  }

  useEffect(() => {

    fetchAdminStatus();
    
   
  }, [])



  const getAllBatches = async()=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    let allCourse = await ContextValue.getAllBatchCourse()

 
    setWeekDaysbatch(allCourse.batchCourse[0].WeekDaysBatch)
    setWeekEndBatch(allCourse.batchCourse[0].WeekEndBatch)

    ContextValue.updateProgress(100)
    ContextValue.updateBarStatus(false)
  }
  const getAllCourses = async()=>{
    console.log('all course function')
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    let allCourse = await ContextValue.getAllMainSubCourse()

    console.log('all course =',allCourse)
    setAllCourse(allCourse.allCourse)
    setCourse(allCourse.courses)  
    ContextValue.updateProgress(100)
    ContextValue.updateBarStatus(false)
  }

  const getUpcomingDemo = async()=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    let upcoming = await ContextValue.UpcomimgDemo()
    setUpcomingDemoList(upcoming.Demo)
    setUpcomingDemoStudent(upcoming.totalDemoStudent)

    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
}



  const getRegisteredStudent = async()=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    let registeredStudent = await ContextValue.getRegisterStudent()
    setRegister(registeredStudent)
    setCurrentRegister(registeredStudent)

    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
  }

 

  const getRunningBatch = async()=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    const runningBatch = await ContextValue.getRunningBatch()
    setTotalRunningBatch(runningBatch.runningBatches.length)
    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
  }

  const getTotalFees = async()=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
    let totalFees  = await ContextValue.getTotalFees()
    setTotalAmount(totalFees)
    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
  }

  const getTotalStudent = async()=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    let TotalStudent = await ContextValue.totalStudent()
    
    setTotal(TotalStudent)
ContextValue.updateProgress(100)
ContextValue.updateBarStatus(false)


  }

  const getNewStudent = async()=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    let month = (new Date().getMonth() + 1).toString().padStart(2, '0');

    let newStudent = await ContextValue.newStudent(month)
    setNewTotal(newStudent)
    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
    
  }

  const getCounselorData = async () => {
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
    let counselor = await ContextValue.getAllCounselor();
    setCounselor(counselor.counselorData)
    localStorage.setItem('allCounselor', JSON.stringify(counselor.counselorData))
    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
    
  }



  const showMessagedialog = async (id) => {

    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    })

    if (text) {
      Swal.fire(text)
    }

    let checkId = [{ id }]

    let sendData = await fetch('http://localhost:8000/sendmessage', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, checkid: checkId, from: "admin" })
    })

    let fetchData = await sendData.json();


  }


  const getdata = async () => {

    const res = await fetch("http://localhost:8000/getdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    setTotalItem(data.length)
    localStorage.setItem('allStudent', JSON.stringify(data))

    // total student new student
    let total = 0;
    let newjoin = 0;
    let currentMonthStudent = 0;
    let pastMonthStudent = 0;
    let pastSevenDaysStudent = 0;


    setTotalStudent(total)
    setNewStudent(newjoin)
    setPastSevenStudent(pastSevenDaysStudent)

    setProcessBar(parseInt(((currentMonthStudent - pastMonthStudent) / pastMonthStudent) * 100))
    setPastSevenStudent(parseInt(((pastSevenDaysStudent - currentMonthStudent) / pastSevenDaysStudent) * 100))
    let processBar = ((currentMonthStudent - pastMonthStudent) / pastMonthStudent) * 100;


    if (res.status === 422 || !data) {

    } else {

      setAllStudent(data)
      setAllStudentData(data)
      setCurrentStudent(data)

    }

  }

  //sweetalert


  //Delete student 
  const deleteuser = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if(user==='student'){

          deleteStudent(id)
        }
        else if(user==='trainer'){

          deleteTrainer(id)
        }
        else if(user==='counselor'){

          deleteCounselor(id)
        }
      }
    })

  }


  const deleteStudent = async(id)=>{
    fetch(`http://localhost:8000/deleteuser/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }

    }).then(response => {

      const deletedata = response.json();

      if (deletedata.status === 422 || !deletedata) {
        console.log("error");
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Why do I have this issue?</a>'
        })
      }
      else {
        // setDLTdata(deletedata)
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        getdata();
      }
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      });

    })
  }
  const deleteTrainer = async(id)=>{
    fetch(`http://localhost:8000/deletetrainer/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }

    }).then(response => {

      const deletedata = response.json();

      if (deletedata.status === 422 || !deletedata) {
        console.log("error");
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Why do I have this issue?</a>'
        })
      }
      else {
        console.log("user deleted", deletedata);
        // setDLTdata(deletedata)
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        getdata();
      }
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      
      });

    })
  }
  const deleteCounselor = async(id)=>{
    fetch(`http://localhost:8000/deletecounselor/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }

    }).then(response => {

      const deletedata = response.json();

      if (deletedata.status === 422 || !deletedata) {
        console.log("error");
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Why do I have this issue?</a>'
        })
      }
      else {
        console.log("user deleted", deletedata);
        // setDLTdata(deletedata)
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        getdata();
      }
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      });

    })
  }
  //search
  const fetchQueryData = (Query) => {

    if(user==="student"){
    let filterQueryData = allStudentData.filter(data => {
      return (data.Name.toLowerCase().includes(Query.toLowerCase()))||(data.EnrollmentNo.toLowerCase().includes(Query.toLowerCase()) )
    })
    setCurrentStudent(filterQueryData)
  }
  if(user==="register"){
    let filterRegisterData = register.filter(data => {
      return (data.Name.toLowerCase().includes(Query.toLowerCase()))||(data.RegistrationNo.toLowerCase().includes(Query.toLowerCase()) )
    })

    setCurrentRegister(filterRegisterData)

  }  

  if(user === "trainer"){
    let filterTrainerData = getuserdata.filter(data => {
      return (data.Name.toLowerCase().includes(Query.toLowerCase()))||(data.code.toLowerCase().includes(Query.toLowerCase()) )

    })
    setCurrentTrainer(filterTrainerData)

  }
  if(user==="counselor"){
    let filterCounselorData = counselor.filter(data => {
      return (data.Name.toLowerCase().includes(Query.toLowerCase()))||(data.counselorNo.toLowerCase().includes(Query.toLowerCase()) )
      
    })
    setCounselor(filterCounselorData)

  }
  
   
    
  }

  const badgeStatus = {
    pending: "warning",
    backout: "dark",
    deactive: "danger",
    active: "success"
  }
  const registerStatus = {
    Process: "warning",
    Added: "success",
    BackOut: "dark"
  }

  const moveToEditTrainer = (trainer)=>{
    navigate('/EditTrainer', { state: { trainer } });

  }
  const moveToEditCounselor = (counselor)=>{
    navigate('/EditCounselor', { state: { counselor } });

  }

  const moveToViewFee = ()=>{
    navigate('ViewFee', { state: { fee:totalAmount } });
  }

  const moveToAddRegisteredStudent = (data)=>{
    navigate('Add-Registered-Student',{ state: { data } })
  }

  const moveToRegisterStudent = ()=>{
    navigate('Registered-Student',{ state: { registerStudent: register} })
  }

  const getAllDemo =async()=>{

    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
    const Demo = await ContextValue.getAllDemo()
    setAllDemoList(Demo.Demo)
    setDemoStudentData(Demo.totalDemoStudent)

    ContextValue.updateProgress(100)
    ContextValue.updateBarStatus(false)
 
  }




  const getNewDemo = async()=>{
    let month = (new Date().getMonth())
    let MonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    const demo = await ContextValue.getNewDemo(MonthName[month])

    setNewDemoList(demo.Demo)
    setNewDemoStudentData(demo.totalDemoStudent)
    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
  }

  const moveToAllDemo = ()=>{

    navigate('All-Demo',{state:{demoList:allDemoList,demoStudentData, status:"demo"}})
  }
  const moveToNewDemo = ()=>{
    
  navigate('New-Demo',{state:{demoList:newDemoList,demoStudentData:newDemoStudentData}})
  }

  const moveToUpcomingDemo = () => {  
    navigate('upcomingDemo', { state: { demo:upcomingDemoList,demoStudent:upcomingDemoStudent } });
  }

  const moveToAllCourses = ()=>{
     
    navigate('AllCourse', { state: { course:course, allCourse:allCourse } });
    
  }
  const moveToAllBatchTiming = ()=>{
    navigate('AllBatchTiming', { state: { weekDays:weekDaysBatch, weekEnd:weekEndBatch } });
    
  }


  return (

    <>
      <Header />
      <div className='sidebar-main-container'>
        <Sidebar />
        <div className="content-body">
          {/* row */}
          <div className="container-fluid">
            <div className="row">
              <div className='detail-card'>
              <div className="col-xl-3 col-xxl-3 col-sm-6">
                <div className="widget-stat card p-0 bg-primary">
                  <div className="card-body">
                    <div className="media">
                      <span className="mr-3">
                        <i className="la la-users" />
                      </span>
                      <div className="media-body text-white">
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
                      <div className="media-body text-white">
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
                    <Link to={`/admin/Running-batches`}>
                      <div className="media-body text-white">
                        <p className="mb-1">Total Batch</p>
                        <h3 className="text-white">{totalrunningBatch && totalrunningBatch}</h3>
                        {/* <div className="progress mb-2 bg-white">
                          <div
                            className="progress-bar progress-animated bg-light"
                            style={{ width: "76%" }}
                          />
                        </div> */}
                        {/* <small>76% Increase in 20 Days</small> */}
                      </div>
                      </Link>
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
                      <div className="media-body text-white" onClick={moveToViewFee}>
                        <p className="mb-1">Fees Collection</p>
                        <h3 className="text-white">{totalAmount && totalAmount.formattedFees}</h3>
                        {/* <div className="progress mb-2 bg-white">
                          <div
                            className="progress-bar progress-animated bg-light"
                            style={{ width: "30%" }}
                          />
                        </div> */}
                        
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
                    <i class="fa-regular fa-address-card"/>
                    </span>
                    <div className="media-body text-white" onClick={moveToRegisterStudent}>
                      <p className="mb-1">Total Registration</p>
                      <h3 className="text-white">{register && register.length}</h3>
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
                    <i class="fa-solid fa-id-card-clip"/>
                    </span>
                    <div className="media-body text-white" onClick={moveToAllDemo}>
                      <p className="mb-1">Total Demo</p>
                      <h3 className="text-white">{allDemoList && allDemoList.length}</h3>
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
                    <i class="fa-solid fa-id-card-clip"/>
                    </span>
                    <div className="media-body text-white" onClick={moveToNewDemo}>
                      <p className="mb-1">New Demo</p>
                      <h3 className="text-white">{newDemoList && newDemoList.length}</h3>
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
                    <i class="fa-solid fa-id-card-clip"/>

                    </span>
                    <div className="media-body text-white" onClick={moveToUpcomingDemo}>
                      <p className="mb-1">Upcoming Demo</p>
                      <h3 className="text-white">{upcomingDemoList && upcomingDemoList.length}</h3>
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
                    <i class="fa-regular fa-newspaper"/>
                    </span>
                    <div className="media-body text-white" onClick={moveToAllCourses}>
                      <p className="mb-1">All Course</p>
                      <h3 className="text-white">{allCourse && allCourse.length}</h3>
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
                    <i class="fa-regular fa-clock"/>
                    </span>
                    <div className="media-body text-white" onClick={moveToAllBatchTiming}>
                      <p className="mb-1">All BatchTiming</p>
                      <h3 className="text-white">{weekDaysBatch && (weekDaysBatch.length+weekEndBatch.length)}</h3>
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
              <div className="card-header">
                <button class={`btn btn-hover btn-outline-${user==="student"?"dark":"light"}`} onClick={e => setUser("student")}>Student</button>
                <button class={`btn btn-hover btn-outline-${user==="register"?"dark":"light"}`} onClick={e => setUser("register")}>Register Student</button>
                <button class={`btn btn-hover btn-outline-${user==="trainer"?"dark":"light"}`} onClick={e => setUser("trainer")}>Trainer</button>
                <button class={`btn btn-hover btn-outline-${user==="counselor"?"dark":"light"}`} onClick={e => setUser("counselor")}>Counsellor</button>
              </div>

              {user === "student" && <div className="col-xl-12 col-xxl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Student List</h4>
                  </div>
                  <div class="d-flex mb-20" role="search">
                    <input class="form-control me-2"
                      type="search"
                      placeholder="Search By Name or Enrollment No."
                      aria-label="Search"
                      name='search'
                      onChange={(e) => fetchQueryData(e.target.value)}
                    />
                    {/* <button class="btn btn-outline-dark" type="submit" onClick={fetchQueryData}>Search</button> */}

                  </div>
                  <div>
                    <div className="table-responsive recentOrderTable">
                      <table id="datatable" className="table table-striped table-bordered" cellspacing="0" width="100%" >
                        <thead>
                          <tr>
                            <th scope="col">EnrollmentNo.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Trainer</th>
                            <th scope="col">Admission Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Course</th>
                            <th scope="col">Fees</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStudent && currentStudent.map((data, index) => {

                            index = start + index;

                            return (
                              <tr>
                                <td>{data.EnrollmentNo}</td>
                                <td>{data.Name}</td>
                                <td className='d-flex flex-col'>{data.AllTrainer?data.AllTrainer.map(data=>{
                                  return(
                                    <td className='border-0'>{data}</td>
                                  )
                                }):data.TrainerName}</td>
                                <td>{data.BatchStartDate}</td>
                                <td>
                                  <span className={`badge badge-rounded badge-${badgeStatus[data.status]}`}>
                                    {data.status}
                                  </span>
                                </td>
                                <td>{data.Course}</td>
                                <td>{data.Fees}</td>
                                <td className='nav-link'>
                                  <button className="btn btn-success text-light"> <NavLink to={`/Aboutstudent/${data._id}`}> <RemoveRedEyeIcon /></NavLink></button>
                                  <button className="btn btn-primary text-light"> <NavLink to={`/EditStudents/${data._id}`}> <CreateIcon /></NavLink></button>
                                  <button className="btn btn-danger text-light" onClick={() => deleteuser(data._id)}><DeleteOutlineIcon /></button>
                                  <button className="btn btn-warning text-light" onClick={() => showMessagedialog(data._id)}><MessageIcon /></button>
                                  <button className="btn btn-danger text-light"><NavLink to={`/fullattendance/${data._id}`}><i class="fa-solid fa-clipboard-user text-light"></i></NavLink></button>
                                  <button className="btn btn-success "><NavLink to={`AddFees/${data._id}`}><CurrencyRupeeIcon /></NavLink></button>
                                </td>
                              </tr>
                            )
                          })
                          }

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>}

              {user === "trainer" &&
                <div className="col-xl-12 col-xxl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">Trainer List</h4>
                    </div>
                    <div class="d-flex mb-20" role="search">
                      <input class="form-control me-2"
                        type="search"
                        placeholder="Search By Trainer Name"
                        aria-label="Search"
                        name='search'
                        onChange={(e) => fetchQueryData(e.target.value)}
                      />
                      {/* <button class="btn btn-outline-dark" type="submit" onClick={fetchQueryData}>Search</button> */}
                    </div>
                    <div >
                      <div className="table-responsive recentOrderTable">
                        <table id="datatable" className="table table-striped table-bordered" cellspacing="0" width="100%" >

                          <thead>
                            <tr>
                             
                              <th scope="col">Trainer Code</th>
                              <th scope="col">Name</th>
                              <th scope="col">Number</th>
                              <th scope="col">Email</th>
                              <th scope="col">Address</th>
                              <th scope="col">Action</th>


                            </tr>
                          </thead>
                          <tbody>
                            {currentTrainer && currentTrainer.map((Trainerdata, index) => {



                              return (
                                <tr>
                                  
                                  <td>{Trainerdata.code}</td>
                                  <td>{Trainerdata.Name}</td>
                                  <td>{Trainerdata.Number}</td> 
                                  <td>{Trainerdata.Email}</td>
                                  <td>{Trainerdata.Address}</td>
                                  <td>
                                    <NavLink to={`/AboutTrainer/${Trainerdata._id}`}> <button className="btn btn-success"><RemoveRedEyeIcon /></button></NavLink>
                                      <button className="btn btn-primary" onClick={e=>{moveToEditTrainer(Trainerdata)}}><CreateIcon /></button>
                                    <button className="btn btn-danger" onClick={() => deleteuser(Trainerdata._id)}><DeleteOutlineIcon /></button>
                                    <button className="btn btn-warning text-light" onClick={() => showMessagedialog(Trainerdata._id)}><MessageIcon /></button>
                                  </td>
                                </tr>
                              )
                            })
                            }

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {user === "counselor" &&
                <div className="col-xl-12 col-xxl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">Counsellor List</h4>
                    </div>
                    <div class="d-flex mb-20" role="search">
                      <input class="form-control me-2"
                        type="search"
                        placeholder="Search By Counsellor List"
                        aria-label="Search"
                        name='search'
                        onChange={(e) => fetchQueryData(e.target.value)}
                      />
                      {/* <button class="btn btn-outline-dark" type="submit" onClick={fetchQueryData}>Search</button> */}
                    </div>
                    <div>
                      <div className="table-responsive recentOrderTable">
                        <table id="datatable" className="table table-striped table-bordered" cellspacing="0" width="100%" >

                          <thead>
                            <tr>
                              
                              <th scope="col">Counselor No.</th>
                              <th scope="col">Name</th>
                              <th scope="col">Number</th>
                              <th scope="col">Email</th>
                              <th scope="col">Address</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {counselor && counselor.map((CounselorData, index) => {

                              return (
                                <tr>
                                  
                                  <td>{CounselorData.counselorNo}</td>
                                  <td>{CounselorData.Name}</td>
                                  <td>{CounselorData.Number}</td>
                                  <td>{CounselorData.Email}</td>
                                  <td>{CounselorData.Address}</td>
                                  <td>
                                    <NavLink to={`/AboutCounselor/${CounselorData._id}`}> <button className="btn btn-success"><RemoveRedEyeIcon /></button></NavLink>
                                      <button className="btn btn-primary" onClick={e=>moveToEditCounselor(CounselorData)}><CreateIcon /></button>
                                    <button className="btn btn-danger" onClick={() => deleteuser(CounselorData._id)}><DeleteOutlineIcon /></button>
                                    <button className="btn btn-warning text-light" onClick={() => showMessagedialog(CounselorData._id)}><MessageIcon /></button>
                                  </td>
                                </tr>
                              )
                            })
                            }

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {user === "register" &&
                <div className="col-xl-12 col-xxl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="card-title">Register Student List</h4>
                    </div>
                    <div class="d-flex mb-20" role="search">
                      <input class="form-control me-2"
                        type="search"
                        placeholder="Search By Name or Registration No."
                        aria-label="Search"
                        name='search'
                        onChange={(e) => fetchQueryData(e.target.value)}
                      />
                      {/* <button class="btn btn-outline-dark" type="submit" onClick={fetchQueryData}>Search</button> */}
                    </div>
                    <div>
                      <div className="table-responsive recentOrderTable">
                        <table id="datatable" className="table table-striped table-bordered" cellspacing="0" width="100%" >

                          <thead>
                            <tr>
                              <th scope="col">Registration No.</th>
                              <th scope="col">Name</th>
                              <th scope="col">Number</th>
                              <th scope="col">Email</th>
                              <th scope="col">Counselor</th>
                              <th scope="col">Trainer</th>
                              <th scope="col">Registration Date</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>


                            </tr>
                          </thead>
                          <tbody>
                            {currentRegister && currentRegister.map((data, index) => {



                              return (
                                <tr>
                                  <td>{data.RegistrationNo}</td>
                                  <td>{data.Name}</td>
                                  <td>{data.Number}</td>
                                  <td>{data.Email}</td>
                                  <td>{data.Counselor}</td>
                                  <td>{data.TrainerName}</td>
                                  <td>{data.RegistrationDate}</td>
                                  <td>
                                  <span className={`badge badge-rounded badge-${registerStatus[data.status]}`}>
                                    {data.status}
                                  </span>
                                </td>
                                  <td>
                                      <button className="btn btn-primary" disabled={data.status==="Added"?true:false} onClick={e=>moveToAddRegisteredStudent(data)}><CreateIcon /></button>
                                    <button className="btn btn-danger" onClick={() => deleteuser(data._id)}><DeleteOutlineIcon /></button>
                                  </td>
                                </tr>
                              )
                            })
                            }

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {/* <div className='right-left-arrow'>
            <i class="fa-solid fa-left-long" onClick={backItem}></i>
            <i class="fa-solid fa-right-long" onClick={moveItem}></i>
            </div> */}

            </div>
          </div>
        </div>
      </div>




      {/***********************************
      Content body end
*/}
    </>

  )
}
