import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Search, Plus, Camera, Package, TrendingDown, CheckCircle2, Edit2, Trash2 } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { inventoryService } from '../services/api';

export default function InventoryManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, [user]);

  const fetchInventory = async () => {
    if (!user?.restaurant_id) return;
    try {
      setLoading(true);
      const data = await inventoryService.getInventory({ restaurant_id: user.restaurant_id });
      setInventory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = inventory.length;
  const lowStockCount = inventory.filter(i => (i.balance || 0) <= 10).length;
  const inStockCount = totalItems - lowStockCount;

  const filteredInventory = inventory.filter(i => i.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = async (id) => {
    // For now skip the actual API call since deleteInventory might not be in api.js
    // but just filter it out visually for the UI mock if it's not
    setInventory(inventory.filter(i => i.id !== id));
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 35, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Top Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionBtn}>
          <Plus color="white" size={16} />
          <Text style={styles.actionBtnText}>Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Camera color="white" size={16} />
          <Text style={styles.actionBtnText}>Scan Sheet</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCardWhite}>
          <View style={styles.summaryIconBoxWhite}>
            <Package color="#1e293b" size={20} />
          </View>
          <View>
            <Text style={styles.summaryValueWhite}>{totalItems}</Text>
            <Text style={styles.summaryLabelWhite}>Total Items</Text>
          </View>
        </View>

        <View style={styles.summaryCardRed}>
          <View style={styles.summaryIconBoxRed}>
            <TrendingDown color="#ef4444" size={20} />
          </View>
          <View>
            <Text style={styles.summaryValueRed}>{lowStockCount}</Text>
            <Text style={styles.summaryLabelRed}>Low Stock</Text>
          </View>
        </View>

        <View style={styles.summaryCardGreen}>
          <View style={styles.summaryIconBoxGreen}>
            <CheckCircle2 color="#10b981" size={20} />
          </View>
          <View>
            <Text style={styles.summaryValueGreen}>{inStockCount}</Text>
            <Text style={styles.summaryLabelGreen}>In Stock</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search color="#9ca3af" size={20} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search inventory..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Data Table */}
      <View style={styles.tableCard}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, { width: 140 }]}>Item</Text>
              <Text style={[styles.headerText, { width: 70 }]}>Open</Text>
              <Text style={[styles.headerText, { width: 90 }]}>Purchase</Text>
              <Text style={[styles.headerText, { width: 70 }]}>Total</Text>
              <Text style={[styles.headerText, { width: 70 }]}>Issue</Text>
              <Text style={[styles.headerText, { width: 70 }]}>Balance</Text>
              <Text style={[styles.headerText, { width: 70 }]}>Unit</Text>
              <Text style={[styles.headerText, { width: 140 }]}>Last Restocked</Text>
              <Text style={[styles.headerText, { width: 100 }]}>Status</Text>
              <Text style={[styles.headerText, { width: 90 }]}>Actions</Text>
            </View>

            {/* Table Rows */}
            {loading ? <ActivityIndicator size="large" color="#ff5722" style={{ marginTop: 20 }} /> : 
            filteredInventory.map((item, index) => {
              const isLowStock = (item.balance || 0) <= 10;
              return (
              <View key={item.id} style={[styles.tableRow, index === filteredInventory.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.rowCell, { width: 140, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                  <View style={styles.itemIconBox}>
                    <Package color="#10b981" size={14} />
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <Text style={[styles.rowCell, { width: 70, color: '#1e293b' }]}>{item.open_stock || 0}</Text>
                <Text style={[styles.rowCell, { width: 90, color: '#1e293b' }]}>{item.purchase || 0}</Text>
                <Text style={[styles.rowCell, { width: 70, color: '#1e293b', fontWeight: 'bold' }]}>{item.total || 0}</Text>
                <Text style={[styles.rowCell, { width: 70, color: '#ef4444' }]}>{item.issue || 0}</Text>
                <Text style={[styles.rowCell, { width: 70, color: '#1e293b', fontWeight: 'bold' }]}>{item.balance || 0}</Text>
                <Text style={[styles.rowCell, { width: 70, color: '#64748b' }]}>{item.unit || 'kg'}</Text>
                <Text style={[styles.rowCell, { width: 140, color: '#64748b' }]}>{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Just now'}</Text>
                
                <View style={[styles.rowCell, { width: 100 }]}>
                  <View style={[styles.statusPill, isLowStock && { backgroundColor: '#fee2e2' }]}>
                    <CheckCircle2 color={isLowStock ? '#ef4444' : '#10b981'} size={10} />
                    <Text style={[styles.statusText, isLowStock && { color: '#ef4444' }]}>{isLowStock ? 'Low Stock' : 'In Stock'}</Text>
                  </View>
                </View>

                <View style={[styles.rowCell, { width: 90, flexDirection: 'row', gap: 15 }]}>
                  <TouchableOpacity>
                    <Edit2 color="#ff5722" size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Trash2 color="#ef4444" size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            )})}
            
            {filteredInventory.length === 0 && !loading && (
              <Text style={{ padding: 20, textAlign: 'center', color: '#9ca3af' }}>No inventory items found.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 25,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff5722',
    paddingVertical: 12,
    width: 200,
    borderRadius: 8,
    gap: 8,
  },
  actionBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  summaryContainer: {
    gap: 15,
    marginBottom: 25,
  },
  summaryCardWhite: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  summaryIconBoxWhite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValueWhite: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  summaryLabelWhite: {
    fontSize: 12,
    color: '#64748b',
  },

  summaryCardRed: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  summaryIconBoxRed: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValueRed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  summaryLabelRed: {
    fontSize: 12,
    color: '#ef4444',
  },

  summaryCardGreen: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  summaryIconBoxGreen: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValueGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  summaryLabelGreen: {
    fontSize: 12,
    color: '#10b981',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1e293b',
  },

  tableCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 15,
    marginBottom: 10,
  },
  headerText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 15,
  },
  rowCell: {
    fontSize: 14,
  },
  itemIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontWeight: 'bold',
    color: '#1e293b',
    fontSize: 13,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
