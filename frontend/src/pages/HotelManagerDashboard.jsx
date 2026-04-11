import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Table2,
  Package,
  TrendingUp,
  Settings,
  Clock,
  Users,
  AlertTriangle,
} from 'lucide-react';
import DataudipiTitle from '../assets/Dataudupi-Title.png';

const HotelManagerDashboard = () => {
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
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'tables', label: 'Tables & QR', icon: Table2 },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Sample manager dashboard data
  const stats = [
    { label: 'Total Orders', value: '142', change: '+12%', icon: ShoppingCart, color: '#ff8c42' },
    { label: 'Revenue Today', value: '₹24,580', change: '+8%', icon: TrendingUp, color: '#2d7a4a' },
    { label: 'Pending Orders', value: '7', change: '-3', icon: Clock, color: '#ff8c42' },
    { label: 'Active Tables', value: '12/20', change: '60%', icon: Table2, color: '#2d7a4a' },
  ];

  const recentOrders = [
    { id: '#1042', items: 'Masala Dosa x2, Coffee x2', table: 'T-05', time: '2m ago', status: 'Preparing', amount: '₹340' },
    { id: '#1041', items: 'Idli Sambhar x3, Vada x1', table: 'Takeaway', time: '8m ago', status: 'Ready', amount: '₹280' },
    { id: '#1040', items: 'Thali x1, Buttermilk x1', table: 'Takeaway', time: '8m ago', status: 'Served', amount: '₹280' },
    { id: '#1039', items: 'Raya Dosa x1, Filter Coffee x1', table: 'T-02', time: '15m ago', status: 'Completed', amount: '₹280' },
  ];

  const bestSellers = [
    { name: 'Masala Dosa', orders: 150, icon: '🥘' },
    { name: 'Filter Coffee', orders: 134, icon: '☕' },
    { name: 'Idli Sambhar', orders: 98, icon: '🍲' },
  ];

  const staffNotifications = [
    { type: 'alert', message: 'Low Stock Alert', detail: '3 items running low: Rice Flour, Coconut Oil, Coffee Beans', icon: AlertTriangle },
  ];

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <div
        className={`admin-sidebar ${sidebarOpen ? 'expanded' : 'collapsed'}`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          {sidebarOpen && (
            <img
              src={DataudipiTitle}
              alt="Data Udipi"
              className="logo-title-image"
            />
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
              <h1>Good Morning! {user?.name?.split(' ')[0]}</h1>
              <p>Here's what's happening at your restaurant today</p>
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

              {/* Best Sellers Section */}
              <div className="admin-activity-card">
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Best Sellers Today</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {bestSellers.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
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
                          fontSize: '18px',
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{item.name}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.orders} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Notifications */}
              {staffNotifications.length > 0 && (
                <div className="admin-activity-card">
                  <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Notifications</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {staffNotifications.map((notification, idx) => {
                      const Icon = notification.icon;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            gap: '16px',
                            padding: '12px',
                            background: 'rgba(255, 140, 66, 0.1)',
                            border: '1px solid rgba(255, 140, 66, 0.2)',
                            borderRadius: '8px',
                          }}
                        >
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              background: 'rgba(255, 140, 66, 0.2)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--primary)',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={20} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{notification.message}</p>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{notification.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent Orders Section */}
              <div className="admin-activity-card">
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Recent Orders</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentOrders.map((order, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--primary)' }}>{order.id}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{order.items}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <span>🪑 {order.table}</span>
                          <span>⏱️ {order.time}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background:
                              order.status === 'Preparing'
                                ? 'rgba(255, 140, 66, 0.2)'
                                : order.status === 'Ready'
                                  ? 'rgba(45, 122, 74, 0.2)'
                                  : 'rgba(100, 100, 100, 0.2)',
                            color:
                              order.status === 'Preparing'
                                ? '#ff8c42'
                                : order.status === 'Ready'
                                  ? '#2d7a4a'
                                  : '#999',
                          }}
                        >
                          {order.status}
                        </span>
                        <span style={{ fontWeight: '600', fontSize: '13px' }}>{order.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activePage === 'menu' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <UtensilsCrossed size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Menu Management</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Menu management interface - coming soon</p>
            </div>
          )}

          {activePage === 'orders' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <ShoppingCart size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Orders Management</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Orders management interface - coming soon</p>
            </div>
          )}

          {activePage === 'tables' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Table2 size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Tables & QR Codes</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Tables management interface - coming soon</p>
            </div>
          )}

          {activePage === 'inventory' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Package size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Inventory Management</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Inventory management interface - coming soon</p>
            </div>
          )}

          {activePage === 'reports' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <TrendingUp size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Reports & Analytics</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Reports and analytics interface - coming soon</p>
            </div>
          )}

          {activePage === 'settings' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Settings size={48} style={{ margin: '0 auto 20px', color: 'var(--text-secondary)', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Settings</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Settings configuration - coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelManagerDashboard;
