
import { Order, DeliveryPartner } from './types';

export const MOCK_PARTNER: DeliveryPartner = {
  id: 'DP_7788',
  name: 'Rahul Sharma',
  phone: '+91 98765 43210',
  profileImage: 'https://picsum.photos/seed/rahul/200',
  status: 'offline',
  currentLocation: { lat: 12.9716, lng: 77.5946 }, // Bangalore
  activeOrderId: null,
  totalDelivered: 142,
  earningsToday: 0,
  rating: 4.8
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'PR-1029',
    userId: 'U_112',
    customerName: 'Sanjay Gupta',
    customerPhone: '+91 88776 65544',
    deliveryPartnerId: null,
    status: 'assigned',
    deliveryAddress: 'Flat 402, Green Valley Apartments, Indiranagar, Bangalore',
    locationCoordinates: { lat: 12.9784, lng: 77.6408 },
    weight: '450-500g Fruit Box',
    timeSlot: '08:00 AM - 11:00 AM',
    createdAt: Date.now() - 3600000,
    pickupAddress: 'Pureingo Central Hub, Domlur, Bangalore',
    specialNotes: 'Leave at front desk if not available',
    deliveryOtp: '1234'
  },
  {
    id: 'PR-1030',
    userId: 'U_113',
    customerName: 'Anjali Menon',
    customerPhone: '+91 77665 54433',
    deliveryPartnerId: null,
    status: 'assigned',
    deliveryAddress: 'No. 12, 4th Cross, Koramangala 5th Block, Bangalore',
    locationCoordinates: { lat: 12.9352, lng: 77.6245 },
    weight: '450-500g Fruit Box',
    timeSlot: '08:00 AM - 11:00 AM',
    createdAt: Date.now() - 1800000,
    pickupAddress: 'Pureingo Central Hub, Domlur, Bangalore',
    deliveryOtp: '5678'
  }
];
