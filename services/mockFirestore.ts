
import { Order, DeliveryPartner, OrderStatus } from '../types';
import { MOCK_ORDERS, MOCK_PARTNER } from '../mockData';

class MockFirestore {
  private orders: Order[] = [];
  private partner: DeliveryPartner;

  constructor() {
    const savedOrders = localStorage.getItem('pureingo_orders');
    const savedPartner = localStorage.getItem('pureingo_partner');
    
    this.orders = savedOrders ? JSON.parse(savedOrders) : MOCK_ORDERS;
    this.partner = savedPartner ? JSON.parse(savedPartner) : MOCK_PARTNER;
  }

  private save() {
    localStorage.setItem('pureingo_orders', JSON.stringify(this.orders));
    localStorage.setItem('pureingo_partner', JSON.stringify(this.partner));
  }

  getPartner() { return this.partner; }

  updatePartner(updates: Partial<DeliveryPartner>) {
    this.partner = { ...this.partner, ...updates };
    this.save();
    return this.partner;
  }

  getOrders() { return this.orders; }

  getOrderById(id: string) { return this.orders.find(o => o.id === id); }

  updateOrderStatus(orderId: string, status: OrderStatus) {
    this.orders = this.orders.map(o => {
      if (o.id === orderId) {
        const updates: Partial<Order> = { status };
        if (status === 'pickedUp') updates.pickedUpAt = Date.now();
        if (status === 'delivered') updates.deliveredAt = Date.now();
        return { ...o, ...updates };
      }
      return o;
    });
    
    if (status === 'delivered') {
      this.partner.earningsToday += 45; // Mock earning per delivery
      this.partner.totalDelivered += 1;
      this.partner.activeOrderId = null;
    } else if (status === 'accepted') {
      this.partner.activeOrderId = orderId;
    }
    
    this.save();
    return this.orders.find(o => o.id === orderId);
  }

  updatePartnerLocation(lat: number, lng: number) {
    this.partner.currentLocation = { lat, lng };
    this.save();
  }
}

export const db = new MockFirestore();
