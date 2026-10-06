import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { StatusBadge } from '../components/common/StatusBadge';
import { InventoryItem } from '../types';
import { api } from '../services/api';
import { 
  Boxes, 
  PlusCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Send,
  Truck,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WarehousesPage: React.FC = () => {
  const { warehouses, inventory, refreshData } = useDisaster();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedItemForAction, setSelectedItemForAction] = useState<InventoryItem | null>(null);
  const [actionType, setActionType] = useState<'dispatch' | 'replenish'>('dispatch');
  const [actionQuantity, setActionQuantity] = useState<number>(10);
  const [actionReason, setActionReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quickNotice, setQuickNotice] = useState<string | null>(null);

  const isWarehouseOperator = user.role === 'warehouse';
  const myDepot = warehouses.find(w => w.name.includes('Central') || w.code.includes('WH-MAIN')) || warehouses[0];

  const filteredItems = inventory.filter(item => {
    const matchWh = selectedWarehouseId === 'all' || item.warehouse_id === selectedWarehouseId;
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchWh && matchCat;
  });

  const lowStockItems = inventory.filter(i => i.status === 'critical' || i.status === 'low');

  const handleQuickDispatch = async (itemNameSubstring: string, qty: number, label: string) => {
    const item = inventory.find(i => i.item_name.toLowerCase().includes(itemNameSubstring.toLowerCase()));
    if (!item) {
      alert(`Item "${itemNameSubstring}" not found in inventory.`);
      return;
    }

    try {
      await api.dispatchInventory({
        inventory_id: item.id,
        quantity: Math.min(qty, item.quantity_available),
        reason: `Rapid Deployment Preset: ${label}`
      });
      await refreshData();
      setQuickNotice(`Dispatched ${qty} ${item.unit} of ${item.item_name}!`);
      setTimeout(() => setQuickNotice(null), 3500);
    } catch (err: any) {
      alert(`Quick dispatch error: ${err.message}`);
    }
  };

  const handleQuickReplenishAllLow = async () => {
    if (lowStockItems.length === 0) {
      setQuickNotice('All depot items are currently at healthy inventory levels.');
      setTimeout(() => setQuickNotice(null), 3000);
      return;
    }

    try {
      for (const item of lowStockItems) {
        await api.dispatchInventory({
          inventory_id: item.id,
          quantity: -100,
          reason: 'Emergency Depot Automated Stock Replenishment'
        });
      }
      await refreshData();
      setQuickNotice(`Replenished ${lowStockItems.length} low-stock inventory lines (+100 each)!`);
      setTimeout(() => setQuickNotice(null), 4000);
    } catch (err: any) {
      alert(`Replenish error: ${err.message}`);
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForAction) return;
    setIsSubmitting(true);
    try {
      if (actionType === 'dispatch') {
        await api.dispatchInventory({
          inventory_id: selectedItemForAction.id,
          quantity: actionQuantity,
          reason: actionReason || 'Emergency Tactical Field Dispatch'
        });
      } else {
        await api.dispatchInventory({
          inventory_id: selectedItemForAction.id,
          quantity: -Math.abs(actionQuantity),
          reason: actionReason || 'Stock Replenishment'
        });
      }
      await refreshData();
      setSelectedItemForAction(null);
      setActionReason('');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Logistics' },
          { label: 'Warehouses & Inventory' }
        ]}
        title="Emergency Warehouses & Stock Telemetry"
        description="Live tracking of medical trauma packs, potable water jugs, emergency rations, and water rescue pumps."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* ROLE WORKSPACE: WAREHOUSE DEPOT QUARTERMASTER (Elena Rostova) */}
        {isWarehouseOperator && myDepot && (
          <div className="card-soft bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-white border-indigo-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-600 text-white">
                    Depot Quartermaster Console
                  </span>
                  <span className="text-xs font-bold text-indigo-900">Officer Elena Rostova</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-indigo-600" />
                  {myDepot.name} ({myDepot.code})
                </h2>
                <p className="text-xs text-slate-600">
                  Location: <strong>{myDepot.address}</strong> · Contact: <strong>{myDepot.contact_person}</strong> · Inventory Lines: <strong>{inventory.filter(i => i.warehouse_id === myDepot.id).length} Active</strong>
                </p>
              </div>

              {/* 1-Click Fast Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleQuickDispatch('water', 50, '50 Water Jugs to Responders')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  Dispatch 50 Water
                </button>
                <button
                  onClick={() => handleQuickDispatch('trauma', 25, '25 Trauma First Aid Kits')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  Dispatch 25 Trauma Kits
                </button>
                <button
                  onClick={handleQuickReplenishAllLow}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  Replenish Low Stock (+100)
                </button>
              </div>
            </div>

            {/* Quick Notice Banner */}
            {quickNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{quickNotice}</span>
              </div>
            )}
          </div>
        )}

        {/* Low Stock Warning Banner */}
        {lowStockItems.length > 0 && (
          <div className="card-soft p-3 bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>{lowStockItems.length} inventory categories</strong> are below emergency safety threshold!
              </span>
            </div>
            <button
              onClick={handleQuickReplenishAllLow}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0"
            >
              One-Click Replenish All
            </button>
          </div>
        )}

        {/* Warehouses Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warehouses.map(wh => {
            const count = inventory.filter(i => i.warehouse_id === wh.id).length;
            const isSelected = selectedWarehouseId === wh.id;
            const isMine = isWarehouseOperator && myDepot?.id === wh.id;

            return (
              <div
                key={wh.id}
                onClick={() => setSelectedWarehouseId(isSelected ? 'all' : wh.id)}
                className={`card-soft p-4 cursor-pointer transition-all ${
                  isMine ? 'ring-2 ring-indigo-400 border-indigo-300' : ''
                } ${
                  isSelected ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/10' : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-500">{wh.code}</span>
                    {isMine && (
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                        ASSIGNED
                      </span>
                    )}
                  </div>
                  <StatusBadge status={wh.status} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{wh.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{wh.address}</p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Contact: {wh.contact_person}</span>
                  <span className="font-semibold text-blue-600">{count} items tracked</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter controls */}
        <div className="card-soft p-4 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Filter Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field text-xs w-auto py-1"
            >
              <option value="all">All Categories</option>
              <option value="water">Potable Water</option>
              <option value="food">Rations / Food</option>
              <option value="medical">Medical / Oxygen</option>
              <option value="rescue_gear">Rescue Equipment</option>
              <option value="shelter_kits">Shelter Supplies</option>
              <option value="fuel">Fuel Reserves</option>
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong>{filteredItems.length}</strong> items across designated supply depots
          </div>
        </div>

        {/* Inventory Items Table */}
        <div className="card-soft overflow-hidden bg-white border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Reserved</th>
                  <th className="py-3 px-4">Threshold</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.item_name}</td>
                    <td className="py-3 px-4 capitalize">{item.category.replace('_', ' ')}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.quantity_available} {item.unit}</td>
                    <td className="py-3 px-4 text-slate-500">{item.quantity_reserved} {item.unit}</td>
                    <td className="py-3 px-4 text-slate-400">{item.minimum_threshold} {item.unit}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'healthy' ? 'bg-emerald-50 text-emerald-700' :
                        item.status === 'low' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setSelectedItemForAction(item);
                          setActionType('dispatch');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 text-[11px] font-semibold"
                      >
                        Dispatch
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItemForAction(item);
                          setActionType('replenish');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Transaction Modal */}
      {selectedItemForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              {actionType} Inventory: {selectedItemForAction.item_name}
            </h3>
            <p className="text-xs text-slate-500">
              Current stock: <strong>{selectedItemForAction.quantity_available} {selectedItemForAction.unit}</strong>
            </p>

            <form onSubmit={handleTransaction} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity ({selectedItemForAction.unit})</label>
                <input
                  type="number"
                  min="1"
                  max={actionType === 'dispatch' ? selectedItemForAction.quantity_available : 5000}
                  value={actionQuantity}
                  onChange={(e) => setActionQuantity(Number(e.target.value))}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Reason / Mission Reference</label>
                <input
                  type="text"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="e.g. Field emergency medical dispatch"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForAction(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  {isSubmitting ? 'Recording...' : 'Confirm Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
