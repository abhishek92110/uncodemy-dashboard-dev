import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate, useLocation  } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { StudentContext } from '../context/StudentState';
import Swal from 'sweetalert2'

// import Home from '../Components/Home'
// import Header from '../Components/Header'

export default function AllCourse() {

  const location = useLocation();
  const { course,allCourse } = location.state;
  console.log("all student =",course,allCourse)

  let ContextValue = useContext(StudentContext);
  document.title = "StudentDashboard - All Student"
  const navigation = useNavigate()

  const addCourse = ()=>{
    Swal.fire({
        title: 'Enter New Course Name',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Add',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
            addNewCourse(result.value)
          Swal.fire({
            title: `${result.value}`,
            
            imageUrl: result.value.avatar_url
          })
        }
      })
  }


  // add Sub Course 

   const addSubCourse = (mainCourse)=>{

    console.log('sub course =',mainCourse)
    Swal.fire({
        title: 'Enter New Course Name',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Add',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
            addNewSubCourse(result.value,mainCourse)
          Swal.fire({
            title: `${result.value}`,
            
            imageUrl: result.value.avatar_url
          })
        }
      })
  }

  const addNewCourse = async(mainCourse)=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    course.push(mainCourse)
    console.log("course route =",course)

    try{
    let newCourse = await fetch("http://localhost:8000/addNewCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"course":course,"mainCourse":mainCourse})
      });
      
      ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Course Added',
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
      ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
        
    }
  }


  const addNewSubCourse = async(courseData,mainCourse)=>{
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    course.push(courseData)
    console.log("course route =",course)

    try{
    let newCourse = await fetch("http://localhost:8000/addNewSubCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"subCourse":courseData,"mainCourse":mainCourse})
      });
      
      ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Course Added',
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
      ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
        
    }
  }

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
                  <h4>All Course</h4>
                </div>
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
                        <button className='btn btn-primary' onClick={addCourse}>Add New Course</button>

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
                                {allCourse && allCourse.map((data, index) => {

                                  return (
                                    <tr>

                                      <td>{index + 1}</td>
                                      <td><div className="accordion" id="accordionExample">
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingOne">
      <button
        className="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={`#c-${index}`}
        aria-expanded="true"
        aria-controls="collapseOne"
      >
        {data.mainCourse}
      </button>
    </h2>
    <div
      id={`c-${index}`}
      className="accordion-collapse collapse"
      aria-labelledby="headingOne"
      data-bs-parent="#accordionExample"
    >
         <div className="accordion-body">
          
      {data.subCourse.map(element=>{
        return(
         <li> {element}</li>
        )
      })}
   
          <button className='btn btn-primary mt-2' onClick={e=>addSubCourse(data.mainCourse)}>Add New Course</button>
        
      </div>
    </div>
  </div>
</div>
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
