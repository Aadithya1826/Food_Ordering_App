import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingDown, 
  CheckCircle2, 
  Search, 
  Plus, 
  X,
  AlertTriangle
} from 'lucide-react';
import { inventoryService } from '../services/api';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getInventory();
      setInventory(data);
    } catch (err) {
      console.error('Failed to fetch inventory', err);
      setError('Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity || !newItem.unit) {
      setError('All fields are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await inventoryService.createItem({
        name: newItem.name,
        quantity: parseFloat(newItem.quantity),
        unit: newItem.unit,
      });
      setShowAddModal(false);
      setNewItem({ name: '', quantity: '', unit: '' });
      fetchInventory();
    } catch (err) {
      console.error('Error adding item', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockThreshold = 5;
  const lowStockItems = inventory.filter(item => item.quantity < lowStockThreshold);
  const inStockItems = inventory.filter(item => item.quantity >= lowStockThreshold);

  // Time formatter for "last restocked"
  const formatLastRestocked = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return 'More than a month ago';
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Inventory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {inventory.length} items tracked • {lowStockItems.length} low stock
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
            <Package size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>{inventory.length}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Items</p>
          </div>
        </div>

        <div style={{ background: '#fff0f0', border: '1px solid #ffd6d6', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: '#ffe0e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4d4d' }}>
            <TrendingDown size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: '#ff4d4d' }}>{lowStockItems.length}</h3>
            <p style={{ fontSize: '13px', color: '#ff4d4d' }}>Low Stock</p>
          </div>
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: '#16a34a' }}>{inStockItems.length}</h3>
            <p style={{ fontSize: '13px', color: '#16a34a' }}>In Stock</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px 16px 12px 48px',
            borderRadius: '24px',
            border: '1px solid #eaeaea',
            fontSize: '14px',
            outline: 'none',
            background: 'white'
          }}
        />
      </div>

      {/* Inventory Table */}
      <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: '1px solid #eaeaea' }}>
            <tr>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Item</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Quantity</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Unit</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Last Restocked</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading inventory...</td>
              </tr>
            ) : filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No inventory items found.</td>
              </tr>
            ) : (
              filteredInventory.map((item) => {
                const isLowStock = item.quantity < lowStockThreshold;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', background: isLowStock ? '#fff0f0' : '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLowStock ? '#ff4d4d' : '#16a34a' }}>
                          <Package size={16} />
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: '700', fontSize: '14px' }}>{item.quantity}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>{item.unit}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {formatLastRestocked(item.updated_at || item.created_at)}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {isLowStock ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fff0f0', color: '#ff4d4d', borderRadius: '16px', fontSize: '12px', fontWeight: '600' }}>
                          <AlertTriangle size={12} />
                          Low Stock
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '16px', fontSize: '12px', fontWeight: '600' }}>
                          <CheckCircle2 size={12} />
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Add New Item</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            
            {error && <div style={{ background: '#fff0f0', color: '#ff4d4d', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={handleAddItem}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Item Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '14px', outline: 'none' }}
                  placeholder="e.g. Rice Flour"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '14px', outline: 'none' }}
                    placeholder="e.g. 10"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Unit</label>
                  <input
                    type="text"
                    required
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #eaeaea', fontSize: '14px', outline: 'none' }}
                    placeholder="e.g. kg, liters"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 16px', background: 'none', border: '1px solid #eaeaea', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '10px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
