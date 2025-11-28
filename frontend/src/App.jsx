import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Login from './pages/login';
import Signup from './pages/signup';
import CropPrediction from './pages/cropPrediction';
import CropYieldPrediction from './pages/cropYield';
import Profile from './pages/Profile';

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route 
            path="/crop-yield" 
            element={
                <CropYieldPrediction />
            } 
          />
          <Route 
            path="/crop-prediction" 
            element={
                <CropPrediction />
            } 
          />
          <Route 
            path="/profile" 
            element={
                <Profile />
            } 
          />
        </Routes>
      </BrowserRouter>
  );
}