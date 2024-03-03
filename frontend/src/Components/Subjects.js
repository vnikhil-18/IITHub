import React from 'react';
import './Styles/subjects.css';

function Subjects({ subject, onClick }) {
  const handleClick = () => {
    onClick(subject);
  };

  return (
    <div className='sidebarSubject' onClick={handleClick}>
      <div className='sidebarSubject_info'>
        <h5>{subject}</h5>
      </div>
    </div>
  );
}

export default Subjects;
