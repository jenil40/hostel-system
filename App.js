import './App.css';
import Layout from './pages/layout';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddRoom from './pages/addroom';
import ViewRoom from './pages/viewroom';
import ViewRoomDetail from './pages/ViewRoomDetail';
import AddAsset from './pages/AddAsset';
import ViewAssets from './pages/ViewAssets';
import ViewStudents from './pages/ViewStudents';
import ViewStudent from './pages/ViewStudent';
import ViewStudentLeaves from './pages/studentLeave';
import ViewStudentLeave from './pages/ViewStudentLeave';
import AdminLogin from './pages/adminLogin';
import ProtectedRoute from './pages/ProtectedRoute'; // Import ProtectedRoute
import ChangePassword from './pages/ChangePassword';
import AddFees from './pages/addFees';
import ViewFees from './pages/viewFees';
import EditFees from './pages/EditFees';
import Dashboard from './pages/home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Route: Admin Login */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />


          {/* Protected Routes */}
          <Route path='/' element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-room/:roomId?" element={<ProtectedRoute><AddRoom /></ProtectedRoute>} />
            <Route path='/view-room' element={<ProtectedRoute><ViewRoom /></ProtectedRoute>} />
            <Route path="/view-room-detail/:roomId" element={<ProtectedRoute><ViewRoomDetail /></ProtectedRoute>} />
            <Route path="/add-asset" element={<ProtectedRoute><AddAsset /></ProtectedRoute>} />
            <Route path="/add-asset/:id" element={<ProtectedRoute><AddAsset /></ProtectedRoute>} />
            <Route path="/view-assets" element={<ProtectedRoute><ViewAssets /></ProtectedRoute>} />
            <Route path="/view-students" element={<ProtectedRoute><ViewStudents /></ProtectedRoute>} />
            <Route path="/view-student/:id" element={<ProtectedRoute><ViewStudent /></ProtectedRoute>} />
            <Route path="/student-leave" element={<ProtectedRoute><ViewStudentLeaves /></ProtectedRoute>} />
            <Route path="/view-student-leave/:id" element={<ProtectedRoute><ViewStudentLeave /></ProtectedRoute>} />
            <Route path="/add-fee" element={<ProtectedRoute><AddFees /></ProtectedRoute>} />
            <Route path="/view-fee" element={<ProtectedRoute><ViewFees /></ProtectedRoute>} />
            <Route path="/edit-fee/:id" element={<ProtectedRoute><EditFees /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
