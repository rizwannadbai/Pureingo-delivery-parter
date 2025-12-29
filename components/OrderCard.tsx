
import React from 'react';
import { MapPin, Clock, Package, ChevronRight } from 'lucide-react';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onClick: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  return (
    <div 
      onClick={() => onClick(order.id)}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 active:scale-95 transition-transform cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {order.id}</span>
          <h3 className="font-bold text-gray-800 text-lg">{order.customerName}</h3>
        </div>
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          order.status === 'assigned' ? 'bg-blue-50 text-blue-600' : 
          order.status === 'accepted' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">{order.deliveryAddress}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600 font-medium">{order.timeSlot}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600 font-medium">{order.weight}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs font-bold text-green-600">Earnings: ₹45.00</span>
        <div className="flex items-center text-green-600 font-bold text-sm">
          Details <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
};
