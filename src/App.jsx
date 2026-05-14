import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import CustomerQR from './pages/CustomerQR.jsx'
import TokenGeneration from './pages/TokenGeneration.jsx'
import ExpressFood from './pages/ExpressFood.jsx'
import ParcelOrder from './pages/ParcelOrder.jsx'
import PaymentStatus from './pages/PaymentStatus.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import KitchenScreen from './pages/KitchenScreen.jsx'
import StaffScreen from './pages/StaffScreen.jsx'
import TodaysOrders from './pages/TodaysOrders.jsx'
import DisplayBoard from './pages/DisplayBoard.jsx'
import HighwayBoard from './pages/HighwayBoard.jsx'
import WhatsAppEngagement from './pages/WhatsAppEngagement.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/qr" replace />} />
        <Route path="/qr"       element={<CustomerQR />} />
        <Route path="/token"    element={<TokenGeneration />} />
        <Route path="/express"  element={<ExpressFood />} />
        <Route path="/parcel"   element={<ParcelOrder />} />
        <Route path="/payment"  element={<PaymentStatus />} />
        <Route path="/tracking" element={<OrderTracking />} />
        <Route path="/admin"    element={<AdminDashboard />} />
        <Route path="/kitchen"  element={<KitchenScreen />} />
        <Route path="/staff"    element={<StaffScreen />} />
        <Route path="/orders"   element={<TodaysOrders />} />
        <Route path="/display"  element={<DisplayBoard />} />
        <Route path="/highway"  element={<HighwayBoard />} />
        <Route path="/whatsapp" element={<WhatsAppEngagement />} />
        <Route path="*"         element={<Navigate to="/qr" replace />} />
      </Route>
    </Routes>
  )
}
