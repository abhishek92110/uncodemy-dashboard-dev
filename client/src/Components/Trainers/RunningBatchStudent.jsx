import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import {StudentContext} from '../../context/StudentState' 
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2'

function RunningBatchStudent() {
  const [allStudentData, setAllStudent] = useState();
  const [currentStudent, setCurrentStudent] = useState();
  const [allRunningBatch, setAllRunningBatch] = useState();
  let ContextValue = useContext(StudentContext);
  let SelectedBatch = localStorage.getItem('selectedRunningBatch')
  
  console.log("SelectedBatch",SelectedBatch)

  useEffect(()=>{

     getBatchStudent(SelectedBatch)
     getRunningBatch()
      
  },[])

  const getRunningBatch = async()=>{
    const runningBatch = await ContextValue.getRunningBatch()

    console.log("running batch =",runningBatch.runningBatches)

    setAllRunningBatch(runningBatch.runningBatches)
  }

  const getBatchStudent = async(batch)=>{

    const batchStudent = await ContextValue.getRunningBatchStudent(batch)
    console.log("filterStudent",batchStudent)
    setAllStudent(batchStudent);
    setCurrentStudent(batchStudent);

  }

  const fetchQueryData = (Query) => {
   

    let filterQueryData = allStudentData.filter(data => {
      console.log('data name =', data, data.Name, Query)
      return (data.Name.toLowerCase().includes(Query.toLowerCase()))||(data.EnrollmentNo.toLowerCase().includes(Query.toLowerCase()) )
    })

    
    console.log('filter query - ', filterQueryData)
    setCurrentStudent(filterQueryData)
  }

  let batch;

  const moveToNewBatch = (id) => {
    Swal.fire({
      title: 'Add Student to New Batch',
      html: `
        <div class="preference-thumb thumb">
          <select class="custom-select mr-sm-2" id="batchSelect" required name='status' onChange={(e) => setDetail({ status: e.target.value })}>
            ${allRunningBatch.map(data => {
              return `<option>${data.Batch}</option>`;
            })}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        batch = document.getElementById('batchSelect').value;
        // const selectedBatch = setDetail.status; // This should work if setDetail is defined
        // Handle any pre-confirm actions if needed.
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('batch =',batch)
        moveStudent(batch,id)
        Swal.fire({
          title: `${result.value}`,
          imageUrl: result.value.avatar_url
        });
      }
    });
  }
  const addBatch = (id) => {
    Swal.fire({
      title: 'Add Student to New Batch',
      html: `
        <div class="preference-thumb thumb">
          <select class="custom-select mr-sm-2" id="batchSelect" required name='status' onChange={(e) => setDetail({ status: e.target.value })}>
            ${allRunningBatch.map(data => {
              return `<option>${data.Batch}</option>`;
            })}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        batch = document.getElementById('batchSelect').value;
        // const selectedBatch = setDetail.status; // This should work if setDetail is defined
        // Handle any pre-confirm actions if needed.
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('batch =',batch)
        addStudent(batch,id)
        Swal.fire({
          title: `${result.value}`,
          imageUrl: result.value.avatar_url
        });
      }
    });
  }
  
  const moveStudent = async(batch,id)=>{
   
    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
    try{
    let updateStudent = await fetch("http://localhost:8000/moveStudent", {
    
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"currentBatch":SelectedBatch,"newBatch":batch,"id":id})
      });
      ContextValue.updateProgress(60)
      console.log('select batch from func=',SelectedBatch)
      ContextValue.updateProgress(100)
      ContextValue.updateBarStatus(false)
      updateBatch()
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

  const addStudent = async(batch,id)=>{

    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
   try{
    let updateStudent = await fetch("http://localhos:8000/addStudent", {
    
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"currentBatch":SelectedBatch,"newBatch":batch,"id":id})
      });
     
      console.log('select batch from func=',SelectedBatch)

      ContextValue.updateProgress(100)
      ContextValue.updateBarStatus(false)
      updateBatch()
    } 
    catch(error){
      Swal.fire({   
        icon:  'error',
        title: 'Oops...',
        text:  'Something Went Wrong Try Again',
      }) 
      console.log("error  =",error.message)
      ContextValue.updateProgress(100)
        ContextValue.updateBarStatus(false)
    }
  }
  const updateBatch = ()=>{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Batch Updated',
      showConfirmButton: false,
      timer: 1500
    })
  }
  

  return (
    <>
      <Header />
      <div className='sidebar-main-container'>
          <Sidebar />
          <div className="fee-detail right-side-container">

          <div class="d-flex my-2" role="search">
                    <input class="form-control me-2"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      name='search'
                      onChange={(e) => fetchQueryData(e.target.value)}
                    />
                    {/* <button class="btn btn-outline-dark" type="submit" onClick={fetchQueryData}>Search</button> */}

                  </div>
        <div className="table-responsive recentOrderTable ">
          <table
            id="datatable"
            className="table table-striped table-bordered "
            cellspacing="0"
            width="100%"
          >
            <thead>
              <tr>
                <th scope="col">Enrollment No.</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Course</th>
                <th scope="col">Trainer</th>
                <th scope="col">Batch Time</th>
                <th scope="col">Counselor</th>
                <th scope="col">Move</th>
                <th scope="col">Add</th>
              </tr>
            </thead>
            <tbody>
              {currentStudent &&
                currentStudent.map((data, index) => {
                  return (
                    <tr>
                      <td>{data.EnrollmentNo}</td>
                      <td>{data.Name}</td>
                      <td>{data.email}</td>
                      <td>{data.Course}</td>
                      <td>{data.TrainerName}</td>
                      <td>{data.BatchTiming}</td>
                      <td>{data.Counselor}</td>
                      <td className="cursor-pointer" onClick={e=>moveToNewBatch(data._id)}><AddIcon /></td>
                      <td className="cursor-pointer" onClick={e=>addBatch(data._id)}><AddIcon /></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        </div>
        </div>
      
    </>
  );
}

export default RunningBatchStudent;
