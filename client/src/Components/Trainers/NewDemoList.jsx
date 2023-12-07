import React, { useEffect, useState, useContext } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link, NavLink, useParams,useNavigate, useLocation } from 'react-router-dom';
import { StudentContext } from '../../context/StudentState';
import Header from '../Header';
import Sidebar from '../Sidebar';

function NewDemoList(props) {

    const location  = useLocation()
    const { demolist, demoStudent } = location.state;
    const [filterDemoStudent, setFilterDemoStudent] = useState(demoStudent)
    const [filterDemoList, setFilterDemoList] = useState(demolist)
    const [AllDemoStudent, setAllDemoStudent] = useState(demoStudent)
    const [AllDemoList, setAllDemoList] = useState(demolist)
    console.log('demolist =',demolist,demoStudent)
    const [counselor, setCounselor]  = useState()
    const [trainer, setTrainer] = useState()

    let ContextValue = useContext(StudentContext);

    const navigation = useNavigate()

    let monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


    const date = new Date();

    const day = date.getDate()<10?`0${date.getDate()}`:date.getDate();
    console.log("day",day)
    const month = date.getMonth();
    const year = date.getFullYear();

    const [detail, setDetail] = useState({

        month: null,
        trainer: null,
        trainerName:null,
        counselor: null,
        counselorName: null
      })

      const filterStudent = () => {
           let tempStudentData =[]
    
        console.log('demo student data =',filterDemoList)
    
        let filterDemo = AllDemoList.filter((data, index) => {
          if((detail.trainer!= null ? data.TrainerId == detail.trainer : true) && (detail.counselor != null ? data.CounselorId == detail.counselor : true)){
            tempStudentData.push(AllDemoStudent[index])
            console.log('index',index)
          }
      console.log('counselor id= ',data.CounselorId,detail.counselor, detail.trainer)
          return (detail.trainer!= null ? data.TrainerId == detail.trainer : true) && (detail.counselor != null ? data.CounselorId == detail.counselor : true)
      
        })
        console.log('filter demo student =',filterDemo,tempStudentData)
        setFilterDemoList(filterDemo)
        setFilterDemoStudent(tempStudentData)
        
      }

    
    useEffect(() => {
        getCounselor()  
        getAllTrainer()
     
    }, [])

    
  let counselorData =[]

  const setCounselorData = (e)=>{
    console.log('select index =',e.target.selectedIndex,counselorData[e.target.selectedIndex])
    setDetail({...detail,["counselor"]:counselorData[e.target.selectedIndex],["counselorName"]:e.target.value})
  }
  let trainerData =[]

  const setTrainerData = (e)=>{
    console.log('select index =',e.target.selectedIndex,counselorData[e.target.selectedIndex])
    setDetail({...detail,["trainer"]:trainerData[e.target.selectedIndex],["trainerName"]:e.target.value})
  }

  const getCounselor = async()=>{
    const counsellor = await ContextValue.getAllCounselor()
    setCounselor(counsellor.counselorData)
    console.log('counselor all =',counsellor.counselorData)
  }

  const getAllTrainer = async () => {
    let allTrainer = await ContextValue.getAllTrainer() 
 
     setTrainer(allTrainer)
   }

 
    return (
        <>
              <Header />
      <div className='sidebar-main-container'>
        <Sidebar />   
            <div className='main-container d-flex flex-d-cloumn'>

            <div className='message-form'>
          
            
          <div className="preference-thumb thumb">
            <label className="form-label">Counselor :</label>
            {counselor && <select className="custom-select mr-sm-2" required name='counselor' onChange={(e) => setCounselorData(e)}>
              <option selected>Choose Counselor...</option>
              {counselor.map((data,index) => {
                counselorData[index+1] = data._id
                return (
                  <option value={data.Name}>{data.Name}</option>
                )
              })}
            </select>
            }
          </div>
          <div className="preference-thumb thumb">
            <label className="form-label">Trainer :</label>
            {trainer && <select className="custom-select mr-sm-2" required name='trainer' onChange={(e) => setTrainerData(e)}>
              <option selected>Choose Trainer...</option>
              {trainer.map((data,index) => {
                trainerData[index+1] = data._id
                return (
                  <option value={data.Name}>{data.Name}</option>
                )
              })}
            </select>
            }
          </div>
          <button className='filter-btn' onClick={filterStudent}>Filter</button>
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
                                {filterDemoList && filterDemoList.map((data, index) => {
                                    console.log('data =',data)
                                    return (
                                        <tr>
                                            <td>{index+1}</td>
                                            <td>{data.Date}</td>
                                            <td>{data.Time}</td>
                                            <td>{filterDemoStudent[index].length}</td>
                                            <td>{data.CounselorName}</td>
                                            <td>{data.Trainer}</td>
                                            <td><Link to={data.link}><button className='btn btn-primary'>Class Link</button></Link ></td>
                                            <td> <NavLink to={`teacherdemo`}> <button className="btn btn-success" onClick={e=>{localStorage.setItem('demoData',JSON.stringify(demoStudent[index]))}}  ><RemoveRedEyeIcon /></button></NavLink></td>
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

export default NewDemoList