import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/landing';
import Login from './pages/login';
import Signup from './pages/signup';
import CropPrediction from './pages/cropPrediction';
import CropYieldPrediction from './pages/cropYield';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route 
            path="/crop-yield" 
            element={
              <ProtectedRoute>
                <CropYieldPrediction />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crop-prediction" 
            element={
              <ProtectedRoute>
                <CropPrediction />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}