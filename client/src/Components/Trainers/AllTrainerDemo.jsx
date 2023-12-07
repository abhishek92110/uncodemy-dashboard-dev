import React, { useEffect, useState, useContext } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link, NavLink, useParams,useNavigate, useLocation } from 'react-router-dom';
import "./TeacherDemo"
import Header from '../Header';
import Sidebar from '../Sidebar';
import TrainerSlidebar from './TrainerSlidebar';
import { StudentContext } from '../../context/StudentState'

function AllTrainerDemo() {

    const location = useLocation();
    const { demo, demoStudent } = location.state;
    const [demoList, setDemoList] = useState(demo)
    const [demoStudentData, setDemoStudentData] = useState(demoStudent)
    let ContextValue = useContext(StudentContext);
    const [filterDemoStudent, setFilterDemoStudent] = useState(demoStudent)
  const [filterDemoList, setFilterDemoList] = useState(demo)

    const [timeValue,setTimeValue] = useState()
  const [rangeDate, setRangeDate]=  useState({
    startDate:"",
    endDate:""
  })

    const navigation = useNavigate()

    let monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


    const date = new Date();

    const day = date.getDate()<10?`0${date.getDate()}`:date.getDate();
    console.log("day",day)
    const month = date.getMonth();
    const year = date.getFullYear() 
 
    const SearchDemo = async()=>{


        console.log('start and date from state =',rangeDate)
      
        let selectDemo = await fetch("http://localhost:8000/getRangeDemoes",{
          method:"GET",
          headers:{
            "startDate":rangeDate.startDate,
            "endDate":rangeDate.endDate
          }
        })
      
        selectDemo = await selectDemo.json()
        console.log('select demo =',selectDemo)
        setDemoStudentData(selectDemo.totalDemoStudent)
        setDemoList(selectDemo.Demo)
       setFilterDemoList(selectDemo.Demo)
       setFilterDemoStudent(selectDemo.totalDemoStudent)
      
       }

       const setStartEndate = (timeValue) => {
        let today = new Date();
        let startDate, endDate;
      
        if (timeValue === "Today") {
          startDate = today;
          endDate = today;
        } else if (timeValue === "Yesterday") {
          today.setDate(today.getDate() - 1); // Subtract 1 day to get yesterday
          startDate = today;
          endDate = today;
        } else if (timeValue === "Last Week") {
          endDate = new Date(); // Current date
          startDate = new Date();
          startDate.setDate(endDate.getDate() - 7); // Subtract 7 days to get a week ago
        } else {
          // Handle the case when time is not recognized
          console.error("Invalid time option");
          return;
        }
      
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);
        setRangeDate({...rangeDate, ["startDate"]:startDateStr, ["endDate"]:endDateStr})
        console.log("start date and end date =",startDateStr, endDateStr)
      
        return { startDate: startDateStr, endDate: endDateStr };
      };

      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const setFromTime =(fromTime)=>{
        const startDateStr =  formatDate(new Date(fromTime))
        setRangeDate({...rangeDate, ["startDate"]:startDateStr})
        console.log("from time ",startDateStr)
        
       }
       const setToTime =(toTime)=>{
        const endDateStr = formatDate(new Date(toTime))
        setRangeDate({...rangeDate, ["endDate"]:endDateStr})
        console.log("to time ",endDateStr)
       }


    return (
        <>
       
            <div className='sidebar-main-container'>          
         
            <div className='main-container one-col'>
            <div className="d-flex j-c-initial c-gap-40">
                  <select
                        id="exampleInputPassword1"
                        type="select"
                        name="Course"
                        class="custom-select mr-sm-2"
                        onChange={e =>{ setTimeValue(e.target.value);setStartEndate(e.target.value)}}
                    >
                        <option disabled selected>--select Time--</option>
                    
                                <option value="Today">Today</option>
                                <option value="Yesterday">Yesterday</option>
                                <option value="Last Week">Last Week</option>
                                <option value="Select Range">Select Range</option>
                        
                        
                    </select>

                    {timeValue==="Select Range" && 
                     <>
                     <label>From</label>
                      <input type="date" class="custom-select mr-sm-2" onChange={e=>setFromTime(e.target.value)}></input>
                      <label>To</label>
                      <input type="date" class="custom-select mr-sm-2" onChange={e=>setToTime(e.target.value)}></input>
                      </>}

        

          <button className='filter-btn' onClick={SearchDemo}>Search</button>
          </div>
                <div className="card-body w-80">
                    <div className="table-responsive recentOrderTable">
                    <table id="datatable"  className="table table-striped table-bordered"cellspacing="0" width="100%" >
                            <thead>
                                <tr>
                                    <th scope="col">No.</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">No Of Candidate</th>
                                    <th scope="col">Counsellor</th>
                                    <th scope="col">Trainer</th>
                                    <th scope="col">Link</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demoList && demoList.map((data, index) => {
                                    return (
                                        <tr>
                                            <td>{index+1}</td>
                                            <td>{data.Date}</td>
                                            <td>{data.Time}</td>
                                            <td>{demoStudentData[index].length}</td>
                                            <td>{data.CounselorName}</td>
                                            <td>{data.Trainer}</td>
                                            <td><Link to={data.link}><button className='btn btn-primary'>Class Link</button></Link ></td>
                                            <td> <NavLink to={`teacherdemo`}> <button className="btn btn-success" onClick={e=>{localStorage.setItem('demoData',JSON.stringify(demoStudentData[index]))}}  ><RemoveRedEyeIcon /></button></NavLink></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default AllTrainerDemo