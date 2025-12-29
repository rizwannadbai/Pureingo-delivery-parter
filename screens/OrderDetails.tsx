
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/mockFirestore';
import { Order, OrderStatus, Location } from '../types';
import { MapPin, Phone, MessageSquare, Navigation, CheckCircle2, ChevronLeft, Package, Clock, Info, X, ShieldCheck, AlertTriangle } from 'lucide-react';

// Declare google global to fix TypeScript "Cannot find name 'google'" errors
declare const google: any;

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Instance management refs
  const mapInstance = useRef<any>(null);
  const partnerMarker = useRef<any>(null);
  const destinationMarker = useRef<any>(null);
  const directionsRenderer = useRef<any>(null);
  const directionsService = useRef<any>(null);
  const isMapInitialized = useRef(false);

  const [order, setOrder] = useState<Order | undefined>(db.getOrderById(id || ''));
  const [partnerLoc, setPartnerLoc] = useState<Location>(db.getPartner().currentLocation);
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  
  // OTP Verification State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Poll for location updates from our simulated Firestore (db)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPartner = db.getPartner();
      if (
        currentPartner.currentLocation.lat !== partnerLoc.lat ||
        currentPartner.currentLocation.lng !== partnerLoc.lng
      ) {
        setPartnerLoc(currentPartner.currentLocation);
      }
    }, 2000); 
    return () => clearInterval(interval);
  }, [partnerLoc]);

  // Smooth marker animation helper
  const animateMarker = useCallback((marker: any, newPos: Location) => {
    if (!marker) return;
    const oldPos = marker.getPosition();
    if (!oldPos) return;

    const startLat = oldPos.lat();
    const startLng = oldPos.lng();
    const startTime = performance.now();
    const duration = 1000; 

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;

      const currentLat = startLat + (newPos.lat - startLat) * easeProgress;
      const currentLng = startLng + (newPos.lng - startLng) * easeProgress;

      marker.setPosition({ lat: currentLat, lng: currentLng });
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, []);

  const updateRoute = useCallback((origin: Location, destination: Location) => {
    if (!directionsService.current || !directionsRenderer.current) return;
    
    directionsService.current.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    }, (result: any, status: any) => {
      if (status === 'OK' && result) {
        directionsRenderer.current.setDirections(result);
      }
    });
  }, []);

  // One-time Map Initialization
  useEffect(() => {
    if (!order || !mapRef.current || typeof google === 'undefined' || isMapInitialized.current) return;

    try {
      const map = new google.maps.Map(mapRef.current, {
        center: partnerLoc,
        zoom: 15,
        disableDefaultUI: true,
        gestureHandling: 'greedy', 
        styles: [
          { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
          { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
        ]
      });
      mapInstance.current = map;

      directionsService.current = new google.maps.DirectionsService();
      directionsRenderer.current = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, 
        polylineOptions: {
          strokeColor: '#16a34a',
          strokeWeight: 6,
          strokeOpacity: 0.8
        }
      });

      destinationMarker.current = new google.maps.Marker({
        position: order.locationCoordinates,
        map: map,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff"
        }
      });

      partnerMarker.current = new google.maps.Marker({
        position: partnerLoc,
        map: map,
        zIndex: 999,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff"
        }
      });

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(partnerLoc);
      bounds.extend(order.locationCoordinates);
      map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });

      updateRoute(partnerLoc, order.locationCoordinates);
      isMapInitialized.current = true;
    } catch (err) {
      console.error("Map Init Error:", err);
      setMapError(true);
    }
  }, [order, partnerLoc, updateRoute]);

  // Handle movements and status changes without re-init map
  useEffect(() => {
    if (isMapInitialized.current && partnerMarker.current && mapInstance.current) {
      animateMarker(partnerMarker.current, partnerLoc);
      
      // Auto-pan if the order is enRoute
      if (order?.status === 'enRoute') {
        mapInstance.current.panTo(partnerLoc);
        updateRoute(partnerLoc, order.locationCoordinates);
      }
    }
  }, [partnerLoc, order?.status, animateMarker, updateRoute]);

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!order) return;
    setLoading(true);
    
    // Simulate API network delay
    setTimeout(() => {
      const updated = db.updateOrderStatus(order.id, newStatus);
      if (updated) {
        setOrder(updated);
      }
      setLoading(false);
      if (newStatus === 'delivered') setShowOtpModal(false);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === (order?.deliveryOtp || '1234')) {
      setOtpError(false);
      handleUpdateStatus('delivered');
    } else {
      setOtpError(true);
      setEnteredOtp('');
    }
  };

  const getAction = () => {
    if (!order) return null;
    
    const partner = db.getPartner();
    if (partner.status === 'offline' && order.status === 'assigned') {
      return (
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <p className="text-xs font-bold text-orange-800">You must go Online to accept orders.</p>
        </div>
      );
    }

    switch (order.status) {
      case 'assigned':
        return (
          <div className="grid grid-cols-2 gap-4">
            <button 
              disabled={loading}
              onClick={() => navigate('/dashboard')}
              className="py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold active:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              onClick={() => handleUpdateStatus('accepted')} 
              className="py-4 rounded-2xl bg-green-600 text-white font-bold shadow-lg shadow-green-100 active:scale-95 transition-all"
            >
              Accept Order
            </button>
          </div>
        );
      case 'accepted':
        return (
          <button 
            disabled={loading}
            onClick={() => handleUpdateStatus('pickedUp')} 
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100"
          >
            Mark as Picked Up
          </button>
        );
      case 'pickedUp':
        return (
          <button 
            disabled={loading}
            onClick={() => handleUpdateStatus('enRoute')} 
            className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-100"
          >
            Start Delivery
          </button>
        );
      case 'enRoute':
        return (
          <button 
            disabled={loading}
            onClick={() => setShowOtpModal(true)} 
            className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold shadow-lg shadow-green-100"
          >
            Confirm Delivery
          </button>
        );
      default:
        return (
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full py-4 rounded-2xl bg-gray-800 text-white font-bold"
          >
            Back to Dashboard
          </button>
        );
    }
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <Package className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-gray-500 mt-2">This order might have been cancelled or assigned to someone else.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-6 text-green-600 font-bold px-6 py-2 bg-green-50 rounded-xl">Return Home</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center space-x-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h2 className="font-bold text-lg">Delivery Details</h2>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white px-6 py-4 flex justify-between relative mb-4">
        {['assigned', 'pickedUp', 'enRoute', 'delivered'].map((s, idx) => {
          const statuses = ['assigned', 'accepted', 'pickedUp', 'enRoute', 'delivered'];
          const currentIdx = statuses.indexOf(order.status);
          const targetIdx = statuses.indexOf(s);
          const isDone = currentIdx >= targetIdx;
          const isActive = currentIdx === targetIdx;

          return (
            <div key={s} className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                isDone ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-300'
              }`}>
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`text-[10px] mt-1 font-bold uppercase ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {s === 'assigned' ? 'Assign' : s === 'pickedUp' ? 'Pickup' : s === 'enRoute' ? 'Route' : 'End'}
              </span>
            </div>
          );
        })}
        <div className="absolute top-8 left-12 right-12 h-0.5 bg-gray-100 -z-0"></div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Map Section */}
        <div className="bg-gray-100 h-64 rounded-2xl relative overflow-hidden shadow-inner border border-gray-200">
          {typeof google === 'undefined' || mapError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-500 font-medium">Loading navigation...</p>
            </div>
          ) : (
            <div id="map" ref={mapRef} className="absolute inset-0 w-full h-full" />
          )}
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <button onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&origin=${partnerLoc.lat},${partnerLoc.lng}&destination=${order.locationCoordinates.lat},${order.locationCoordinates.lng}&travelmode=driving`;
              window.open(url, '_blank');
            }} className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-2 border border-gray-100 active:scale-95 transition-all">
              <Navigation className="w-5 h-5 text-green-600 fill-green-600" />
              <span className="font-bold text-gray-800">Launch Navigation</span>
            </button>
          </div>
        </div>

        {/* Customer Details Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</p>
              <h3 className="text-xl font-bold text-gray-800">{order.customerName}</h3>
            </div>
            <div className="flex space-x-2">
              <a href={`tel:${order.customerPhone}`} className="p-3 bg-green-50 rounded-xl active:scale-90 transition-all">
                <Phone className="w-5 h-5 text-green-600" />
              </a>
              <button className="p-3 bg-blue-50 rounded-xl active:scale-90 transition-all">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
             <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Drop Location</p>
                   <p className="text-sm text-gray-600 font-medium mt-0.5">{order.deliveryAddress}</p>
                </div>
             </div>
             <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup Location</p>
                   <p className="text-sm text-gray-600 font-medium mt-0.5">{order.pickupAddress}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Package</p>
                  <p className="text-sm font-bold text-gray-800">{order.weight}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Schedule</p>
                  <p className="text-sm font-bold text-gray-800">{order.timeSlot}</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Verify Customer</h3>
              </div>
              <button onClick={() => setShowOtpModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-6 font-medium px-4">Enter the 4-digit security code provided by the customer.</p>
                <div className="flex justify-center space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <input
                      key={i}
                      type="number"
                      maxLength={1}
                      className={`w-14 h-16 text-center text-3xl font-black bg-gray-50 border-2 rounded-2xl outline-none transition-all ${
                        otpError ? 'border-red-500 text-red-600 animate-pulse' : 'border-transparent focus:border-green-500 focus:bg-white'
                      }`}
                      value={enteredOtp[i] || ''}
                      autoFocus={i === 0 && enteredOtp.length === 0}
                      onChange={(e) => {
                        const val = e.target.value.slice(-1);
                        if (val && enteredOtp.length < 4) {
                          setEnteredOtp(prev => prev + val);
                          setOtpError(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                          setEnteredOtp(prev => prev.slice(0, -1));
                        }
                      }}
                    />
                  ))}
                </div>
                {otpError && <p className="text-[10px] font-black text-red-600 mt-4 uppercase tracking-widest">Incorrect Verification Code</p>}
                
                {/* Simulation Helper */}
                <div className="mt-8 p-3 bg-blue-50 border border-blue-100 rounded-2xl">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Testing Code</p>
                   <p className="text-xs text-blue-800 font-bold">Use OTP: {order.deliveryOtp}</p>
                </div>
              </div>

              <button
                disabled={loading || enteredOtp.length < 4}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-xl shadow-green-100 active:scale-95 transition-all"
              >
                {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete Delivery'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t safe-area-bottom max-w-md mx-auto z-30">
        {loading && !showOtpModal ? (
          <div className="w-full py-4 rounded-2xl bg-gray-50 flex items-center justify-center space-x-3">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-bold text-gray-500 text-sm tracking-wide">Updating status...</span>
          </div>
        ) : getAction()}
      </div>
    </div>
  );
};
