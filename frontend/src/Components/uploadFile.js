import React from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../context/chatProvider';
import {BiCloudUpload} from 'react-icons/bi';
function UploadFile(props) {
  const navigate = useNavigate();
  const {
    user,
  } = ChatState();
  const [selectedFile, setSelectedFile] = React.useState(null);
  function onSubmit() {
    if(!selectedFile){
      alert("Please select a file");
      console.log("Please select a file");
      return;
    }
    const formData=new FormData();
    formData.append('file',selectedFile);
    console.log(props.chatId._id);
    formData.append('chatId',props.chatId._id)
    console.log(formData);
    axios.post('http://localhost:5000/api/messages/', formData, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  };
  return (
    <div className='content'>
      <BiCloudUpload size={150} color='black'/>
      <form>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
      </form>
      <button className='btn btn-primary' onClick={onSubmit}>Submit</button>
    </div>
  );
}

export default UploadFile;