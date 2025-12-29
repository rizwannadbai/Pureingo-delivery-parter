
import React, { useState, useEffect } from 'react';
import { db } from '../services/mockFirestore';
import { DeliveryPartner, Order } from '../types';
import { OrderCard } from '../components/OrderCard';
/* Added Package to imports */
import { Power, TrendingUp, CheckCircle2, Navigation, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [partner, setPartner] = useState<DeliveryPartner>(db.getPartner());
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const navigate = useNavigate();

  const toggleStatus = () => {
    const newStatus = partner.status === 'active' ? 'offline' : 'active';
    const updated = db.updatePartner({ status: newStatus });
    setPartner(updated);
  };

  const assignedOrders = orders.filter(o => o.status === 'assigned');
  const activeOrder = orders.find(o => o.id === partner.activeOrderId);

  useEffect(() => {
    // Initial load
    setPartner(db.getPartner());
    setOrders(db.getOrders());
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Partner Status Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src={partner.profileImage} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${partner.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Hi, {partner.name.split(' ')[0]}</h2>
            <p className="text-xs text-gray-400 font-medium">Partner ID: {partner.id}</p>
          </div>
        </div>
        <button 
          onClick={toggleStatus}
          className={`px-4 py-2 rounded-xl flex items-center space-x-2 font-bold text-xs transition-all ${
            partner.status === 'active' 
              ? 'bg-red-50 text-red-600' 
              : 'bg-green-600 text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{partner.status === 'active' ? 'Go Offline' : 'Go Online'}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earnings Today</p>
          <p className="text-xl font-bold text-gray-800">₹{partner.earningsToday}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deliveries</p>
          <p className="text-xl font-bold text-gray-800">{partner.totalDelivered}</p>
        </div>
      </div>

      {/* Active Order Callout */}
      {activeOrder && (
        <div className="bg-green-600 text-white p-4 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
            <Navigation className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Ongoing Delivery</span>
            <h3 className="text-lg font-bold mt-1">{activeOrder.customerName}</h3>
            <p className="text-xs opacity-90 mt-1 line-clamp-1">{activeOrder.deliveryAddress}</p>
            <button 
              onClick={() => navigate(`/order/${activeOrder.id}`)}
              className="mt-4 bg-white text-green-600 font-bold px-6 py-2 rounded-xl text-sm active:scale-95 transition-all w-full"
            >
              Resume Delivery
            </button>
          </div>
        </div>
      )}

      {/* Assigned Orders List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Available Orders ({assignedOrders.length})</h3>
          <button className="text-xs font-bold text-green-600 px-2 py-1 bg-green-50 rounded-lg">Refresh</button>
        </div>
        
        {partner.status === 'offline' ? (
          <div className="bg-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <Power className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">You are currently offline</p>
            <p className="text-xs text-gray-400 mt-1">Go online to see new delivery assignments</p>
          </div>
        ) : assignedOrders.length > 0 ? (
          <div className="space-y-4">
            {assignedOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onClick={(id) => navigate(`/order/${id}`)} 
              />
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-200" />
             </div>
             <p className="text-gray-400 font-medium italic">Searching for orders near you...</p>
          </div>
        )}
      </div>
    </div>
  );
};
