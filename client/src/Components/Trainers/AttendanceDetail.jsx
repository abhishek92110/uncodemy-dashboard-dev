import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import Header from '../Header'
import TrainerSlidebar from './TrainerSlidebar'

function AttendanceDetail() {

  document.title = "StudentDashboard - Attendance Detail"

  const [studentData, setStudentData] = useState()

  useEffect(() => {

    setStudentData(JSON.parse(localStorage.getItem('filterStudent')))

  }, [])

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
              </ul>
            </div>
          </div>


          <div className="table-responsive recentOrderTable">
            {/* <table className="table verticle-middle table-responsive-md">
                      <thead>
                          <tr>
                              <th scope="col">No.</th>
                              <th scope="col">Name</th>
                              <th scope="col">Course</th>
                              <th scope="col">Attendance</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>1</td>
                              <td>Salini</td>
                              <td>Java Full</td>
                              <td>Present</td>
                          </tr>
                      </tbody>
                  </table> */}

            <table className="table verticle-middle table-responsive-md attendence-detail-table">
              <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Number</th>
                  <th scope="col">Batch</th>
                  <th scope="col">Course</th>

                </tr>
              </thead>
              <tbody>
                {studentData && studentData.map((data, index) => {



                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data.Name}</td>
                      <td>{data.Number}</td>
                      <td>{data.BatchTiming}</td>
                      <td>{data.Course}</td>
                    </tr>
                  )
                })
                }

              </tbody>
            </table>
          </div>
        </div>
      </div>

    </>
  )
}

export default AttendanceDetail