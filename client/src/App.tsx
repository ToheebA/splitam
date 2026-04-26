import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import BrowseGroups from './pages/BrowseGroups'
import BrowseProducts from './pages/BrowseProducts'
import BuyerDashboard from './pages/BuyerDashboard'
import GroupDetail from './pages/GroupDetail'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import VendorDashboard from './pages/VendorDashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/groups" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BrowseGroups />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BrowseProducts />
            </ProtectedRoute>
          } />
          <Route path="/buyer/dashboard" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/groups/:id" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <GroupDetail />
            </ProtectedRoute>
          } />
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App