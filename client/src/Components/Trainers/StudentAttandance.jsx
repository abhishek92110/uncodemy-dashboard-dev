import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import Header from '../Header'
import TrainerSlidebar from './TrainerSlidebar'


// import './Attendence.css'

function StudentAttandance() {

  document.title = "StudentDashboard - Student Attendance"

  let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const [addAttendanceStatus, setAddAttendenceStatus] = useState(true)


  const [isChecked, setIsChecked] = useState(false);

  const [currentStudent, setCurrentStudent] = useState(JSON.parse(localStorage.getItem('filterStudent')))

  //('current student',currentStudent)

  const individual = currentStudent.map(data => {
    //('current student')
    return (
      {
        status: "off",
        check: false
      })
  })

  const [individualCheck, setIndividualCheck] = useState(individual)
  const [lastDay, setLastDay] = useState(new Date().getDate())
  const [firstDay, setFirstDay] = useState(1)
  const [currentMonth, setCurrentMonth] = useState(month[((new Date().getMonth()))])
  console.log("current month =",currentMonth)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  let tempFullDate = `${lastDay}/${currentMonth}/${currentYear}`
  const [fullDate, setFullDate] = useState(tempFullDate)
  let tempDays = new Date(currentYear, currentMonth, 0).getDate()


  //('tempdays =', tempDays, lastDay.toString())


  const [attendenceStatus, setAttendenceStatus] = useState(currentStudent.map(data => {
    return ({ check: "absent" })
  }))

  const [maxDate, setMaxDate] = useState()
  const [missingDays, setMissingDays] = useState([])

  useEffect(() => {

    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10)
      month = '0' + month.toString();
    if (day < 10)
      day = '0' + day.toString();

    var tempmaxDate = year + '-' + month + '-' + day;
    setMaxDate(tempmaxDate)
    // getMonthAttendance()
    getAttendance();

  }, [])


  // const date = new Date.getDate();


  let dayName = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

  // const getMonthAttendance = async () => {
  //   try {
  //     let monthAttendance = await fetch('http://localhost:8000/getMonthAttendance', {
  //       method: 'POST',
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ year: currentYear.toString(), month: currentMonth, currentDate: date.toString()})

  //     })
  //     monthAttendance = await monthAttendance.json()
  //     //('await attendance =',monthAttendance)


  //     if (monthAttendance.status === "filled") {
  //       checkMissingAttendance(monthAttendance)
  //     }
  //     else {
  //       //('empty ');
  //     }

  //   } catch (error) { 

  //   }
  // }


  const getAttendance = async () => {

    let attendanceData = await fetch('http://localhost:8000/getAttendance', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fullDate: fullDate, trainerId:localStorage.getItem('trainerId'), Batch:  localStorage.getItem('trainerBatch')})
    })

    const attendanceResposne = await attendanceData.json()
    console.log('fetch get attendance =', attendanceResposne)

    if (attendanceResposne.status === "filled") {
      setAddAttendenceStatus(false)
      currentStudent.map((data, index) => {
        let indexStatus = false;
        let tempAttendence = [...attendenceStatus]
        let tempIndividualCheck = [...individualCheck]
        attendanceResposne.presentId.map(element => {

          if (data._id === element) {
            indexStatus = true;
            //('if', index)
            tempAttendence[index].check = "present"
            tempIndividualCheck[index].check = true
            tempIndividualCheck[index].status = "on"
            // //('attendance data=', tempAttendence)
          }

        })

        if (indexStatus === false) {
          tempAttendence[index].check = "absent"
          tempIndividualCheck[index].check = false
          tempIndividualCheck[index].status = "off"
        }
        setAttendenceStatus(tempAttendence)
      })
    }
    else {
      setAddAttendenceStatus(true)
      //("else", individual)
      setAttendenceStatus(currentStudent.map(data => {
        return ({ check: "not marked" })
      }))
      setIndividualCheck(individual)
    }


  }



  const IndividualChecked = (event, index) => {
  

    let tempInd = [...individualCheck]
    let tempAttendence = [...attendenceStatus]

    tempAttendence[index] = { ...tempAttendence[index], check: event.target.checked }
    setAttendenceStatus(tempAttendence)
    let tempId = currentStudent[index]._id


    tempInd[index] = { ...tempInd[index], status: 'on', check: event.target.checked };
    setIndividualCheck(tempInd)

    
  }

  let presentStudent = [];
  let absentStudent = [];

  const addAttendance = async()=>{

    currentStudent.map((data, index) => {

      if (individualCheck[index].check === true) {
        presentStudent.push(data._id)
      }
      else {
        absentStudent.push(data._id)
      }

    })

    let data = await fetch('http://localhost:8000/addAttendance', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fullDate: fullDate, date: lastDay, month: currentMonth, year: currentYear, presentId: presentStudent, absentId: absentStudent, Batch: localStorage.getItem('trainerBatch'), trainerId:localStorage.getItem('trainerId')})
    })

    data = await data.json()

  }

  const updateAttendance = async () => {

    currentStudent.map((data, index) => {

      if (individualCheck[index].check === true) {
        presentStudent.push(data._id)
      }
      else {
        absentStudent.push(data._id)
      }

    })

    let data = await fetch('http://localhost:8000/updateAttendance', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fullDate: fullDate, date: lastDay, month: currentMonth, year: currentYear, presentId: presentStudent, absentId: absentStudent, Batch: localStorage.getItem('trainerBatch'), trainerId:localStorage.getItem('trainerId')})
    })

    data = await data.json()
    let tempdate = lastDay
    console.log("three days attendance")
    // let ThreeDaysAttendance = await fetch('http://localhost:8000/getthreeDaysAttendance', {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({ year: currentYear.toString(), month: currentMonth, currentDate: tempdate.toString() })

    // })

    // ThreeDaysAttendance = await ThreeDaysAttendance.json()
    // ThreeDaysAttendance = ThreeDaysAttendance.monthAttendance
    // console.log("attendance length =",ThreeDaysAttendance)
  //   if(ThreeDaysAttendance.length>2){
  //   let missingAttendance = false

  //   ThreeDaysAttendance.monthAttendance.map(data => {
  //     if (data.date !== tempdate.toString()) {
  //       missingAttendance = true
  //     }

  //     else {
  //       missingAttendance = true
  //       data.Batch.map(element => {
  //         if (element === "ST/2023/08/SH02/02") {
  //           missingAttendance = false
  //         }
  //       })
  //     }

  //     tempdate = tempdate + 1
  //   })


  //   if (missingAttendance === false) {
  //     absentStudent.map(async (data, index) => {
  //       let studentMissingAttendance = false
  //       ThreeDaysAttendance.absentId[0].user.id.map(element => {
  //         if (element === data) {
  //           studentMissingAttendance = true
  //         }
  //       })

  //       if (studentMissingAttendance === true) {
  //         studentMissingAttendance = false;
  //         ThreeDaysAttendance.absentId[1].user.id.map(element => {
  //           if (element === data) {
  //             studentMissingAttendance = true
  //           }
  //         })
  //       }
       
  //       if (studentMissingAttendance === true) {
      
  //         let sendData = await fetch('http://localhost:8000/sendmessage', {
  //           method: 'POST',
  //           headers: {
  //             "Content-Type": "application/json"
  //           },
  //           body: JSON.stringify({ message: `Hello , You have not been present for three days if this continue you may not be able take your upcoming classes.`, from: "admin", checkid: [{ id: data }], fileName: "filename" })
  //         })
  //       }
  //     })
  //   }
  // }

  }

  const setDate = (e) => {
    let selectedDate = new Date(e.target.value)

    setCurrentMonth(month[selectedDate.getMonth()])
    setCurrentYear(selectedDate.getFullYear())
    setLastDay(selectedDate.getDate())

    selectedDate = `${selectedDate.getDate()}/${month[selectedDate.getMonth()]}/${selectedDate.getFullYear()}`
    console.log('selectedDate =',selectedDate)
    setFullDate(selectedDate)
  
  }

  const checkMissingAttendance = (monthAttendance) => {

    //('month attendance =',monthAttendance.monthAttendance)
    console.log('month attendance =', monthAttendance)

    let checkDate = parseInt(monthAttendance.monthAttendance[0].date)
    let endDate  =  (parseInt(new Date().getDate())-1)
    let tempMissingDays = []
    console.log('before fill temp', tempMissingDays)
    monthAttendance.monthAttendance.map((data, index) => {
      console.log('check date =', checkDate, (parseInt(data.date) - checkDate),data.date)

      if((index+1)===monthAttendance.monthAttendance.length){

        let missingLength = 0;
        let missingLength2 = (endDate-parseInt(data.date))>0?(endDate -parseInt(data.date)):0
        missingLength = ( parseInt(data.date) - checkDate)+ missingLength2;
        console.log('last index',endDate,checkDate,parseInt(data.date),(endDate -parseInt(data.date))>0?(endDate -parseInt(data.date)):0,missingLength);
          if (missingLength > 0) {
            for (let i = 0; i < missingLength; i++) {
              console.log('if date not match',checkDate)
              let tempFulldate = data.fullDate.split('/')
              tempFulldate[0] = checkDate;
              data.fullDate = `${tempFulldate[0]}/${tempFulldate[1]}/${tempFulldate[2]}`
              console.log('data date =', data.fullDate, (parseInt(data.date) - checkDate))
              tempMissingDays.push(data.fullDate)
              console.log('temp missing days =', tempMissingDays, checkDate)
    
              if((checkDate+1)=== parseInt(data.date))
              {
              checkDate = checkDate + 2;
              }
              else{
                checkDate = checkDate + 1;
              }
            }
          }
          else {
            let courseBatchStatus = false;
            data.BatchCourse.map(element => {
              if (element.batchTime === currentStudent[0].BatchTiming && element.course === currentStudent[0].Course) {
                courseBatchStatus = true
    
              }
            })
            if (courseBatchStatus === false) {
              //('not match course batch',data.fullDate)
              tempMissingDays.push(data.fullDate)
              setMissingDays(tempMissingDays)
    
            }
          }
          checkDate = checkDate + 1;
        }
      
      else{
        console.log('not last index',parseInt(data.date),checkDate)
      if ((parseInt(data.date) - checkDate) > 0) {

        for (let i = 0; i < (parseInt(data.date) - checkDate); i++) {
          console.log('if date not match')
          let tempFulldate = data.fullDate.split('/')
          tempFulldate[0] = checkDate;
          data.fullDate = `${tempFulldate[0]}/${tempFulldate[1]}/${tempFulldate[2]}`
          console.log('data date =', data.fullDate, (parseInt(data.date) - checkDate))
          tempMissingDays.push(data.fullDate)
          console.log('temp missing days =', tempMissingDays, checkDate)

          checkDate = checkDate + 1;
        }
      }
      else {
        let courseBatchStatus = false;
        data.BatchCourse.map(element => {
          if (element.batchTime === currentStudent[0].BatchTiming && element.course === currentStudent[0].Course) {
            courseBatchStatus = true

          }
        })
        if (courseBatchStatus === false) {
          //('not match course batch',data.fullDate)
          tempMissingDays.push(data.fullDate)
          setMissingDays(tempMissingDays)

        }
      }
      checkDate = checkDate + 1;
    }

    })

    setMissingDays(tempMissingDays)





  }


  return (
    <>
      <Header />
      <div className="attendance-detail-section">
        <TrainerSlidebar />


        <div className="card-body">

          <div _ngcontent-ng-c2587924599="" className="materialTableHeader">
            <div _ngcontent-ng-c2587924599="" className="left">
              <ul _ngcontent-ng-c2587924599="" className="header-buttons-left ms-0">
                <li _ngcontent-ng-c2587924599="" className="tbl-title">
                  <h3 _ngcontent-ng-c2587924599="">Student Attendance</h3>
                </li>
                <li _ngcontent-ng-c2587924599="" className="tbl-search-box">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <input
                    _ngcontent-ng-c2587924599=""
                    placeholder="Search"
                    type="text"
                    aria-label="Search box"
                    className="browser-default search-field"
                  />
                </li>
                {maxDate && <input className='btn btn-primary' type='date' max={maxDate} onChange={e => setDate(e)} />}
                <h2>{fullDate && fullDate}</h2>
                <button className='btn btn-primary' onClick={getAttendance}>Filter</button>
                {missingDays.length !== 0 && missingDays.map(data => {
                  console.log('running', missingDays)
                  return (<div className="attendanceNotification">Attendance is not marked for {data}</div>)
                })}
              </ul>
            </div>
          </div>


          <div className="table-responsive recentOrderTable">
            <table className="table verticle-middle table-responsive-md attendence-detail-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Batch</th>
                  <th scope="col">Status</th>
                  <th scope="col">Course</th>
                  <th scope="col">Present</th>
                </tr>
              </thead>
              <tbody>
                {currentStudent && currentStudent.map((data, index) => {
                  return (
                    <tr key={index}>

                      <td>{data.Name}</td>
                      <td>{data.BatchTiming}</td>
                      <td>{attendenceStatus[index].check === "present" ?attendenceStatus[index].check  :attendenceStatus[index].check}</td>
                      <td>{data.Course}</td>
                      <td><input type='checkbox'
                        checked={individualCheck[index].status === 'off' ? isChecked : individualCheck[index].check}
                        onClick={(event) => IndividualChecked(event, index)}></input></td>
                    </tr>
                  )
                })
                }
              </tbody>
            </table>
            <div className="update-attendance">
     {  addAttendanceStatus===true ? <button className='btn btn-primary' onClick={addAttendance}>Add Attendance</button>
            :  <button className='btn btn-primary' onClick={updateAttendance}>Update Attendance</button>}
            </div>
          </div>
          {/* <div className='right-left-arrow right-left-arrow-sendmessage'>
            <div className="right-left-arrow">
              <i class="fa-solid fa-left-long" onClick={backItem}></i>
              <i class="fa-solid fa-right-long" onClick={moveItem}></i>
            </div>

          </div> */}
        </div>
      </div>

    </>
  )
}

export default StudentAttandance