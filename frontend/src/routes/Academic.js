import React, { useState } from 'react';
import Header from './../Components/Header.js';
import SideBar from './../Components/sideBar1.js';
import SubDiscuss from './../Components/SubDiscuss.js';
import '../Components/Styles/Academic.css';
import { useParams } from 'react-router-dom';

function Academic() {
  const { branch } = useParams();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleSubjectSelect = (subjectName) => {
    setSelectedSubject(subjectName);
  };
  return (
    <div>
      <Header/>
      <div className="app">
        <div className="app_body">
          <SideBar branch={branch} onSelect={handleSubjectSelect} />
          <SubDiscuss branch={branch} selectedSubject={selectedSubject} />
        </div>
      </div>
      
    </div>
  )
}

export default Academic
