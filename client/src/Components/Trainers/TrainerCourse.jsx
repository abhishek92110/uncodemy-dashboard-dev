import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate, useLocation  } from 'react-router-dom'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { StudentContext } from '../../context/StudentState';
import Swal from 'sweetalert2'
import TrainerSlidebar from './TrainerSlidebar';

// import Home from '../Components/Home'
// import Header from '../Components/Header'

export default function TrainerCourse() {

  const location = useLocation();
  const { course } = location.state;
  console.log("all student =",course)

  let ContextValue = useContext(StudentContext);
  document.title = "StudentDashboard - All Student"
  const navigation = useNavigate()

  // const [allStudent, setAllStudent] = useState()


  return (

    <>

      <Header />
      <div className='sidebar-main-container'>
        <TrainerSlidebar />

        <div className="content-body" style={{ minWidth: "876px" }}>
          {/* row */}
          <div className="container-fluid">
            <div className="row page-titles mx-0">
              <div className="col-sm-6 p-md-0">
                <div className="welcome-text">
                  <h4>All Course</h4>
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
                    <a href="javascript:void(0);">All Course</a>
                  </li>
                </ol>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">

              </div>
              <div className="col-lg-12">
                <div className="row tab-content">
                  <div id="list-view" className="tab-pane fade active show col-lg-12">
                    <div className="card w-80">
                      <div className="card-header">
                        <h4 className="card-title">All Course List</h4>

                      </div>




                      <div class="container">


                        <div class="row">

                          <div class="col-md-12">


                            <table id="datatable" class="table table-striped table-bordered" cellspacing="0" width="100%">
                              <thead>
                                <tr>
                                  <th>No.</th>
                                  <th>Course</th>
                             
                                 
                                </tr>
                              </thead>



                              <tbody>
                                {course && course.map((data, index) => {

                                  return (
                                    <tr>

                                      <td>{index + 1}</td>
                                      <td>{data}</td>
                                      

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
