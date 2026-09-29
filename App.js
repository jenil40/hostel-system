import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from './pages/layout';
import RegisterStudent from './pages/RegisterStudent';
import ChangePassword from './pages/ChangePassword';
import Login from './pages/login';
import ApplyLeave from './pages/ApplyLeave';
import ViewLeaves from './pages/ViewLeaves';
import ViewFees from './pages/ViewFees';
import LandingPage from './pages/home';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student-register" element={<RegisterStudent />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/student-login" element={<Login />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/view-leave" element={<ViewLeaves />} />
          <Route path="/view-fees" element={<ViewFees />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// home 

// student register - done 
// student login - done 
// student change password - done 

// apply leave - done 
// view leave - done 

// view fees - done 

// change view room only single student visible 
// add fees - done 
// view fees - done 