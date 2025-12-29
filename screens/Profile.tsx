
import React from 'react';
import { db } from '../services/mockFirestore';
import { User, Phone, Mail, Shield, LogOut, ChevronRight, Award, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const partner = db.getPartner();
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Edit Profile', color: 'bg-blue-50 text-blue-600' },
    { icon: Award, label: 'Incentives & Rewards', color: 'bg-orange-50 text-orange-600' },
    { icon: Shield, label: 'Partner Privacy & Policy', color: 'bg-green-50 text-green-600' },
    { icon: LogOut, label: 'Sign Out', color: 'bg-red-50 text-red-600', onClick: () => navigate('/') },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center py-6">
         <div className="relative">
            <img src={partner.profileImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-xl" />
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1.5 rounded-full border-2 border-white">
               <Star className="w-4 h-4 fill-white" />
            </div>
         </div>
         <h2 className="text-xl font-bold mt-4 text-gray-800">{partner.name}</h2>
         <div className="flex items-center space-x-1 mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(partner.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-400 ml-1">{partner.rating} Rating</span>
         </div>
      </div>

      {/* Info Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center space-x-3">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
            <p className="text-sm font-bold text-gray-700">{partner.phone}</p>
          </div>
        </div>
        <div className="p-4 border-b border-gray-50 flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
            <p className="text-sm font-bold text-gray-700">{partner.name.toLowerCase().replace(' ', '.')}@pureingo.in</p>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-3">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button 
              key={idx}
              onClick={item.onClick}
              className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          );
        })}
      </div>

      {/* App Version */}
      <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] py-4">
        Pureingo Partner v2.4.1 (Stable)
      </p>
    </div>
  );
};
