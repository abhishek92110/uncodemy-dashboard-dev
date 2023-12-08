import React, { useEffect, useState, useContext } from 'react'
import img from "../../Components/img/7.jpg"
import Header from '../Header';
import { StudentContext } from '../../context/StudentState';
import { useNavigate } from 'react-router-dom';
import TrainerSlidebar from './TrainerSlidebar';
import TrainerAllMessage from './TrainerAllMessage';
import StudentMessageData from './StudentMessageData';
import Swal from 'sweetalert2'

export default function TrainerMessage() {
  document.title="StudentDashboard - Send Messages"
  let ContextValue = useContext(StudentContext);

  const [allCourse, setAllCourse] = useState()
  const [allBatch, setAllBatch] = useState()
  const [status, setStatus] = useState('send-message')
  const [messageData, setMessageData] = useState()
  const [StudentMessage, setStudentMessageData] = useState()
  const [messageStatus, setMessageStatus] = useState("Admin-message")
  const [adminId, setAdminId] = useState()
  const [user, setUser] = useState("student")
  const [trainer, setTrainer]  =useState()
  const [checkStatus, setCheckStatus] = useState(false)


  const navigation = useNavigate()

  useEffect(()=>{
    fetchTrainerStatus()
    fetchAdminId()
  },[])

  async function fetchTrainerStatus() {
    try {
      const status = await ContextValue.checkTrainer();
      
  console.log('status of trainer =', status);
  if(status.status==="active"){
    console.log('trainer details= ',status.data)
    let runningBatch = await ContextValue.getRunningBatch()
    const allCourse = await ContextValue.getBatchByTrainer(status.data._id);

    setTrainer(status.data)
    setAllCourse(status.data.Course)
    setAllBatch(runningBatch.runningBatches)
    getReceiveMessage(status.data.code)
    getStudentMessage(status.data.code)

  
    // getTrainerData(status.data)
  }
  else{
    navigation('/')
    alert('you are not authorized')
  }

    } catch (error) {
      console.error('Error fetching admin status:', error);
    }
  }

  const getReceiveMessage  = async(id)=>{
    console.log('receive message func=',id)
    let message = await ContextValue.getReceiveMessage(id)
    console.log('trainer message=',message);
    setMessageData(message)
  }

  const getStudentMessage  = async(id)=>{
    console.log('receive message func student=',id)
    let message = await ContextValue.getStudentreceivemessage(id)
    console.log('student message=',message);
    setStudentMessageData(message)
  }

  

  const [isChecked, setIsChecked] = useState(false);
  const [fileName, setFileName] = useState()
  const [selectedImage, setSelectedImage] = useState();

  const [end, setEnd] = useState(10)
  const [start, setStart] = useState(0)
  const [allStudentData, setAllStudentData] = useState(JSON.parse(localStorage.getItem('trainerStudent')))

  const [currentStudent, setCurrentStudent] = useState(JSON.parse(localStorage.getItem('trainerStudent')).slice(start, end).map(data => {
    return data
  })
  )
  const totalItem = JSON.parse(localStorage.getItem('trainerStudent')).length
  const [file, setFile] = useState()
  let tempCurrentStudent;
  const individual = allStudentData.map(data => {
    console.log('current student')
    return (
      {
        status: "off",
        check: false
      })
  })
  console.log('individual check =', individual)
  const [individualCheck, setIndividualCheck] = useState(individual)

  const [detail, setDetail] = useState({
    batch: null,
    course: null
  })
  const [message, setMessage] = useState("")
  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setFileName(event.target.files[0].name)
  };




  const moveItem = () => {
    console.log('move item', totalItem - end, JSON.parse(localStorage.getItem('trainerStudent')), totalItem);
    // console.log('move item',totalItem);



    if ((totalItem - end) <= 10) {
      console.log('if end')
      setStart(end)
      setEnd(end + (totalItem - end))
      tempCurrentStudent = [...currentStudent]

      tempCurrentStudent = allStudentData.slice(end, (end + (totalItem - end))).map(data => {
        return data
      })


      setCurrentStudent(tempCurrentStudent)

    }
    else if ((totalItem - end) > 10) {
      console.log('else end')

      setStart(end)
      setEnd(end + 10)
      tempCurrentStudent = [...currentStudent]

      tempCurrentStudent = allStudentData.slice(end, end + 10).map(data => {
        return data
      })


      setCurrentStudent(tempCurrentStudent)
    }

  }

  const backItem = () => {

    if (start == 0) {
      setStart(start)
      setEnd(end)
      setCurrentStudent(currentStudent)
    }

    else {
      setEnd(start)
      setStart(start - 10)

      tempCurrentStudent = [...currentStudent]

      tempCurrentStudent = allStudentData.slice((start - 10), start).map(data => {
        return data
      })


      setCurrentStudent(tempCurrentStudent)
    }


  }

  const IndividualChecked = (event, index) => {
    setCheckStatus(false)
    console.log('check =', event.target.checked, index)

    let tempInd = [...individualCheck]

    tempInd[index] = { ...tempInd[index], status: 'on', check: event.target.checked };
    tempInd.map(data=>{
      if(data.status==='on'){
        setCheckStatus(true)
      }
    })
    setIndividualCheck(tempInd)
  }

  const allcheck = (event) => {
    setCheckStatus(event.target.checked)
    setIsChecked(event.target.checked)

    let tempInd = individualCheck.map(data => {
      return ({
        status: "off",
        check: event.target.checked
      }
      )
    })

    setIndividualCheck(tempInd)
  }

  const sendMessage = async () => {

 ContextValue.updateProgress(30)
 ContextValue.updateBarStatus(true)   

      let checkedId
    if(user==="student"){
      checkedId = currentStudent.filter((data, index) => {


      if (individualCheck[index].check === true) {

        return true;
      }
      return false;
    })
      .map((data, index) => {
        return {
          id: data.EnrollmentNo,
        };
      });
    }
else{
  checkedId = [{
    id: user,
  }]
}
   let sender = trainer.Name
   let senderId  = trainer.code

   try{
    let data = await fetch('http://localhost:8000/sendmessage', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message, from:sender, fromId:senderId, checkid: checkedId, fileName: fileName })
    })

    
  ContextValue.updateProgress(100)
  ContextValue.updateBarStatus(false)

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Message Sent',
    showConfirmButton: false,
    timer: 1500
  })

  }
  catch(error){
    Swal.fire({   
      icon:  'error',
      title: 'Oops...',
      text:  'Something Went Wrong',
    }) 
  }
  }

  
  const checkBatch = (studentBatch,batch) =>{
    let batchStatus = false;
    studentBatch.map(data=>{
      if(data===batch && batchStatus===false){
        batchStatus = true
      }
    })
    return batchStatus
  }

  const filterStudent = () => {
    console.log('all student =', allStudentData)
    let filterStudent = allStudentData.filter((data, index) => {
      // console.log('student data filter =',data.Batch,data.Course, detail.batch, detail.course)

      // console.log('condition =',(detail.batch != null ? data.Batch === detail.batch : true) && (detail.course != null ? data.Course === detail.course : true))

      return (detail.batch != null ? checkBatch(data.studentRunningBatch,detail.batch) : true) && (detail.course != null ? data.Course === detail.course : true)
    
    }) 
    
    // console.log('all student after filter =', filterStudent)



    const individual = filterStudent.map(data => {
      console.log('current student')
      return (
        {
          status: "off",
          check: false
        })
    })
    console.log('individual check =', individual)
    setIndividualCheck(individual)
    setCurrentStudent(filterStudent)
  }

  const setSenderId = (id)=>{
    
  }

  async function fetchAdminId(){
    let adminId = await ContextValue.getAdminId()
    console.log('admin id =',adminId.id[0]._id)
    
    setAdminId(adminId.id[0]._id)
    
      }

      const fetchQueryData = (Query) => {
        console.log('fetch query =', Query)
    
        let filterQueryData = allStudentData.filter(data => {
          console.log('data name =', data, data.Name, Query)
          return (data.Name.toLowerCase().includes(Query.toLowerCase()))||(data.EnrollmentNo.toLowerCase().includes(Query.toLowerCase()) )
        })
    
        setCurrentStudent(filterQueryData)  
        const individual = filterQueryData.map(data => {
          console.log('current student')
          return (
            {
              status: "off",
              check: false
            })
        })
        console.log('individual check =', individual)
        setIndividualCheck(individual)
          
      }

  return (
    <>
   
      <Header />
      <div className='sidebar-main-container c-gap-40'>
        <TrainerSlidebar/>
      <div className="content-body w-80">
      <div className="card-header">
                <button class={`btn btn-hover btn-outline-${status==="send-message"?"dark":"light"}`} onClick={e => setStatus("send-message")}>Send Message</button>
                <button class={`btn btn-hover btn-outline-${status==="receive-message"?"dark":"light"}`} onClick={e => setStatus("receive-message")}>Receive Message</button>
               
              </div>
       {status==="send-message" &&  <div className="container-fluid">
        
       <div className="batch-thumb thumb">
                <label className="form-label">Select</label>
              {adminId &&  <select className="custom-select mr-sm-2" required name='batch' onChange={e=>setUser(e.target.value)} >
                  <option disabled selected>Choose...</option>

                  <option value={adminId}>Admin</option>
                  <option value="student">Student</option>                                  
                </select>}
              </div>
       {user==="student" ?  
       <>
       <div className='d-none d-lg-flex'>
            <div className='message-form'>
  
              
              <div className="batch-thumb thumb">
                <label className="form-label">Batch :</label>
               {allBatch && <select className="custom-select mr-sm-2" required name='batch' onChange={(e) => setDetail({ ...detail, [e.target.name]: e.target.value })} >
                  <option selected disabled>Choose Batch...</option>
                  
                 {allBatch.map(data=>{
                  return(
                  <option value={data.Batch}>{data.Batch}</option>)
                 })}
                </select>}
              </div>
              <div className="preference-thumb thumb">
                <label className="form-label">Courses :</label>
                {allCourse && <select className="custom-select mr-sm-2" required name='course' onChange={(e) => setDetail({ ...detail, [e.target.name]: e.target.value })} >
                  <option selected disabled>Choose Course...</option>
                  
                 {allCourse.map(data=>{
                  return(
                  <option value={data}>{data}</option>)
                 })}
                </select>}
              </div>
              <button className='filter-btn' onClick={filterStudent}>Filter</button>
            </div>
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
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div>
                  <div className="email-right  ml-sm-4 ml-sm-0">
                    <div className="compose-content">
                      <div className="form-group">
                        <textarea
                          id="email-compose-editor"
                          className="textarea_editor form-control bg-transparent"
                          rows={15}
                          placeholder="Enter a Message ..."
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12">
                        <h4 className='stu'>Please Select Students</h4>
                        <div className="table-responsive">
                        <table id="datatable"  className="table table-striped table-bordered"cellspacing="0" width="100%" >
                            <thead>
                              <tr>
                                <th scope="col"><input type='checkbox' onClick={event => allcheck(event)}></input></th>
                                <th scope="col">Enrollment No.</th>
                                <th scope="col">Name</th>
                                <th scope="col">Counselor</th>
                                <th scope="col">Batch</th>
                                
                              </tr>
                            </thead>
                            <tbody>
                              {currentStudent && currentStudent.map((data, index) => {
                                index = start + index;
                                return (
                                  <tr key={index}>
                                    <td>
                                      <input type='checkbox'
                                        checked={individualCheck[index].status === 'off' ? isChecked : individualCheck[index].check}
                                        onClick={(event) => IndividualChecked(event, index)}
                                      />
                                    </td>
                                    <td>{data.EnrollmentNo}</td>
                                    <td>{data.Name}</td>
                                    <td>{data.Counselor}</td>
                                    <td>{data.Batch}</td>
                                 
                                  </tr>
                                )
                              })
                              }

                            </tbody>
                          </table>

                          <div className="clearfix" />
                          <div className='right-left-arrow right-left-arrow-sendmessage'>
                            <i class="fa-solid fa-left-long" onClick={backItem}></i>
                            <i class="fa-solid fa-right-long" onClick={moveItem}></i>
                          </div>
                        </div>
                      </div>
                    </div>
                 
                    <div className="text-left mt-4 mb-5">
                      <button
                        className="btn btn-primary btn-sl-sm mr-3"
                        type="button"
                        onClick={sendMessage}
                        disabled={(message.length!==0 && checkStatus===true)?false:true }
                        // disabled={(message.length!==0 && checkStatus===true)?false:true }
                      >
                        <span className="mr-2">
                          <i className="fa fa-paper-plane" />
                        </span>{" "}
                        Send
                      </button>
                      <button className="btn btn-dark btn-sl-sm" type="button" onClick={e => setMessage("")}>
                        <span className="mr-2">
                          <i className="fa fa-times" aria-hidden="true" />
                        </span>{" "}
                        Discard
                      </button>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div> 
          </>:
          <>
          <div className="compose-content">
                      <div className="form-group">
                        <textarea
                          id="email-compose-editor"
                          className="textarea_editor form-control bg-transparent"
                          rows={15}
                          placeholder="Enter a Message ..."
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                        />
                      </div>
                    </div>

<button
className="btn btn-primary btn-sl-sm mr-3"
type="button"
onClick={sendMessage}
disabled={(message.length!==0)?false:true }

>
<span className="mr-2">
  <i className="fa fa-paper-plane" />
</span>{" "}
Send
</button>
<button className="btn btn-dark btn-sl-sm" type="button" onClick={e => setMessage("")}>
<span className="mr-2">
  <i className="fa fa-times" aria-hidden="true" />
</span>{" "}
Discard
</button>
</>
          }
        </div>}



        {status==="receive-message" &&
        <>
        <div className="card-header j-c-initial">
        <button class={`btn btn-hover btn-outline-${messageStatus==="Admin-message"?"dark":"light"}`} onClick={e => setMessageStatus("Admin-message")}>Admin Message</button>
        <button class={`btn btn-hover btn-outline-${messageStatus==="Student-message"?"dark":"light"}`} onClick={e => setMessageStatus("Student-message")}>Student Message</button>
       
      </div>
        {
            messageStatus==="Admin-message"?
        <TrainerAllMessage message={messageData}/>:<StudentMessageData message={StudentMessage}/>
        }
        </>}
      </div>
      </div>




      {/*---- Include the above in your HEAD tag --------*/}

    </>
  )
}
