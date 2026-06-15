// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/ProjectPage';
import ProjectDetails from './pages/ProjectDetails';
import AddProject from './pages/AddProject';
import AddIdea from './pages/AddIdea';
import PaymentPage from './pages/PaymentPage';
import Cart from './pages/Cart';
import About from './pages/About';
import Blog from './pages/Blog';
import Investors from './pages/Investors';
import HelpSupport from './pages/HelpSupport';
import Settings from './pages/Settings';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Funding from './pages/Funding';
import IdeaRoadmap from './pages/IdeaRoadmap';
import ViewPurchases from './pages/ViewPurchases';
import Chatbot from './components/Chatbot';




function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projectpage" element={<ProjectPage />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/projectdetails" element={<ProjectDetails />} />
            <Route path="/idea/:id" element={<IdeaRoadmap />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="/add-idea" element={<AddIdea />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/funding" element={<Funding />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/purchases" element={<ViewPurchases />} />
          </Routes>
          <Chatbot />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
