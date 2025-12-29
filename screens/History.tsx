
import React, { useState } from 'react';
import { db } from '../services/mockFirestore';
import { CheckCircle2, Calendar, TrendingUp } from 'lucide-react';

export const History: React.FC = () => {
  const allOrders = db.getOrders();
  const deliveredOrders = allOrders.filter(o => o.status === 'delivered');

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center mb-6">
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Earnings</p>
              <h2 className="text-3xl font-bold">₹{db.getPartner().totalDelivered * 45}</h2>
           </div>
           <TrendingUp className="w-10 h-10 text-green-400 opacity-50" />
        </div>
        <div className="flex space-x-6">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deliveries</p>
              <p className="text-lg font-bold">{db.getPartner().totalDelivered}</p>
           </div>
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Efficiency</p>
              <p className="text-lg font-bold">98%</p>
           </div>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 mt-6 mb-4">Delivery History</h3>

      {deliveredOrders.length > 0 ? (
        <div className="space-y-4">
          {deliveredOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{order.customerName}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+ ₹45.00</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Base Fee</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-gray-500 text-xs">
                 <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(order.deliveredAt || Date.now()).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center">
                    <span className="font-medium">Delivered at {new Date(order.deliveredAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Calendar className="w-12 h-12 text-gray-200 mb-2" />
          <p className="text-gray-400 font-medium">No history found</p>
          <p className="text-xs text-gray-300">Your completed deliveries will appear here</p>
        </div>
      )}
    </div>
  );
};
