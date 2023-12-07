import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../Sidebar';
import Header from '../Header';


export default function AllTrainer() {

  document.title="StudentDashboard - All Trainer"

  const [getuserdata, setUserdata] = useState("");

  const getdata = async () => {
    console.log('get data func')
    const res = await fetch("http://localhost:8000/trainer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    console.log('data trainer =',data)
    if (res.status === 422 || !data) {
      console.log("error ");

    } else {
      setUserdata(data)
    }
  }

  useEffect(() => {
    getdata();
  }, [])

  return (

    <>
     <Header/>
     <div className='sidebar-main-container'>
   <Sidebar/>
  
      <div className="content-body" style={{ minWidth: "876px" }}>
        {/* row */}
        <div className="container-fluid">
          <div className="row page-titles mx-0">
            <div className="col-sm-6 p-md-0">
              <div className="welcome-text">
                <h4>All Trainer</h4>
              </div>
            </div>
            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Home</a>
                </li>
                <li className="breadcrumb-item active">
                  <a href="javascript:void(0);">Trainers</a>
                </li>
                <li className="breadcrumb-item active">
                  <a href="javascript:void(0);">All Trainer</a>
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
                      <h4 className="card-title">All Trainer List</h4>

                    </div>




                    <div class="container">


                      <div class="row">

                        <div class="col-md-12">


                          <table id="datatable" class="table table-striped table-bordered" cellspacing="0" width="100%">
                            <thead>
                              <tr>
                                <th>S.N</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Number</th>
                                <th>Address</th>
                                <th> Bio</th>
                                
                              </tr>
                            </thead>
                            <tbody>
                              {
                                getuserdata && getuserdata.map((trainer, id) => {
                                  return (
                                    <>
                                      <tr>
                                        <th>{id + 1}</th>
                                        <td>{trainer.Name}</td>
                                        <td>{trainer.Email}</td>
                                        <td>{trainer.Number}</td>
                                        <td>{trainer.Address}</td>
                                        <td>{trainer.bio}</td>
                                       
                                      </tr>
                                    </>

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



                {/* grid view */}


                {/* <div id="grid-view" className="tab-pane fade col-lg-12">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="card card-profile">
                    <div className="card-header justify-content-end pb-0">
                      <div className="dropdown">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <span className="dropdown-dots fs--1" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right border py-0">
                          <div className="py-2">
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item text-danger"
                              href="javascript:void(0);"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-2">
                      <div className="text-center">
                        <div className="profile-photo">
                          <img
                             src={man}
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-4 mb-1">Alexander</h3>
                        <p className="text-muted">M.COM., P.H.D.</p>
                        <ul className="list-group mb-3 list-group-flush">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span>Roll No.</span>
                            <strong>02</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Phone No. :</span>
                            <strong>+01 123 456 7890</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Admission Date. :</span>
                            <strong>01 July 2020</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Email:</span>
                            <strong>info@example.com</strong>
                          </li>
                        </ul>
                        <a
                          className="btn btn-outline-primary btn-rounded mt-3 px-4"
                          href="about-Trainer.html"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="card card-profile">
                    <div className="card-header justify-content-end pb-0">
                      <div className="dropdown">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <span className="dropdown-dots fs--1" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right border py-0">
                          <div className="py-2">
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item text-danger"
                              href="javascript:void(0);"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-2">
                      <div className="text-center">
                        <div className="profile-photo">
                          <img
                             src={man}
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-4 mb-1">Elizabeth</h3>
                        <p className="text-muted">B.COM., M.COM.</p>
                        <ul className="list-group mb-3 list-group-flush">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span>Roll No.</span>
                            <strong>03</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Phone No. :</span>
                            <strong>+01 123 456 7890</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Admission Date. :</span>
                            <strong>01 July 2020</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Email:</span>
                            <strong>info@example.com</strong>
                          </li>
                        </ul>
                        <a
                          className="btn btn-outline-primary btn-rounded mt-3 px-4"
                          href="about-Trainer.html"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="card card-profile">
                    <div className="card-header justify-content-end pb-0">
                      <div className="dropdown">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <span className="dropdown-dots fs--1" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right border py-0">
                          <div className="py-2">
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item text-danger"
                              href="javascript:void(0);"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-2">
                      <div className="text-center">
                        <div className="profile-photo">
                          <img
                             src={man}
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-4 mb-1">Amelia</h3>
                        <p className="text-muted">M.COM., P.H.D.</p>
                        <ul className="list-group mb-3 list-group-flush">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span>Roll No.</span>
                            <strong>04</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Phone No. :</span>
                            <strong>+01 123 456 7890</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Admission Date. :</span>
                            <strong>01 July 2020</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Email:</span>
                            <strong>info@example.com</strong>
                          </li>
                        </ul>
                        <a
                          className="btn btn-outline-primary btn-rounded mt-3 px-4"
                          href="about-Trainer.html"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="card card-profile">
                    <div className="card-header justify-content-end pb-0">
                      <div className="dropdown">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <span className="dropdown-dots fs--1" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right border py-0">
                          <div className="py-2">
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item text-danger"
                              href="javascript:void(0);"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-2">
                      <div className="text-center">
                        <div className="profile-photo">
                          <img
                             src={man}
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-4 mb-1">Charlotte</h3>
                        <p className="text-muted">B.COM., M.COM.</p>
                        <ul className="list-group mb-3 list-group-flush">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span>Roll No.</span>
                            <strong>05</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Phone No. :</span>
                            <strong>+01 123 456 7890</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Admission Date. :</span>
                            <strong>01 July 2020</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Email:</span>
                            <strong>info@example.com</strong>
                          </li>
                        </ul>
                        <a
                          className="btn btn-outline-primary btn-rounded mt-3 px-4"
                          href="about-Trainer.html"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="card card-profile">
                    <div className="card-header justify-content-end pb-0">
                      <div className="dropdown">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <span className="dropdown-dots fs--1" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right border py-0">
                          <div className="py-2">
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item text-danger"
                              href="javascript:void(0);"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-2">
                      <div className="text-center">
                        <div className="profile-photo">
                          <img
                             src={man}
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-4 mb-1">Isabella</h3>
                        <p className="text-muted">B.A, B.C.A</p>
                        <ul className="list-group mb-3 list-group-flush">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span>Roll No.</span>
                            <strong>06</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Phone No. :</span>
                            <strong>+01 123 456 7890</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Admission Date. :</span>
                            <strong>01 July 2020</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Email:</span>
                            <strong>info@example.com</strong>
                          </li>
                        </ul>
                        <a
                          className="btn btn-outline-primary btn-rounded mt-3 px-4"
                          href="about-Trainer.html"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="card card-profile">
                    <div className="card-header justify-content-end pb-0">
                      <div className="dropdown">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <span className="dropdown-dots fs--1" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right border py-0">
                          <div className="py-2">
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item text-danger"
                              href="javascript:void(0);"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-2">
                      <div className="text-center">
                        <div className="profile-photo">
                          <img
                             src={man}
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-4 mb-1">Sebastian</h3>
                        <p className="text-muted">M.COM., P.H.D.</p>
                        <ul className="list-group mb-3 list-group-flush">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span>Roll No.</span>
                            <strong>07</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Phone No. :</span>
                            <strong>+01 123 456 7890</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Admission Date. :</span>
                            <strong>01 July 2020</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Email:</span>
                            <strong>info@example.com</strong>
                          </li>
                        </ul>
                        <a
                          className="btn btn-outline-primary btn-rounded mt-3 px-4"
                          href="about-Trainer.html"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="card card-profile">
                    <div className="card-header justify-content-end pb-0">
                      <div className="dropdown">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <span className="dropdown-dots fs--1" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right border py-0">
                          <div className="py-2">
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item text-danger"
                              href="javascript:void(0);"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-2">
                      <div className="text-center">
                        <div className="profile-photo">
                          <img
                             src={man}
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-4 mb-1">Olivia</h3>
                        <p className="text-muted">B.COM., M.COM.</p>
                        <ul className="list-group mb-3 list-group-flush">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span>Roll No.</span>
                            <strong>08</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Phone No. :</span>
                            <strong>+01 123 456 7890</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Admission Date. :</span>
                            <strong>01 July 2020</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Email:</span>
                            <strong>info@example.com</strong>
                          </li>
                        </ul>
                        <a
                          className="btn btn-outline-primary btn-rounded mt-3 px-4"
                          href="about-Trainer.html"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="card card-profile">
                    <div className="card-header justify-content-end pb-0">
                      <div className="dropdown">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <span className="dropdown-dots fs--1" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right border py-0">
                          <div className="py-2">
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item text-danger"
                              href="javascript:void(0);"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-2">
                      <div className="text-center">
                        <div className="profile-photo">
                          <img
                             src={man}
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-4 mb-1">Emma</h3>
                        <p className="text-muted">B.A, B.C.A</p>
                        <ul className="list-group mb-3 list-group-flush">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span>Roll No.</span>
                            <strong>09</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Phone No. :</span>
                            <strong>+01 123 456 7890</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Admission Date. :</span>
                            <strong>01 July 2020</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Email:</span>
                            <strong>info@example.com</strong>
                          </li>
                        </ul>
                        <a
                          className="btn btn-outline-primary btn-rounded mt-3 px-4"
                          href="about-Trainer.html"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="card card-profile">
                    <div className="card-header justify-content-end pb-0">
                      <div className="dropdown">
                        <button
                          className="btn btn-link"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <span className="dropdown-dots fs--1" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right border py-0">
                          <div className="py-2">
                            <a
                              className="dropdown-item"
                              href="javascript:void(0);"
                            >
                              Edit
                            </a>
                            <a
                              className="dropdown-item text-danger"
                              href="javascript:void(0);"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body pt-2">
                      <div className="text-center">
                        <div className="profile-photo">
                          <img
                             src={man}
                            width={100}
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                        <h3 className="mt-4 mb-1">Jackson</h3>
                        <p className="text-muted">M.COM., P.H.D.</p>
                        <ul className="list-group mb-3 list-group-flush">
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span>Roll No.</span>
                            <strong>10</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Phone No. :</span>
                            <strong>+01 123 456 7890</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Admission Date. :</span>
                            <strong>01 July 2020</strong>
                          </li>
                          <li className="list-group-item px-0 d-flex justify-content-between">
                            <span className="mb-0">Email:</span>
                            <strong>info@example.com</strong>
                          </li>
                        </ul>
                        <a
                          className="btn btn-outline-primary btn-rounded mt-3 px-4"
                          href="about-Trainer.html"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

                {/* grid  viwe end */}

              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>


  )
}
