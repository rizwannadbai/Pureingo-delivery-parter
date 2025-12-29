
export type OrderStatus = 'assigned' | 'accepted' | 'pickedUp' | 'enRoute' | 'delivered';

export interface Location {
  lat: number;
  lng: number;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  profileImage: string;
  status: 'active' | 'offline';
  currentLocation: Location;
  activeOrderId: string | null;
  totalDelivered: number;
  earningsToday: number;
  rating: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  subscriptionId?: string;
  deliveryPartnerId: string | null;
  status: OrderStatus;
  deliveryAddress: string;
  locationCoordinates: Location;
  weight: string;
  timeSlot: string;
  createdAt: number;
  pickedUpAt?: number;
  deliveredAt?: number;
  specialNotes?: string;
  pickupAddress: string;
  deliveryOtp?: string; // OTP to be collected from customer
}

export interface AuthState {
  user: DeliveryPartner | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
