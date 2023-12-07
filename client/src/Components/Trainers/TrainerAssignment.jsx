import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { StudentContext } from "../../context/StudentState";
import TrainerSlidebar from "./TrainerSlidebar";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2'

function Assignment() {
  const ContextValue = useContext(StudentContext);
  const [videos, setVideos] = useState([]);
  const [trainerBatch, setTrainerBatch] = useState([]);
  const [batchStatus, setBatchStatus] = useState(true);
  const [runningBatch, setRunningBatch] = useState([]);
  const [trainerAssignment, setTrainerAssignment] = useState()
  const [notes, setNotes] = useState("pdf")
  const [notesPdf, setNotesPdf] = useState()
  const [notesLink, setNotesLink] = useState()
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filter, setFilter] = useState({
    course: "",
    batch: "",
  });


  const getTrainerBatch = async (TrainerId) => {
    try {
      const TrainerBatch = await ContextValue.getBatchByTrainer(TrainerId);
      console.log("trainer Batch =", TrainerBatch);
      setTrainerBatch(TrainerBatch);
    } catch (error) {
      console.error("Error fetching trainer batch:", error);
    }
  };


  const [trainer, setTrainer] = useState(
    JSON.parse(localStorage.getItem("individualTrainer"))
  );

  const navigation = useNavigate();
  const trainerData = JSON.parse(localStorage.getItem("trainerData"));

  const [link, setLink] = useState();
  const [inpval, setINP] = useState({
    trainer: trainerData.Name,
    file: null,
    Trainer: trainerData._id,
  });

  const [notesDetail, setNotesDetail] = useState(
    {
      trainer: trainerData.Name,
      file: null,
      url:null,
      Trainer: trainerData._id,
      batch:"",
      filetype:""
    }
  )

  const [classUrlInfo, setClassUrlInfo] = useState({
    trainerName: trainerData.Name,
    classUrl: "",
    Trainer: trainerData._id,
  });

  const [videoUrlInfo, setVideoUrlInfo] = useState({
    trainerName: trainerData.Name,
    videoUrl: "",
    Trainer: trainerData._id,
    VideoTitle: "",
  });

  const [status, setStatus] = useState("uploaded");
  const [uploadedStatus, setUploadedStatus] = useState("assignment");
  const [assignmentStatus, setAssignmentStatus] = useState("PDF");
  const [batch, setBatch] = useState("");

  useEffect(() => {
    const trainerId = localStorage.getItem("trainerId");
    getTrainerBatch(trainerId);
    fetchTrainerStatus();
    getTrainerdata();
    
   
  }, []);

  const getVideo = async (batch) => {
    console.log("batch =",batch)

    
    const res = await fetch(`http://localhost:8000/getuploadVideoUrl`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Batch": batch
        }
    });

   
    
    
    const data = await res.json();
    console.log("Assignment Data ", data);
    setVideos(data);
};

const VideoUploaded=()=>{

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Video Uploaded',
    showConfirmButton: false,
    timer: 1500
  })
  
}


const videoUploaded=()=>{

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'File Uploaded',
    showConfirmButton: false,
    timer: 1500
  })
  
}

  const toggleDocument = (url) => {
    window.open(url,'_blank')
};

  const getTrainerAssignment =async(batch)=>{
    console.log('batch from =',batch)
let trainerAssignment = await ContextValue.getTrainerAssignment(batch)
setTrainerAssignment(trainerAssignment)
  }

  async function fetchTrainerStatus() {
    try {
      const status = await ContextValue.checkTrainer();

      console.log("status of trainer =", status);
      if (status.status === "active") {
        getTrainerBatch(status.data._id);
      } else {
        navigation("/");
        alert("you are not authorized");
      }
    } catch (error) {
      console.error("Error fetching admin status:", error);
    }
  }

  const handleFileChange = (e) => {
    console.log("file =", e.target.files[0]);
    setINP({ ...inpval, file: e.target.files[0] });
    setNotesDetail({ ...notesDetail, file: e.target.files[0] });

  };
  const handleNotesFileChange = (e) => {
    console.log("file =", e.target.files[0]);
    setNotesDetail({ ...notesDetail, file: e.target.files[0] });
  };

  const uploadAssignment = async (e) => {
    console.log('upload assignment =',notesDetail)
    e.preventDefault();
    const formData = new FormData();
    for (const field in notesDetail) {
      formData.append(field, notesDetail[field]);
    } 

    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
    try {
      const res = await fetch("http://localhost:8000/uploadfile", {
        method: "POST",
        body: formData,
      });

    ContextValue.updateProgress(60)    
    ContextValue.updateProgress(100)
    ContextValue.updateBarStatus(false)
    videoUploaded()

      const data = await res.json();
      console.log("Data", data);
    } catch (error) {
      console.log("error =", error.message);
    }
  };

  const uploadAssignmentUrl = async (e) => {
    e.preventDefault();
    console.log("url assignment")

    let tempInpVal = inpval;
    tempInpVal.batch = batch;

    try {
      const res = await fetch("http://localhost:8000/Addnotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempInpVal),
      });

      const data = await res.json();
      console.log("Data", data);
    } catch (error) {
      console.log("error =", error.message);
    }
  };

  

  const uploadVideoUrl = async (e) => {
    console.log("video =", videoUrlInfo);
    e.preventDefault();
    const formData = new FormData();

    let tempvideoUrl = videoUrlInfo;
    tempvideoUrl.batch = batch;
    console.log("temp video url =",tempvideoUrl)
    tempvideoUrl.videoUrl = tempvideoUrl.videoUrl.replace("/view", "/preview");
    console.log("temp video url after=",tempvideoUrl)


    for (const field in videoUrlInfo) {
      formData.append(field, videoUrlInfo[field]);
    }

    formData.append("batch", batch);

    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)

    try {
      const res = await fetch("http://localhost:8000/uploadVideoUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempvideoUrl),
      });


      ContextValue.updateProgress(60)
      const data = await res.json();
      ContextValue.updateProgress(100)
      ContextValue.updateBarStatus(false)
      VideoUploaded()

   
      console.log("Data", data);
    } catch (error) {
      console.log("error =", error.message);
    }
  };

  const sendClassUrl = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const field in classUrlInfo) {
      console.log("field =", field, classUrlInfo[field]);
      formData.append(field, classUrlInfo[field]);
    }
    console.log("class info", classUrlInfo);
    try {
      const res = await fetch("http://localhost:8000/uploadClassUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classUrlInfo),
      });

      const data = await res.json();
      console.log("Data", data);
    } catch (error) {
      console.log("error =", error.message);
    }
  };

  const getTrainerdata = async () => {
    try {
      const res = await fetch("http://localhost:8000/document", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Assignment Data", data.documents);
      setLink(data.documents);
    } catch (error) {
      console.error("Error fetching trainer data:", error);
    }
  };

  const getBatch = async (trainerName) => {
    let batchData = await ContextValue.getRunningBatch();

    batchData = batchData.runningBatches.filter((data) => {
      return data.Trainer === trainerName;
    });
    console.log("batch data from assignment=", batchData);
    setRunningBatch(batchData);
  };

  

  const deleteuser = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed)
       {
          
        deleteAssignment(id)

       }
    })

  }
  const deletevideo = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed)
       {
          
        deleteVideoUrl(id)

       }
    })

  }

  const deleteNotes = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed)
       {
          
        deletesingleNote(id)

       }
    })

  }

  const deletesingleNote =async(id)=>{
    let deleteNote= await fetch(`http://localhost:8000/deleteNotes/${id}`,{
      method:'DELETE',
    })

    deleteNote = await deleteNote.json()
    console.log("delete assignment =",deleteNote)
  }
  const deleteVideoUrl =async(id)=>{
    let deletedVideo= await fetch(`http://localhost:8000/deleteVideo/${id}`,{
      method:'DELETE',
    })

    deletedVideo = await deletedVideo.json()
    console.log("delete assignment =",deletedVideo)
  }

  const deleteAssignment =async(id)=>{
    let deletedAssignment = await fetch(`http://localhost:8000/deleteTrainerAssignment/${id}`,{
      method:'DELETE',
    })

    deletedAssignment = await deleteAssignment.json()
    console.log("delete assignment =",deletedAssignment)
  }

  const handleClick = (video) => {
    console.log('video url =',video)
    setSelectedVideo(video);
};

const uploadNotesPdf = async(e)=>{
console.log('upload notes pdf=',notesDetail)

  e.preventDefault();
    const formData = new FormData();
    for (const field in notesDetail) {
      formData.append(field, notesDetail[field]);
    }

    ContextValue.updateProgress(30)
    ContextValue.updateBarStatus(true)
    try {
      const res = await fetch("http://localhost:8000/uploadNotesPdf", {
        method: "POST",
        body: formData,
      });

      ContextValue.updateProgress(60)
      const data = await res.json();
      ContextValue.updateProgress(100)
      ContextValue.updateBarStatus(false)
      PdfUploaded()
     
      console.log("Data", data);
    } catch (error) {
      console.log("error =", error.message);
    }

}

const PdfUploaded=()=>{

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Pdf Uploaded',
    showConfirmButton: false,
    timer: 1500
  })
  
}
const uploadLink = async(e)=>{
  console.log('upload notes link=',notesDetail)

  e.preventDefault();
  ContextValue.updateProgress(30)
  ContextValue.updateBarStatus(true)
  try {
    const res = await fetch("http://localhost:8000/uploadNotesLink", {
      method: "POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(notesDetail),
    });

    
    ContextValue.updateProgress(60)
    const data = await res.json();
    ContextValue.updateProgress(100)
    ContextValue.updateBarStatus(false)
    LinkUploaded()
    
    console.log("Data", data);
  } catch (error) {
    console.log("error =", error.message);
  }

}

const LinkUploaded=()=>{

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Link Uploaded',
    showConfirmButton: false,
    timer: 1500
  })
  
}

const getTrainerNotesPdf =async(batch)=>{
  let trainerNotesPdf = await ContextValue.getTrainerNotesPdf(batch)

  console.log('trainer notes pdf =',trainerNotesPdf)
  setNotesPdf(trainerNotesPdf)
  
}
const getTrainerNotesLink =async(batch)=>{
  let trainerNotesLink = await ContextValue.getTrainerNotesLink(batch)

  console.log('trainer notes link =',trainerNotesLink)
  setNotesLink(trainerNotesLink)
}

const getAssignmentStudent = async(id)=>{

  const res = await fetch(`http://localhost:8000/getStudentAssignment/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    const data = await res.json();
    console.log("submitted Data ", data);

    navigation('StudentAssigment',{state:{data}})

}

  return (
    <>
      <Header />
      <div className="sidebar-main-container">
        <TrainerSlidebar />
        <div className="assignment-main-container right-side-container">
          <div className="upload-button">
          {trainerBatch.length != 0 && (
            <select
              className="custom-select mr-sm-2"
              name="batch"
              onChange={(e) => {
                setBatch(e.target.value);
                setNotesDetail({...notesDetail, ["batch"]:e.target.value})
                setBatchStatus(false);
                getTrainerAssignment(e.target.value)
                getVideo(e.target.value);
                getTrainerNotesPdf(e.target.value)
                getTrainerNotesLink(e.target.value)
              }}
            >
              <option disabled selected>
                Select Batch
              </option>

              {trainerBatch.map((data) => {
                console.log("trainer batch =", data);
                return <option value={data.Batch}>{data.Batch}</option>;
              })}
            </select>
          )}
          {/* <div class="dashboard-navigation-section bg-light">
            <button
              className="btn btn-primary"
              onClick={(e) => setStatus("uploaded")}
            >
              Uploaded
            </button>
            <button
              className="btn btn-primary"
              onClick={(e) => setStatus("Submitted")}
            >
              Submitted
            </button>
          </div> */}
          </div>
          <div className="Assignment-container">
            {status === "uploaded" && (
              <div>
                <div class="dashboard-navigation-section bg-primary">
                  <h4 onClick={(e) => setUploadedStatus("assignment")}>
                    Assignment
                  </h4>
                  <h4 onClick={(e) => setUploadedStatus("Video")}>Video</h4>
                </div>
                {uploadedStatus === "assignment" && (
                  <div>
                    <div class="dashboard-navigation-section bg-primary">
                      <h4 onClick={(e) => setAssignmentStatus("PDF")}>Assignment</h4>
                      <h4 onClick={(e) => setAssignmentStatus("Link")}>Notes</h4>
                    </div>  

                    <div className="Assi-cont w-60">
                      {assignmentStatus === "PDF" && (

                          <> 
                          <div className='main-link-div w-60'>
                    <div className='link-container'>
                        <div className="assignment-link">
                            {/* <h1 className='first-heading'>Assignment</h1> */}
                            <div className='assignment-link-container'>
                                <div className='assignment-place'>
                                    <table id="datatable" className="table table-striped table-bordered" cellspacing="0" width="100%" >
                                        <thead>
                                            <tr>
                                                <th>S.No.</th>
                                                <th>File</th>
                                                <th>Date</th>
                                                <th>View</th>
                                                <th>Delete</th>
                                                <th>Completed</th>
                                             
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trainerAssignment && trainerAssignment.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.file}</td>
                                                    <td>{new Date(data.date).toLocaleString()}</td>
                                                    <td>
                                                        <button className="btn btn-success text-light" onClick={e=>toggleDocument(data.url)}>
                                                            <RemoveRedEyeIcon />

                                                        </button>

                                                    </td>
                                                    <td>
                                                    <button className="btn btn-danger" onClick={() => deleteuser(data._id)}><DeleteOutlineIcon /></button>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-success text-light" onClick={e=>getAssignmentStudent(data._id)}>
                                                            <RemoveRedEyeIcon />

                                                        </button>

                                                    </td>
                            
                                                
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <label></label>
                            </div>

                        </div>



                    </div>
                </div> 

                        <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label className="form-label">File</label>
                            <input
                              type="file"
                              value={inpval.Name}
                              onChange={handleFileChange}
                              name="Name"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                          <button
                            type="submit"
                            onClick={uploadAssignment}
                            disabled={batchStatus}
                            className="btn btn-primary"
                          >
                            Send
                          </button>
                        </div>
                        </>
                      )}
                      {assignmentStatus === "Link" && (
                        <div className="col-lg-6 col-md-6 col-sm-12">
                        
            <select
              className="custom-select mr-sm-2"
              name="notes"
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesDetail({...notesDetail, ["filetype"]:e.target.value,["file"]:null,["url"]:null})
              }}
            >
              <option disabled selected>
                Select Notes
              </option>
              <option value="pdf">
                PDF
              </option>
              <option value="link">
                Link
              </option>

              
            </select>
            {notes=="pdf" && 
            <>

<div className='main-link-div w-60'>
                    <div className='link-container'>
                        <div className="assignment-link">
                            {/* <h1 className='first-heading'>Assignment</h1> */}
                            <div className='assignment-link-container'>
                                <div className='assignment-place'>
                                    <table id="datatable" className="table table-striped table-bordered" cellspacing="0" width="100%" >
                                        <thead>
                                            <tr>
                                                <th>S.No.</th>
                                                <th>File</th>
                                                <th>Date</th>
                                                <th>View</th>
                                                <th>Delete</th>
                                             
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notesPdf && notesPdf.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.file}</td>
                                                    <td>{new Date(data.date).toLocaleString()}</td>
                                                    <td>
                                                        <button className="btn btn-success text-light" onClick={e=>toggleDocument(data.url)}>
                                                            <RemoveRedEyeIcon />

                                                        </button>

                                                    </td>
                                                    <td>
                                                    <button className="btn btn-danger" onClick={() => deleteNotes(data._id)}><DeleteOutlineIcon /></button>
                                                    </td>
                            
                                                
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <label></label>
                            </div>

                        </div>



                    </div>
                </div>

              <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="form-group">
                <label className="form-label">File</label>
                <input
                  type="file"
                  value={inpval.Name}
                  onChange={handleNotesFileChange}
                  name="Name"
                  class="form-control"
                  id="exampleInputPassword1"
                />
              </div>
              <button
                type="submit"
                onClick={uploadNotesPdf}
                disabled={batchStatus}
                className="btn btn-primary"
              >
                Send
              </button>
            </div>
            </>
            }
         
                          {notes=="link" &&
                          <> 

<div className='main-link-div w-60'>
                    <div className='link-container'>
                        <div className="assignment-link">
                            {/* <h1 className='first-heading'>Assignment</h1> */}
                            <div className='assignment-link-container'>
                                <div className='assignment-place'>
                                    <table id="datatable" className="table table-striped table-bordered" cellspacing="0" width="100%" >
                                        <thead>
                                            <tr>
                                                <th>S.No.</th>
                                                    <th>Date</th>
                                                    <th>View</th>
                                                <th>Delete</th>
                                             
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notesLink && notesLink.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    
                                                    <td>{new Date(data.date).toLocaleString()}</td>
                                                    <td>
                                                        <button className="btn btn-success text-light" onClick={e=>toggleDocument(data.url)}>
                                                            <RemoveRedEyeIcon />

                                                        </button>

                                                    </td>
                                                    <td>
                                                    <button className="btn btn-danger" onClick={() => deleteNotes(data._id)}><DeleteOutlineIcon /></button>
                                                    </td>
                            
                                                
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <label></label>
                            </div>

                        </div>



                    </div>
                </div>
                          <div className="form-group">
                            <label className="form-label">Link</label>
                            <input
                              type="text"
                              onChange={(e) =>
                                setNotesDetail({
                                  ...notesDetail,
                                  ["url"]: e.target.value,
                                })
                              }
                              name="url"
                              class="form-control"
                              id="exampleInputPassword1"
                            />
                          </div>
                          <button
                type="submit"
                onClick={uploadLink}
                disabled={batchStatus}
                className="btn btn-primary"
              >
                Send
              </button>
                          </>
                          }
                         
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {uploadedStatus === "Video" && (
                  <>
                    
                    <div className='other-link'>
                <div className='other-link-container'>
                    <h3 className='first-heading'>Video </h3>
                    <table id="datatable" className="table table-striped table-bordered" cellSpacing="0" width="100%">
                        {/* Table header */}
                        <tbody>
                            <tr>
                                <th>No.</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>View</th>
                                <th>DELETE</th>
                            </tr>
                          
                            {videos.map((video, index) => {
                                console.log('video=',video)
                                return(
                                    <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{video.VideoTitle}</td>
                                    <td>{video.date}</td>
                                    <td>
                                        <button
                                            className="btn btn-success text-light"
                                            data-toggle="modal"
                                            data-target={`#myModal-${index}`} 
                                            onClick={() => handleClick(video.videoUrl)}
                                        >
                                            <RemoveRedEyeIcon />
                                        </button>
                                    </td>
                                    <td>
                                                    <button className="btn btn-danger" onClick={() => deletevideo(video._id)}><DeleteOutlineIcon /></button>
                                                    </td>
                                </tr>
                                )
                             
                                })}
                        </tbody>
                    </table>
                </div>
            </div>

            {videos.map((video, index) => (
                <div key={index} className="modal fade" id={`myModal-${index}`} tabIndex="-1" role="dialog" aria-labelledby={`myModalLabel-${index}`} aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <iframe
                                    title="Google Meet Recording"
                                    width="800"
                                    height="700"
                                    src={videos[index].videoUrl}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
                  <div className="Assi-cont w-60">
                    <div className="form-group">
                      <label className="form-label">Video Link</label>
                      <input
                        type="text"
                        value={videoUrlInfo.videoUrl}
                        onChange={(e) =>
                          setVideoUrlInfo({
                            ...videoUrlInfo,
                            [e.target.name]: e.target.value,
                          })
                        }
                        name="videoUrl"
                        class="form-control"
                        id="exampleInputPassword1"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Video Title</label>
                      <input
                        type="text"
                        value={videoUrlInfo.VideoTitle}
                        onChange={(e) =>
                          setVideoUrlInfo({
                            ...videoUrlInfo,
                            [e.target.name]: e.target.value,
                          })
                        }
                        name="VideoTitle"
                        class="form-control"
                        id="exampleInputPassword1"
                      />
                    </div>

                    <button
                      type="submit"
                      onClick={uploadVideoUrl}
                      disabled={batchStatus}
                      className="btn btn-primary"
                    >
                      Send
                    </button>
                  </div>
                  </>
                )}
              </div>
            )}

            {status === "Sunmitted" && (
              <div className="main-link-div w-60 Assi-cont">
                <div className="assignment-place">
                  <table
                    id="datatable"
                    className="table table-striped table-bordered"
                    cellspacing="0"
                    width="100%"
                  >
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Submitted.</th>
                        <th>Date.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {link &&
                        link.map((data, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.otherurl}</td>
                            <td>{new Date(data.date).toLocaleString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Assignment;
