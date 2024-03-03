import './App.css';
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./routes/Home";
import Academic from './routes/Academic';
import Alumni from './routes/Alumni';
import Research from './routes/Research';
import SignUp from './routes/SignUp';
import Login from './routes/Login';           
import Announcements from './routes/Announcements';
import Profile from './routes/Profile';
import Open from './routes/Open';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatContext from './context/chatProvider';
import PersonalChat from './routes/personalChat';
import ProjectDetails from './routes/projectDetails';
import QuestionAnswers from './routes/QuestionAnswers';
import Admin from './routes/Admin';

function App() {
  return (
    <Router>
      <ChatContext>
        <Routes>
          <Route path="/" element={<Open />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/academic/:branch" element={<Academic />} />
          <Route path="/alumni" element={<Alumni />} /> 
          <Route path="/research" element={<Research />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/personalchat" element={<PersonalChat/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/research/projectDetails" element={<ProjectDetails />} />
          <Route path="/answers/:questionId" element={<QuestionAnswers />} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="announcements" element={<Announcements/>}/>
        </Routes>
      </ChatContext>
    </Router>
  );
}

export default App;
