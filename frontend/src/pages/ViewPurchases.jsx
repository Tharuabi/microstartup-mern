import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Dashboard.css';
import { FaBoxOpen, FaFileInvoice, FaTruck } from 'react-icons/fa';

const sampleOrders = [
  { id: '#123456', date: '2025-07-01', items: 2, total: 499, status: 'Delivered', actions: 'Download Invoice' },
  { id: '#123457', date: '2025-06-25', items: 1, total: 199, status: 'Cancelled', actions: '-' },
  { id: '#123458', date: '2025-06-20', items: 3, total: 899, status: 'In Transit', actions: 'Track Order' },
];

export default function ViewPurchases() {
  const navigate = useNavigate();
  return (
    <div className="dash-account-card" style={{ marginTop: 40, maxWidth: 700 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaBoxOpen /> View Purchases</h3>
      <p style={{ color: '#6b7280', marginBottom: 18 }}>Here you can find all your past orders, download invoices, and track your deliveries.</p>
      {sampleOrders.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <p style={{ color: '#888', fontSize: 18 }}>You haven't placed any orders yet.</p>
          <button className="dash-btn dash-btn-primary" style={{ marginTop: 18 }} onClick={() => navigate('/projectpage')}>Shop Now</button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="dash-purchases-table" style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <thead>
              <tr style={{ background: '#f7f7f7' }}>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>
                    <img src="https://source.unsplash.com/40x40/?product" alt="item" style={{ borderRadius: 6, marginRight: 6, verticalAlign: 'middle' }} />
                    {order.items} item{order.items > 1 ? 's' : ''}
                  </td>
                  <td>₹{order.total.toLocaleString('en-IN')}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.actions === 'Download Invoice' ? (
                      <button className="dash-btn dash-btn-secondary" style={{ padding: '2px 8px', fontSize: 13, marginRight: 6 }}><FaFileInvoice style={{ marginRight: 4 }} />Invoice</button>
                    ) : order.actions === 'Track Order' ? (
                      <button className="dash-btn dash-btn-secondary" style={{ padding: '2px 8px', fontSize: 13 }}><FaTruck style={{ marginRight: 4 }} />Track</button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className="dash-btn dash-btn-secondary" style={{ marginTop: 18 }} onClick={() => navigate(-1)}>Back</button>
    </div>
  );
} 