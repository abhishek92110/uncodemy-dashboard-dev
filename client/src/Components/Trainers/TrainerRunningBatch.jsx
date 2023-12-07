import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate, useLocation  } from 'react-router-dom'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { StudentContext } from '../../context/StudentState';
import Swal from 'sweetalert2'

// import Home from '../Components/Home'
// import Header from '../Components/Header'

export default function TrainerRunningBatch() {

  const location = useLocation();
  const { runningBatch } = location.state;
  console.log("all student =",runningBatch)

  let ContextValue = useContext(StudentContext);
  document.title = "StudentDashboard - All Student"
  const navigation = useNavigate()

  // const [allStudent, setAllStudent] = useState()

  useEffect(() => {
    // fetchAdminStatus();
  }, [])

  // const deleteuser = async (id) => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       fetch(`http://localhost:8000/deleteuser/${id}`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json"
  //         }

  //       }).then(response => {

  //         const deletedata = response.json();

  //         if (deletedata.status === 422 || !deletedata) {
  //           console.log("error");
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Oops...',
  //             text: 'Something went wrong!',
  //             footer: '<a href="">Why do I have this issue?</a>'
  //           })
  //         }
  //         else {
  //           console.log("user deleted", deletedata);
  //           // setDLTdata(deletedata)
  //           Swal.fire(
  //             'Deleted!',
  //             'Your file has been deleted.',
  //             'success'
  //           )
  //           getdata();
  //         }
  //       }).catch(error => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: 'Something went wrong!',
  //           footer: '<a href="">Why do I have this issue?</a>'
  //         });

  //       })
  //     }
  //   })

  // }

  // async function fetchAdminStatus() {
  //   try {
  //     const status = await ContextValue.checkAdmin();

  //     console.log('status of admin =', status);
  //     if (status.status === "active") {
  //       getdata();
  //     }
  //     else {
  //       navigation('/')
  //       alert('you are not authorized')
  //     }

  //   } catch (error) {
  //     console.error('Error fetching admin status:', error);
  //   }
  // }

  // const getdata = async () => {
  //   let studentData = await ContextValue.getAllStudent();
  //   setAllStudent(studentData)
  //   console.log("student data =", studentData)
  // }

  return (

    <>

      <Header />
      <div className='sidebar-main-container'>
        <Sidebar />

        <div className="content-body" style={{ minWidth: "876px" }}>
          {/* row */}
          <div className="container-fluid">
            <div className="row page-titles mx-0">
              <div className="col-sm-6 p-md-0">
                <div className="welcome-text">
                  <h4>All Batch</h4>
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
                    <a href="javascript:void(0);">All Batch</a>
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
                        <h4 className="card-title">All Batch List</h4>

                      </div>




                      <div class="container">


                        <div class="row">

                          <div class="col-md-12">


                            <table id="datatable" class="table table-striped table-bordered" cellspacing="0" width="100%">
                              <thead>
                                <tr>
                                  <th>No.</th>
                                  <th>Batch</th>
                                  <th>Batch Time</th>
                                 
                                </tr>
                              </thead>



                              <tbody>
                                {runningBatch && runningBatch.map((data, index) => {

                                  return (
                                    <tr>

                                      <td>{index + 1}</td>
                                      <td>{data.Batch}</td>
                                      <td>{data.BatchTime}</td>       

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
