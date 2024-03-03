import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { ChatState } from '../context/chatProvider.js';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
function Following() {
  const { user } = ChatState();
  const [following, setFollowing] = useState([]);
  const [data, setData] = useState([]);
  const getData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const temp = [];
    for (const users of user.following) {
      const result = await axios.get(`http://localhost:5000/api/user/getdata/${users}`, config);
      temp.push(result.data);
    }
    console.log(temp);
    setData(temp);
  }
  useEffect(() => {
    if(!user) return;
    getData();
  }, [user])
  const follow = (id) => {
    if(!user) return;
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
        }}
    try {
        fetch('http://localhost:5000/api/user/follow', {
        method: "put",
        headers: config.headers,
        body: JSON.stringify({
            _id: user._id,
            followId: id
        })
    }).then(res => res.json())
        .then(result => {
            console.log(result)
            sessionStorage.removeItem("userInfo");
            sessionStorage.setItem("userInfo", JSON.stringify(result));
            window.location.reload();
        })
    } catch (error) {
        
    }
}
const unfollow = (id) => {
    if(!user) return;
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
        }}
    fetch('http://localhost:5000/api/user/unfollow', {
        method: "put",
        headers: config.headers,
        body: JSON.stringify({
            _id: user._id,
            followId: id
        })
    }).then(res => res.json())
        .then(result => {
            console.log(result)
            sessionStorage.removeItem("userInfo");
            sessionStorage.setItem("userInfo", JSON.stringify(result));
            window.location.reload();
        })
}
  return (
    <div>
        {data.length===0 ? <div>
            <h2 style={{textAlign: "center",marginTop:'3rem'}}>You are not following anyone</h2>
        </div>:data.map((item, index) => (
          <Card style={{ width: '25rem', margin: '10px auto' }} key={index}>
            <Card.Body>
              <Row>
                <Col style={{ margin: '0' }} xs={2}>
                  <Card.Img
                    src={item.pic}
                    style={{
                      height: '50px',
                      width: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                </Col>
                <Col>
                  <Card.Title style={{ fontWeight: 'bold', color: '#222' }}>{item.name}</Card.Title>
                </Col>
                <Col>
                  <button type="button" style={{ float: "right" }}
                    className="btn btn-danger" onClick={() => {
                    unfollow(item._id);
                  }}>Unfollow</button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
    </div>
);
}

export default Following;