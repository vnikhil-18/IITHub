import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Header from '../Components/Header';
import { useState, useEffect } from 'react';
import { ChatState } from '../context/chatProvider';
import '../Components/Styles/alumni.css'
import AlumniCard from '../Components/addAlumni';
import axios from 'axios';
function Alumni() {
  const {
    user
  }=ChatState();
  const [searchText, setSearchText] = useState('');
  function CardsDisplay() {
  const [alumnis, setalumnis] = useState([]);
    
  
    useEffect(() => {
      const fetchData = async () => {
        if(!user) return;
        try {
          const response = await axios.get('http://localhost:5000/api/user/all', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          const userData = response.data.filter((user) => user.userType === "Alumni");
          setalumnis(userData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []); 
    const filteredAlumnis = alumnis.filter((alumni) =>
      alumni.name.toLowerCase().includes(searchText.toLowerCase()) ||
      alumni.company.toLowerCase().includes(searchText.toLowerCase()) ||
      alumni.collegeName.toLowerCase().includes(searchText.toLowerCase())
    );
    return (
      <div className='CardGroup'>
        {filteredAlumnis.map((Card,temp) => {
           return (
             <AlumniCard key={temp}
            name={Card.name}
            pic={Card.pic}
            company={Card.company}
            id={Card._id}
            collegeName={Card.collegeName}
            openMsg={Card.openMsg}
            />

           )
            
  })}
      </div>
    );
  }
  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className='full'>
      <Header />
      <div className="templateContainer">
        <div className="searchInput_Container">
          <input
            className="searchInput"
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      <div className='alumni'>
        <CardGroup>
          <CardsDisplay />
        </CardGroup>
      </div>
      
    </div>
  );
}

export default Alumni;
