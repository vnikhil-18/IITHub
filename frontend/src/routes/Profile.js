import React, { useState, useEffect } from 'react';
import Header from '../Components/Header.js';
import '../Components/Styles/Profile.css';
import { ChatState } from '../context/chatProvider';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

function Profile() {
  const { user } = ChatState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [graduatedYear, setGraduatedYear] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [highestDegreeOfQualification, setHighestDegreeOfQualification] = useState('');
  const [Workedin, setWorkedin] = useState('');
  const [Workingin, setWorkingin] = useState('');
  const [pic, setPic] = useState('');
  const [branch, setBranch] = useState('');
  const [profile, setProfile] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [userType, setuserType] = useState('');
  const [openMsg, setOpenMsg] = useState(user?.openMsg);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setGraduatedYear(user.graduationyear);
    setBranch(user.branch);
    setDiscipline(user.discipline);
    setHighestDegreeOfQualification(user.highestDegreeOfQualification);
    setWorkedin(user.company);
    setWorkingin(user.workingas);
    setPic(user.pic);
    setuserType(user.userType);
    setOpenMsg(user.openMsg);
  }, [user]);


  const handleEditClick = () => {
    setTempProfile({
      name,
      email,
      graduatedYear,
      branch,
      discipline,
      highestDegreeOfQualification,
      Workedin,
      Workingin,
      pic,
    });
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setName(tempProfile.name);
    setEmail(tempProfile.email);
    setGraduatedYear(tempProfile.graduatedYear);
    setBranch(tempProfile.branch);
    setDiscipline(tempProfile.discipline);
    setHighestDegreeOfQualification(tempProfile.highestDegreeOfQualification);
    setWorkedin(tempProfile.Workedin);
    setWorkingin(tempProfile.Workingin);
    setPic(selectedImage || tempProfile.pic);
    setIsEditing(false);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        'http://localhost:5000/api/user/update',
        {
          userId: user._id,
          name: tempProfile.name,
          graduationyear: tempProfile.graduatedYear,
          branch: tempProfile.branch,
          discipline: tempProfile.discipline,
          highestDegreeOfQualification: tempProfile.highestDegreeOfQualification,
          company: tempProfile.Workedin,
          workingas: tempProfile.Workingin,
          pic: selectedImage || tempProfile.pic,
        },
        config
      );
      sessionStorage.removeItem('userInfo');
      sessionStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }



  const postDetails = (image) => {
    if (image === undefined) {
      alert("Please Select an Valid Image");
      return;
    }
    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "chating");
      data.append("cloud_name", "dq7oyedtj");
      fetch("https://api.cloudinary.com/v1_1/dq7oyedtj/image/upload", {
        method: "post",
        body: data
      })
        .then(res => res.json())
        .then(data => {
          setSelectedImage(data.url.toString());
          setTempProfile({ ...tempProfile, pic: data.url.toString() });
        })
        .catch((error) => {
          console.log(error);
        })
    }
    else {
      alert("Please Select an Valid jpeg or png Image");
      return;
    }

  }

  const defaultImageURL = selectedImage || pic;
  return (
    <div className="total">
      <Header />

      {!isEditing ?
        (
          <div>

            <div className="containerProfile">


              <div className="profile-picture">
                <img src={pic} alt="Profile" />
              </div>
              <div className="profile-info">
                <h1>Profile Page</h1>
                {/* {!isEditing ? 
          ( 
            <div> */}
                <div className="state-box">
                  <p>Name: {name}</p>
                </div>
                <div className="state-box">
                  <p>Email: {email}</p>
                </div>
                <div className="state-box">
                  <p>Graduated Year: {graduatedYear}</p>
                </div>
                <div className="state-box">
                  <p>Branch: {branch}</p>
                </div>
                <div className="state-box">
                  <p>Discipline: {discipline}</p>
                </div>
                <div className="state-box">
                  <p>Highest Degree of Qualification: {highestDegreeOfQualification}</p>
                </div>
                <div className="state-box">
                  <p>Worked in: {Workedin}</p>
                </div>
                <div className="state-box">
                  <p>Working in: {Workingin}</p>
                </div>
                <Form className='opentomessages'>
                  {user && userType === 'Alumni' && (
                    <Form.Check
                      label="Open to messages"
                      type="switch"
                      id="custom-switch"
                      defaultChecked={openMsg}
                      onClick={async () => {
                        setOpenMsg(!openMsg);
                        user.openMsg = !openMsg;
                        const config = {
                          headers: {
                            Authorization: `Bearer ${user.token}`,
                          },
                        }
                        try {
                          const { data } = await axios.put('http://localhost:5000/api/user/openMsg', {
                            _id: user._id,
                            openMsg: openMsg,
                          }, config);
                          sessionStorage.removeItem('userInfo');
                          sessionStorage.setItem('userInfo', JSON.stringify(data));
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    />
                  )}
                </Form>
                <button className="editbutton" onClick={handleEditClick}>Edit</button>
              </div>

            </div>
          </div>
        ) : (
          <div>
            <div className="edit-form-container">
              <div className="edit-form-label">
                <label>Name:</label>
              </div>
              <div className="edit-form-input">
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                />
              </div>

              <div className="edit-form-label">
                <label>graduatedYear:</label>
              </div>
              <div className="edit-form-input">
                <input
                  type="text"
                  value={tempProfile.graduatedYear}
                  onChange={(e) => setTempProfile({ ...tempProfile, graduatedYear: e.target.value })}
                />
              </div>

              <div className="edit-form-label">
                <label>highestDegreeOfQualification:</label>
              </div>
              <div className="edit-form-input">
                <input
                  type="text"
                  value={tempProfile.highestDegreeOfQualification}
                  onChange={(e) => setTempProfile({ ...tempProfile, highestDegreeOfQualification: e.target.value })}
                />
              </div>

              <div className="edit-form-label">
                <label>branch:</label>
              </div>
              <div className="edit-form-input">
                <input
                  type="text"
                  value={tempProfile.branch}
                  onChange={(e) => setTempProfile({ ...tempProfile, branch: e.target.value })}
                />
              </div>
              <div className="edit-form-label">
                <label>Discipline:</label>
              </div>
              <div className="edit-form-input">
                <input
                  type="text"
                  value={tempProfile.discipline}
                  onChange={(e) => setTempProfile({ ...tempProfile, discipline: e.target.value })}
                />
              </div>

              <div className="edit-form-label">
                <label>Workingin:</label>
              </div>
              <div className="edit-form-input">
                <input
                  type="text"
                  value={tempProfile.Workingin}
                  onChange={(e) => setTempProfile({ ...tempProfile, Workingin: e.target.value })}
                />
              </div>
              <div className="edit-form-label">
                <label>Workedin:</label>
              </div>
              <div className="edit-form-input">
                <input
                  type="text"
                  value={tempProfile.Workedin}
                  onChange={(e) => setTempProfile({ ...tempProfile, Workedin: e.target.value })}
                />
              </div>

              <div className="img">
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedImage(file);
                    postDetails(file);
                  }}
                />

                {selectedImage ? (
                  selectedImage instanceof Blob || selectedImage instanceof File ? (
                    <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                  ) : (
                    <img src={defaultImageURL} alt="Default" />
                  )
                ) : (
                  <img src={defaultImageURL} alt="Default" />
                )}
              </div>

              <button className="edit-form-button" onClick={handleSaveClick}>
                Save
              </button>
            </div>
          </div>

        )}


    </div>
  );
}

export default Profile;
