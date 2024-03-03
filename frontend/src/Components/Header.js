import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import BranchSelect from './BranchSelect';
import '../Components/Styles/header.css';
import { ChatState } from '../context/chatProvider';

function Header() {
  const Logout = () => {
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('hasReloaded');
    window.location.href = '/';
  }
  const {
    selectedChat,
    setSelectedChat,
    user,
  } = ChatState();
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="bg-dark" style={{ fontSize: '18px' }}>
      <Navbar.Brand href="/" className='mx-3' style={{ color: '#fff' }}>IIT Hub</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="/home" style={{ color: '#fff' }}>Home</Nav.Link>
          <Navbar >
            <BranchSelect />
          </Navbar>
          <Nav.Link href="/Research" style={{ color: '#fff' }}>Research</Nav.Link>
          <Nav.Link href="/Alumni" className='me-3' style={{ color: '#fff' }}>Alumni</Nav.Link>
          <Nav.Link href="/announcements" className='me-3' style={{ color: '#fff' }}>Announcements</Nav.Link>
          {
            user && user.userType === "Admin" ? <Nav.Link href="/admin" className='me-3' style={{ color: '#fff' }}>Admin</Nav.Link> : null
          }
        </Nav>
        <NavDropdown title={<span style={{ color: '#fff', margin: '0' }}>User</span>} align={{ lg: 'end' }} id="dropdown-menu-align-responsive-1" variant='secondary' >
          <NavDropdown.Item href="/Profile">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={Logout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;