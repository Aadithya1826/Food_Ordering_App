import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  AlertCircle,
  TrendingUp,
  Users2,
  DollarSign,
  MapPin,
} from 'lucide-react';
import DataudipiTitle from '../assets/Dataudupi-Title.png';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'managers', label: 'Managers', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Sample data
  const stats = [
    {
      label: 'Total Hotels',
      value: '24',
      change: '+3 this month',
      icon: Building2,
      color: '#ff8c42',
    },
    {
      label: 'Active Managers',
      value: '38',
      change: '+5 this month',
      icon: Users2,
      color: '#2d7a4a',
    },
    {
      label: 'Platform Revenue',
      value: '₹12,45,800',
      change: '+18%',
      icon: DollarSign,
      color: '#ff8c42',
    },
    {
      label: 'Active Venues',
      value: '31',
      change: '+96% uptime',
      icon: MapPin,
      color: '#2d7a4a',
    },
  ];

  const topHotels = [
    { id: 1, name: 'Grand Udpi Palace', city: 'Mumbai', revenue: '₹3,24,500', orders: 1245, growth: '+18%' },
    { id: 2, name: 'Sagar Delights', city: 'Bangalore', revenue: '₹2,89,300', orders: 1102, growth: '+14%' },
    { id: 3, name: 'Coastal Kitchen', city: 'Chennai', revenue: '₹2,45,100', orders: 987, growth: '+21%' },
    { id: 4, name: 'Dosa Corner', city: 'Hyderabad', revenue: '₹1,98,700', orders: 856, growth: '+9%' },
    { id: 5, name: 'Café Mysore', city: 'Pune', revenue: '₹1,67,200', orders: 723, growth: '+6%' },
  ];

  const recentActivity = [
    { type: 'hotel_added', message: 'New hotel added', details: 'Heritage Kitchen - Delhi', time: '2 hours ago' },
    { type: 'manager_assigned', message: 'Manager assigned', details: 'Rajesh K. → Grand Udpi Palace', time: '4 hours ago' },
    { type: 'venue_activated', message: 'Venue activated', details: 'Coastal Kitchen - Branch 2', time: '6 hours ago' },
    { type: 'hotel_deactivated', message: 'Hotel deactivated', details: 'Old Mysore Cafe', time: '1 day ago' },
  ];

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <div
        className={`admin-sidebar ${sidebarOpen ? 'expanded' : 'collapsed'}`}
        style={{
          width: sidebarOpen ? '250px' : '70px',
        }}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          {sidebarOpen && (
            <img src={DataudipiTitle} alt="Data Udipi" className="logo-title-image" />
          )}
          <div className="logo-symbol">ADMIN</div>

        </div>

        {/* Menu Items */}
        <div className="admin-sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`sidebar-menu-button ${activePage === item.id ? 'active' : ''}`}
              >
                <span className="sidebar-menu-icon">
                  <Icon size={18} />
                </span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <p>
            Powered by Data Udipi
          </p>
          <button
            onClick={handleLogout}
            className="sidebar-logout-button"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${sidebarOpen ? 'main-expanded' : 'main-collapsed'}`}>
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sidebar-toggle-button"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="admin-header-title">
              <h1>Super Admin Dashboard</h1>
              <p>Platform-wide overview and management</p>
            </div>
          </div>
          <div className="status-pill">
            ✓ All systems operational
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-main-body">
          {activePage === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="admin-stats-grid">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="admin-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            background: `${stat.color}20`,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: stat.color,
                          }}
                        >
                          <Icon size={24} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#2d7a4a', fontWeight: '600' }}>{stat.change}</span>
                      </div>
                      <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{stat.value}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Top Hotels Section */}
              <div className="admin-table-card">
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Top Performing Hotels</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        Hotel
                      </th>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        City
                      </th>
                      <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        Revenue
                      </th>
                      <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        Orders
                      </th>
                      <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        Growth
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topHotels.map((hotel, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              background: 'var(--primary)',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: '700',
                              fontSize: '16px',
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', fontSize: '14px' }}>{hotel.name}</p>
                          </div>
                        </td>
                        <td style={{ padding: '16px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                          📍 {hotel.city}
                        </td>
                        <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>{hotel.revenue}</td>
                        <td style={{ padding: '16px 0', textAlign: 'right', fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {hotel.orders}
                        </td>
                        <td style={{ padding: '16px 0', textAlign: 'right', color: '#2d7a4a', fontWeight: '600', fontSize: '14px' }}>
                          {hotel.growth}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Activity Section */}
              <div className="admin-activity-card">
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          background: 'var(--primary)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          flexShrink: 0,
                        }}
                      >
                        {activity.type === 'hotel_added' && <Building2 size={20} />}
                        {activity.type === 'manager_assigned' && <Users size={20} />}
                        {activity.type === 'venue_activated' && <AlertCircle size={20} />}
                        {activity.type === 'hotel_deactivated' && <X size={20} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{activity.message}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{activity.details}</p>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activePage === 'hotels' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Building2 size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Hotels Management</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Hotels management interface - coming soon</p>
            </div>
          )}

          {activePage === 'managers' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Users size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Managers Management</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Managers management interface - coming soon</p>
            </div>
          )}

          {activePage === 'reports' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <BarChart3 size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Reports & Analytics</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Advanced reports and analytics - coming soon</p>
            </div>
          )}

          {activePage === 'settings' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Settings size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>System Settings</h3>
              <p style={{ color: 'var(--text-secondary)' }}>System configuration - coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
