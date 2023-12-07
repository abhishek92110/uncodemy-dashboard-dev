import React, { useEffect, useState, useContext } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../../context/StudentState'
import Swal from 'sweetalert2'

function AttandanceSheet() {

  let monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  let dayName =   ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

  const [trainer, setTrainer] = useState()
  const [runningBatch, setRunningBatch] = useState()
  const [course, setCourse] = useState()
  const [allStudentData, setAllStudentData] = useState()
  const [lastDay, setLastDay] = useState(new Date().getDate())
  const [firstDay, setFirstDay] = useState(1)
  const [filteredMonth, setFilteredMonth] = useState()
  let currentMonth = monthName[((new Date().getMonth()))]
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [allAttendance, setAllAttendance] = useState()
  //   setAllStudentData(JSON.parse(localStorage.getItem('allStudent')))

  let ContextValue = useContext(StudentContext);

  const navigation = useNavigate()

  const [inpval, setINP] = useState({
    startdate: '',
    enddate: '',

  })

  const [detail, setDetail] = useState({

    trainer: null,
    batch: null,
    batchId:null
  })


  useEffect(() => {
    fetchAdminStatus()
    getTrainer()
    getBatch()
    getCourse()
  }, [])

  const getTrainer = async () => {
    const trainerData = await ContextValue.getAllTrainer();
    setTrainer(trainerData)
  }

  const getBatch = async () => {
    const batchData = await ContextValue.getRunningBatch();
    setRunningBatch(batchData.runningBatches)

  }

  const getCourse = async () => {
    const courseData = await ContextValue.getAllBatchCourse();
    setCourse(courseData.batchCourse[0].Course)
  }

  async function fetchAdminStatus() {
    try {
      const status = await ContextValue.checkAdmin();

      //console.log.log('status of admin =', status);
      if (status.status === "active") {
       
      }
      else {
        navigation('/')
        alert('you are not authorized')
      }

    } catch (error) {

    }
  }

  const [attendanceData, setAttendanceData] = useState()
  const [currentStudent, setCurrentStudent] = useState()
  const [dayRows, setDayRows] = useState([])
  const [attendenceRows, setAttendanceStatus] = useState([])




  const filterStudent = async() => {
    

    let batchStudent = await ContextValue.getRunningBatchStudent(detail.batch)
    console.log(" batch student =",batchStudent)

    setAllStudentData(batchStudent)
    setCurrentStudent(batchStudent)

  }

  const getAttendance = async () => {

    console.log("get Attendance =",detail)

    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    console.log('first last ', filteredMonth)
    try{
    let filterStatus = await fetch('http://localhost:8000/getMonthAttendance', {

      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: currentYear, month: filteredMonth, batch:detail.batch})

    })
    ContextValue.updateProgress(60)
    let data = await filterStatus.json()
    console.log('data =', data)

    setAllAttendance(data)
    extractAttendance(data, currentStudent)
    ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
  }
  catch(error){

    
  Swal.fire({   
    icon:  'error',
    title: 'Oops...',
    text:  'Something Went Wrong Try Again',
  }) 
  ContextValue.updateProgress(100)
    ContextValue.updateBarStatus(false)

  }

  }


  const filterDateByDate =(attendance,i)=>{
 
 
      return(attendance.filter(data=>{
        return data.day==i
      }))
    
  }

  const extractAttendance = (data, currentStudent) => {

    let tempDayRows = dayRows
    let tempAttendenceRows = attendenceRows
    tempAttendenceRows = []
    tempDayRows = []

    console.log('extract attendace current year =',currentYear,monthName,filteredMonth,lastDay,firstDay)

    for (let i = firstDay; i <= lastDay; i++) {

      let daysName = dayName[(new Date(currentYear, (filteredMonth-1), i).getDay())];

      tempDayRows.push(
        <th className='days'>
          <span>{i}</span>
          <span className='daysName'>{daysName}</span>
        </th>
      )
    }


    console.log("current student =", currentStudent)
 
   {currentStudent && currentStudent.map((studentData, index) => {
      // console.log('temp attendance =',tempAttendenceRows)
      tempAttendenceRows[index] = []
      let attendanceIndex =0; 
      for (let i = firstDay; i <= lastDay; i++) {
    
     
       
        // let daysName = dayName[(new Date(currentYear, monthName.indexOf(filteredMonth), i).getDay())];
        let filterAttendance = filterDateByDate(data.filterAttendance,i)
        console.log("filter attendance =",filterAttendance,data.filterAttendance,i)
  
        

          if (filterAttendance.length!=0) {
            // console.log("inside if attendance index",attendanceIndex,filterAttendance)
    
            filterAttendance[0].studentId.map(data=>{
              if(studentData._id===data.studentId){
                
                tempAttendenceRows[index].push(<td className={`text-${data.status==="present"?"success":"danger"}`}>{data.status}</td>)

              }

            })
            
              attendanceIndex = attendanceIndex+1

            }

        

          else{
           
              tempAttendenceRows[index].push(<td className='text-warning'>NM</td>)

          }       
        
      }

    })}

    setDayRows(tempDayRows)
    setAttendanceStatus(tempAttendenceRows)
  }

  document.title = "StudentDashboard - Attendance Sheet"

  const currentDate = new Date()
  const day = currentDate.getDay()
  let tempDays = currentDate.getDate()

  let tempAttendenceRows = [];
  let tempDayRows = []

  for (let i = 1; i <= tempDays; i++) {
    let daysName = dayName[(new Date(currentYear, filteredMonth, i).getDay())];
    tempDayRows.push(
      <th className='days'>
        <span>{i}
        </span>
        <span className='daysName'>{daysName}
        </span>
      </th>
    )
    if (daysName === 'fri') {

      tempAttendenceRows.push(<td className='text-warning'>H</td>)
    }
    else {
      tempAttendenceRows.push(<td className='text-success'>p</td>)
    }
  }

  

  const setMonth =(month)=>{
    console.log('month =',monthName[month-1],currentMonth)
    setFilteredMonth(month)

    if(monthName[month-1]==currentMonth){
      setLastDay(new Date().getDate())
      console.log('current month =',month,new Date().getDate())
    }
else{
  const lastDayOfMonth = new Date(currentYear, month, 0);
  let lastDate = lastDayOfMonth.getDate();
  setLastDay(lastDate)
  console.log("last date =",lastDate)
}
  
  }

  const batchData  =[]

  const setBatchDetail = (e)=>{

    setDetail({...detail, [e.target.name]:e.target.value, ["batchId"]:batchData[(e.target.selectedIndex)-1]})


  }


  return (
    <>
      <Header />
      <div className='sidebar-main-container'>
      <Sidebar />


      <div className="table-responsive recentOrderTable right-side-container">
        
      <div className='select-message'>
     
        <div className="batch-thumb thumb d-flex">
          {runningBatch && <select className="custom-select mr-sm-2" required name='batch' onChange={(e) => setBatchDetail(e)} >
            <option selected>Choose Batch...</option>
            { runningBatch.map((data,index) => {
              batchData[index]=data._id
              return (
                <option value={data.Batch}>{data.Batch}</option>
              )
            })}
          </select>}
          <button className='btn btn-primary' onClick={filterStudent}>Filter</button>
        </div>
        <div className="start-end-section batch-thumb thumb">
        <div className="start-section">
          <select className="custom-select mr-sm-2" onChange={e=>setMonth(e.target.value)}>
            <option disabled selected>--Choose Month--</option>
            {
              monthName.map((data,index)=>{
                return(
                  <option value={index+1}>{data}</option>
                )
              })
            }
          </select>
        </div>
       
        <div className="search">
          <button className='btn btn-primary' onClick={getAttendance}>Search</button>
        </div>
      </div>
        
      </div>
    
        <table className="table verticle-middle table-responsive-md attendence-detail-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              {dayRows.length != 0 && dayRows}
            </tr>
          </thead>
          <tbody>
            {currentStudent && currentStudent.map((data, index) => {
              return (
                <tr>
                  <td>{data.Name}</td>
                  {attendenceRows.length != 0 && attendenceRows[index]}
                </tr>
              )
            })
            }

          </tbody>
        </table>
      </div>
      </div>

    </>
  )
}

export default AttandanceSheet