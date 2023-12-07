import React, { useState, useEffect, useContext } from "react";
import { StudentContext } from "../../context/StudentState";
import Cslidebar from "./Cslidebar";
import { useParams,useLocation } from 'react-router-dom';
import Header from "../Header";
import Swal from 'sweetalert2'
import { HashLoader } from "react-spinners";

const RegisterStudentAdd = () => {
  const [allcourse, setAllCourse] = useState();
  const [trainer, setTrainer] = useState();
  const [course, setCourse] = useState();
  const location = useLocation();
  const { counselor } = location.state;

  let ContextValue = useContext(StudentContext);
  useEffect(() => {
    getAllCourse();
    getTrainer()
    
  }, []);

  // const getAllCourse = async () => {
  //   let allCourse = await ContextValue.getAllBatchCourse();
  //   console.log("course =", allCourse.batchCourse[0].Course);
  //   setAllCourse(allCourse.batchCourse[0].Course);
  // };

  const getAllCourse = async () => {
    let allCourse = await ContextValue.getAllMainSubCourse();
    console.log("course =",allCourse , allCourse.courses);
    setCourse(allCourse.allCourse)
    setAllCourse(allCourse.courses);
  };

  const [inpval, setINP] = useState({
    Name: "",
    Email: "",
    Number: "",
    Pname: "",
    Pnumber: "",
    RegistrationDate: "",
    Course: "",
    subCourse:"",
    Counselor: counselor.Name,
    CounselorId: counselor._id,
    RegistrationFees: "",
    TrainerName: "",
    TrainerId: "",
    BatchMode: "",
    Remark: "",
    status:"Process"
  });

  const addinpdata = async (e) => {
    e.preventDefault();
    console.log('register value =', inpval)
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
    try {
      const res = await fetch('http://localhost:8000/registerStudent', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inpval),
      });

      ContextValue.updateProgress(60)

      const data = await res.json();
      ContextValue.updateProgress(100)
      ContextValue.updateBarStatus(false)
      ContextValue.SuccessMsg()
      EmptyFilled()
      console.log("Data", data)
    }
    catch (error) {
      ContextValue.updateProgress(100)
      ContextValue.updateBarStatus(false)
      Swal.fire({   
        icon:  'error',
        title: 'Oops...',
        text:  'Something went wrong!',
      })
      
      console.log('error =', error.message)
    }
  };

  const EmptyFilled = ()=>{

  let tempInpVal = inpval;

  for (let key in inpval){

      tempInpVal[key] = ""
  }

  setINP(tempInpVal)

  }


  let trainerData = {}

  const getTrainer = async () => {
    const trainerData = await ContextValue.getAllTrainer();
    console.log("trainer data =", trainerData)
    setTrainer(trainerData)
  }

  const setTrainerData = (e) => {
    console.log('trainer data =',e.target.selectedIndex,trainerData[e.target.selectedIndex],trainerData)
    setINP({
      ...inpval,
      [e.target.name]: e.target.value,
      ["TrainerId"]: trainerData[e.target.selectedIndex]
    })
  }

  const setMainCourse  =(subCourse)=>{
    let mainCourse;
    course.map(data=>{
      data.subCourse.map(element=>{
        if(element===subCourse){
          mainCourse = data.mainCourse
        }
      })
    })

    console.log('sub and main Course =',subCourse,mainCourse)
    setINP({...inpval, ["Course"]:mainCourse,["subCourse"]:subCourse})

  }

  return (
    <>

      <Header />
      <div className='sidebar-main-container'>
      <HashLoader color="#3c84b1" />
        <Cslidebar />
      {/* <div className='pos-center'>
      <HashLoader color="#3c84b1" />
    </div> */}
        <div className="content-body">
          <div className="container-fluid">
            <div className="row page-titles mx-0">
              <div className="col-sm-6 p-md-0">
                <div className="welcome-text">
                  <h4>Resigster Student</h4>
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
                  <div>
                    <form action="#" method="post">
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                              type="text"
                              value={inpval.Name}
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="Name"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Number</label>
                            <input
                              type="number"
                              value={inpval.Number}
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="Number"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              value={inpval.Email}
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="Email"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Parent Name</label>
                            <input
                              type="text"
                              value={inpval.Pname}
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                  
                                })
                              }
                              name="Pname"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Parent Number</label>
                            <input
                              type="number"
                              value={inpval.Pnumber}
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="Pnumber"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Registration Date</label>
                            <input
                              type="date"
                              value={inpval.JoiningDate}
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="RegistrationDate"
                              class="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Counselor</label>
                            <input
                              type="text"
                              value={inpval.Counselor}
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="Counselor"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Trainer Name </label>
                            {trainer && <select className="custom-select mr-sm-2" required name='TrainerName' onChange={(e) => setTrainerData(e)
                            }>
                              <option selected>Choose...</option>
                              {trainer.map((data,index) => {
                                trainerData[index+1] = data._id
                                return (
                                  <option value={data.Name}>{data.Name}</option>
                                )
                              })}

                            </select>
                            }
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Registration Fees</label>
                            <input
                              type="number"
                              value={inpval.RegistrationFees}
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="RegistrationFees"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Batch mode</label>
                            <select
                              id="exampleInputPassword1"
                              type="select"
                              name="BatchMode"
                              class="form-control"
                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                })
                              }
                            >
                              <option disabled selected>
                                --select Batch Mode--
                              </option>
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Batch Course</label>
                            {allcourse && <select
                              id="exampleInputPassword1"
                              type="select"
                              name="Course"
                              class="form-control"
                              onChange={(e) => setMainCourse(e.target.value)}
                            >
                              <option disabled selected>
                                --select Batch Mode--
                              </option>
                              {
                                allcourse.map((data) => {
                                  return <option value={data}>{data}</option>;
                                })}
                            </select>}
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">Remark</label>
                            <input
                              type="text"

                              onChange={(e) =>
                                setINP({
                                  ...inpval,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              name="Remark"
                              class="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                            />
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <button
                            type="submit"
                            onClick={addinpdata}
                            className="btn btn-primary"
                          >
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
  );
};

export default RegisterStudentAdd;
