import { useState, useHistory, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import React from 'react'
import Sidebar from "../Sidebar";
import Header from "../Header";
import { StudentContext } from '../../context/StudentState';

export default function AddTrainer() {

  document.title = "StudentDashboard - Add Trainer"
  let ContextValue = useContext(StudentContext);


  const navigate = useNavigate();

  const [allCourse, setAllCourse] = useState()
  const [weekDaysBatch, setWeekDaysbatch]  =  useState()
  const [WeekEndBatch, setWeekEndBatch]  = useState()

  const [inpval, setINP] = useState({
    Name: '',
    Number:'',
    email:'',
    CompanyName:'',
    LinkedinId: '',
    Headline: '',
    Address: '',
    bio: '',
    code: '',
    Course:[],
    mainCourse:'',
    weekDaysBatch:[],
    WeekEndBatch:[],
    file: null, // Add a file state
  });

  const handleFileChange = (e) => {
    console.log("file =", e.target.files[0])
    setINP({ ...inpval, file: e.target.files[0] });
  };

  useEffect(()=>{
    getAllCourses()
    getAllMainCourse()
  },[])

  const addinpdata = async (e) => {
    console.log('inpval trainer add =',inpval)
    e.preventDefault();
    const formData = new FormData();
    for (const field in inpval) {
      formData.append(field, inpval[field]);
    }

    try {
      const res = await fetch('http://localhost:8000/addTrainer', {
        method: 'POST',
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(inpval),
      });

      const data = await res.json();
      console.log("Data", data)
    }
    catch (error) {
      console.log('error =', error.message)
    }
  };

  const getAllCourses = async()=>{

    let allCourse = await ContextValue.getAllBatchCourse()

    // console.log('all course =',allCourse.batchCourse[0])
  
    setWeekDaysbatch(allCourse.batchCourse[0].WeekDaysBatch)
    setWeekEndBatch(allCourse.batchCourse[0].WeekEndBatch)

  }

const getAllMainCourse = async()=>{
  let allCourse = await ContextValue.getAllMainCourse()
  console.log('all main course =',allCourse.mainCourse)
  setAllCourse(allCourse.mainCourse)
    // setAllCourse(allCourse.mainCourse)
} 

  const addCourse = (index)=>{

    // const courses = inpval.Course
    // console.log("setinp =",inpval,courses)
    // courses.push(e.target.value)
    setINP({...inpval, ["Course"]:allCourse[index].subCourse, ["mainCourse"]:allCourse[index].mainCourse})
    console.log('select course =',allCourse[index].mainCourse,allCourse[index].subCourse )

  }

  const removeCourse = (index)=>{
    let tempCourse = inpval.Course
    tempCourse.splice(index, 1);
    setINP({...inpval, ["Course"]:inpval.Course})
  }
  const addWeekDays = (e)=>{
    const weekDays = inpval.weekDaysBatch
    console.log("setinp =",inpval,weekDays)
    weekDays.push(e.target.value)
    setINP({...inpval, ["weekDaysBatch"]:weekDays})

  }

  const removeWeekDays = (index)=>{
    let tempWeekDays = inpval.weekDaysBatch
    tempWeekDays.splice(index, 1);
    setINP({...inpval, ["weekDaysBatch"]:inpval.weekDaysBatch})
  }
  const addWeekEndDays = (e)=>{
    const weekEnds = inpval.WeekEndBatch
    console.log("setinp =",inpval,weekEnds)
    weekEnds.push(e.target.value)
    setINP({...inpval, ["WeekEndBatch"]:weekEnds})

  }

  const removeWeekEnd = (index)=>{
    let tempWeekEnd = inpval.WeekEndBatch
    tempWeekEnd.splice(index, 1);
    setINP({...inpval, ["WeekEndBatch"]:inpval.WeekEndBatch})
  }

  return (
    <>
    <Header/>
    <div className='sidebar-main-container'>
    <Sidebar/>
    
      
      <div className="content-body">
        {/* row */}
        <div className="container-fluid">
          <div className="row page-titles mx-0">
            <div className="col-sm-6 p-md-0">
              <div className="welcome-text">
                <h4>Add Trainer</h4>
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
                  <a href="javascript:void(0);">Add Student</a>
                </li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12 col-xxl-12 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Basic Info</h5>
                </div>
                <div className="card-body">
                  <form action="#" method="post">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input type="text" value={inpval.Name} onChange={e => setINP({ ...inpval, [e.target.name]: e.target.value })} name="Name" class="form-control" id="exampleInputPassword1" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="form-label">Number</label>
                          <input type="number" value={inpval.Number} onChange={e => setINP({ ...inpval, [e.target.name]: e.target.value })} name="Number" class="form-control" id="exampleInputPassword1" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="form-label">Email</label>
                          <input type="email" onChange={e => setINP({ ...inpval, [e.target.name]: e.target.value })} name="email" class="form-control" id="exampleInputPassword1" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="form-label">Company Name Working</label>
                          <input type="text" value={inpval.CompanyName} onChange={e => setINP({ ...inpval, [e.target.name]: e.target.value })} name="CompanyName" class="form-control" id="exampleInputPassword1" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="form-label">LinkedIn</label>
                          <input type="text"  onChange={e => setINP({ ...inpval, [e.target.name]: e.target.value })} name="LinkedinId" class="form-control" id="exampleInputPassword1" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="form-label">Headline</label>
                          <input type="text" value={inpval.Headline} onChange={e => setINP({ ...inpval, [e.target.name]: e.target.value })} name="Headline" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label className="form-label">Bio</label>
                          <input type="text" value={inpval.bio} onChange={e => setINP({ ...inpval, [e.target.name]: e.target.value })} name="bio" class="form-control" id="exampleInputPassword1" />
                        </div>



                      </div>

                     
                      <div className="col-lg-6 col-md-6 col-sm-12">
                                             <div className="form-group">

                                                <label className="form-label">Course</label>
                                                <div className="d-grid grid-col-2 col-gap-30">
                                               
                                                {allCourse && <select
                                                    id="exampleInputPassword1"
                                                    type="select"
                                                    class="form-control"
                                                   
                                                    onChange={e => addCourse(e.target.value)}
                                                >
                                                    <option disabled selected>--select Course--</option>
                                                    {allCourse.map((data, index) => {
                                                                                                           
                                                        return (
                                                            <option value={index}>{data.mainCourse}</option>
                                                        )
                                                    })
                                                    }
                                                </select>
                                                }

  
                                            </div>
                                            </div>
                                            </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                                             <div className="form-group">

                                                <label className="form-label">Week Days Batch</label>
                                                <div className="d-grid grid-col-2 col-gap-30">
                                               
                                                {weekDaysBatch && <select
                                                    id="exampleInputPassword1"
                                                    type="select"
                                                    class="form-control"
                                                   
                                                    onChange={e => addWeekDays(e)}
                                                >
                                                    <option disabled selected>--select Course--</option>
                                                    {weekDaysBatch.map((data, index) => {
                                                                                                           
                                                        return (
                                                            <option value={data}  disabled={inpval.weekDaysBatch.includes(data)}>{data}</option>
                                                        )
                                                    })
                                                    }
                                                </select>
                                                }

                                                <div className="d-grid col-gap-30 grid-col-3">
                                                {inpval.weekDaysBatch && inpval.weekDaysBatch.map((data,index)=>{
                                                  console.log("course =",data)
                                                  return(
                                                    <div className="d-grid col-gap-20 grid-col-2">
                                                 <p className="mb-0">{data}</p>
                                                 <i class="fa-solid fa-xmark" onClick={e=>removeWeekDays(index)}></i>
                                                 </div>
                                                  )

                                                })}
                                                </div>
                                            </div>
                                            </div>
                                            </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                                             <div className="form-group">

                                                <label className="form-label">Week End Days Batch</label>
                                                <div className="d-grid grid-col-2 col-gap-30">
                                               
                                                {WeekEndBatch && <select
                                                    id="exampleInputPassword1"
                                                    type="select"
                                                    class="form-control"
                                                   
                                                    onChange={e => addWeekEndDays(e)}
                                                >
                                                    <option disabled selected>--select Course--</option>
                                                    {WeekEndBatch.map((data, index) => {
                                                                                                           
                                                        return (
                                                            <option value={data}  disabled={inpval.WeekEndBatch.includes(data)}>{data}</option>
                                                        )
                                                    })
                                                    }
                                                </select>
                                                }

                                                <div className="d-grid col-gap-30 grid-col-3">
                                                {inpval.WeekEndBatch && inpval.WeekEndBatch.map((data,index)=>{
                                                  console.log("course =",data)
                                                  return(
                                                    <div className="d-grid col-gap-20 grid-col-2">
                                                 <p className="mb-0">{data}</p>
                                                 <i class="fa-solid fa-xmark" onClick={e=>removeWeekEnd(index)}></i>
                                                 </div>
                                                  )

                                                })}
                                                </div>
                                            </div>
                                            </div>
                                            </div>
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label className="form-label">Address</label>
                          <textarea
    
                            onChange={e => setINP({ ...inpval, [e.target.name]: e.target.value })}
                            name='Address'
                            className="form-control"
                            rows={5}

                          />
                        </div>
                      </div>
                    
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <button type="submit" onClick={addinpdata} className="btn btn-primary">
                          Submit
                        </button>
                        <button type="submit" className="btn btn-light">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
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
