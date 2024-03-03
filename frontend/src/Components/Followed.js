import React,{useState,useEffect,useContext} from 'react'
import {ChatState} from '../context/chatProvider';
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { CloseButton } from 'react-bootstrap';
import Header from '../Components/Header'
const AllAnnouncements  = ()=>{
    const {user}=ChatState()
    const [data,setData] = useState([])
    useEffect(()=>{
       if(!user) return;
       fetch('http://localhost:5000/api/post/getsubpost',{
           headers:{
               Authorization: `Bearer ${user.token}`,
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setData(result.posts)
       })
    },[user])

    const likePost = (id)=>{
        if(!user) return;
          fetch('http://localhost:5000/api/post/like',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  Authorization: `Bearer ${user.token}`,
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
                     console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
    }
    const unlikePost = (id)=>{
        if(!user) return;
          fetch('http://localhost:5000/api/post/unlike',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  Authorization: `Bearer ${user.token}`,
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
          }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
        if(!user) return;
          fetch('http://localhost:5000/api/post/comment',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  Authorization: `Bearer ${user.token}`,
              },
              body:JSON.stringify({
                  postId,
                  text
              })
          }).then(res=>res.json())
          .then(result=>{
              console.log(result)
              const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
             })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
    }

    const deletePost = (postid)=>{
        if(!user) return;
        fetch(`http://localhost:5000/api/post/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+user.token
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const postIMGDetails=(image)=>{
        if(image===undefined){
          alert("Please Select an Valid Image");
          return;
        }
        if(image.type==="image/jpeg" || image.type==="image/png"){
          const data=new FormData();
          data.append("file",image);
          data.append("upload_preset","chating");
          data.append("cloud_name","dq7oyedtj");
          fetch("https://api.cloudinary.com/v1_1/dq7oyedtj/image/upload",{
            method:"post",
            body:data
          }).then(res=>res.json())
          .then(data=>{
            setImage(data.url.toString());
          })
          .catch((error)=>{
            console.log(error);
          })
        }
        else{
          alert("Please Select an Valid jpeg or png Image");
          return;
        }
      }
      const sendPostDetails=()=>{
        const config={
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${user.token}`,
            }
        }
        try {
            const res=fetch("http://localhost:5000/api/post/createpost",{
                method:"post",
                headers:config.headers,
                body:JSON.stringify({
                    title,
                    body,
                    pic:image
                })
            })
            const data=res.json();
            console.log(data);
            console.log("post created");
        }
        catch (error) {
            console.log("error");
        }
      }
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show, setShow] = useState(false);
    const [post, setPost] = useState();
    const [profile, setProfile] = useState();
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
       <div className="AllAnnouncements">
            {
                show && <Modal show={show} onHide={()=>setShow(false)}>
                        <Modal.Header closeButton >
                            <Modal.Title>Create Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input type="text" className="form-control" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Body</label>
                                    <input type="text" className="form-control" placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)} />
                                </div>
                                <div className="form-group" style={{marginLeft:'10px',marginTop:'1rem' ,marginBottom:"1rem"}}>
                                    <label style={{marginRight:'10px'}}>Upload Image</label>
                                    <input type="file" className="form-control-file" onChange={(e)=>postIMGDetails(e.target.files[0])} />
                                </div>
                                <Button className="btn btn-primary" onClick={()=>{
                                    sendPostDetails()
                                    setShow(false)
                                }}>Submit Post</Button>
                            </form>
                        </Modal.Body>
                    </Modal>
            }
            {
                setShow2 && <Modal centered show={show2} onHide={()=>setShow2(false)}>
                    <Modal.Header closeButton >
                        <Modal.Title>Comments</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {post?.comments.map(record => (
                            <div className="card-text mb-1" style={{ display: 'flex', alignItems: 'center' }} key={record._id}>
                                <img src={record.postedBy.pic} style={{ height: '3rem', marginRight: '1rem' }} />
                                <div>
                                    <p><strong>{record.postedBy.name}</strong></p>
                                    <p>{record.text}</p>
                                </div>
                            </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer> 
                    <form onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, post._id);
                    e.target[0].value = "";
                }}>
                    <div className="form-group mb-0">
                        <input type="text" className="form-control" placeholder="Add a comment" />
                    </div>
                </form>
                </Modal.Footer>

                    </Modal>
            }
            <Button className="btn btn-primary position-fixed" style={{bottom: '20px', right: '20px'}} onClick={
                ()=>{
                    setShow(true);
                }
            }>+</Button>
            {
                show3 && <Modal centered show={show3} onHide={() => { setShow3(false); }}>
                <Modal.Body>
                  <CloseButton onClick={() => { setShow3(false) }} />
                  {
                    console.log(user.following.includes(profile._id))
                  }
                    {
                        user.following.includes(profile._id) ? (
                            <button type="button" style={{ float: "right" }}
                                className="btn btn-danger" onClick={() => {
                                    unfollow(profile._id);
                                }}>Unfollow</button>
                        ) : (
                            <button type="button" style={{ float: "right" }}
                                className="btn btn-primary" onClick={() => {
                                    follow(profile._id);
                                }}>follow</button>
                           )
                    }
                  <div className="container">
                    <div className="row">
                      <div className="col d-flex justify-content-center">
                        <img
                          src={profile.pic} style={{
                            height: "10.5rem"
                          }} />
                      </div>
                      <div className="col">
                        <p>Name: {profile.name}</p>
                        <p>Email: {profile.email}</p>
                        <p>Branch: {profile.branch}</p>
                        <p>Role: {profile.userType}</p>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            }
        {
    data.map(item => (
        <div className="card mx-auto mb-4" style={{ maxWidth: '500px',marginTop:'1rem' }} key={item._id}>
            <div className="card-header d-flex justify-content-between align-items-center px-3 py-2">
                <img onClick={()=>{
                    setShow3(true);
                    setProfile(item.postedBy);
                }} src={item.postedBy.pic} style={{height: "1.5rem",marginRight:'1rem'}} />
                <h6 className="text-dark font-weight-bold">{item.postedBy.name}</h6>
                {item.postedBy._id === user._id &&
                    <button className="btn btn-outline-danger btn-sm" onClick={() => deletePost(item._id)}>Delete</button>
                }
            </div>
            <img src={item.photo} className="card-img-top" style={{ maxHeight: '500px', objectFit: 'cover' }} alt="Post" />
            <div className="card-body px-3 py-2">
                <button style={{float:'right',marginBottom:'1rem'}} className="btn btn-outline-danger btn-sm mb-2" onClick={() => {
                    item.likes.includes(user._id) ? unlikePost(item._id) : likePost(item._id) 
                }}>
                    {item.likes.includes(user._id) ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>
                <p className="card-text mb-1" style={{marginBottom:'3rem'}}>{item.body}</p>
                <a style={{cursor:'pointer' , color:'grey'}} onClick={()=>{
                    setShow2(true);
                    setPost(item);
                }}>Show Comments - {item.comments.length}</a>
            </div>
            <div className="card-footer text-muted px-3 py-2">
                {item.likes.length} likes
            </div>
        </div>
    ))
}
       </div>
   )
}
export default AllAnnouncements;