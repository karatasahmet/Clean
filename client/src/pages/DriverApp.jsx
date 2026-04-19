import React, { useState, useEffect } from 'react';
import { TruckIcon, ClipboardDocumentListIcon, UserCircleIcon, MapPinIcon, QrCodeIcon, PlusCircleIcon, DocumentPlusIcon, XMarkIcon, PhoneIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';
import { getOrders, updateOrder, createOrderItem, createCustomer, createOrder, getServices, updateProfile, changePassword } from '../api';

export default function DriverApp() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Auth state for Driver
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [driverName, setDriverName] = useState('');
  
  // New Item State
  const [itemType, setItemType] = useState('');
  const [itemWidth, setItemWidth] = useState('');
  const [itemLength, setItemLength] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [addedItems, setAddedItems] = useState([]); // Temporary local state before final sync

  // New Order State for Field Entry
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ firstName: '', lastName: '', phone: '', address: '', notes: '' });

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [orderRes, svcRes] = await Promise.all([
        getOrders(),
        getServices()
      ]);
      
      const pickupTasks = orderRes.data.filter(o => o.status === 'Bekliyor');
      setOrders(pickupTasks);
      setServices(svcRes.data);
      if (svcRes.data.length > 0) {
        setItemType(svcRes.data[0].name);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (orderId) => {
    try {
      // First save all added items
      for (const item of addedItems) {
        const selectedService = services.find(s => s.name === item.type);
        await createOrderItem(orderId, {
          ...item,
          unitPrice: selectedService ? selectedService.pricePerM2 : 0
        });
      }
      
      // Then update order status
      await updateOrder(orderId, { status: 'Alındı' });
      alert("Sipariş araca alındı ve barkodlar oluşturuldu!");
      setSelectedOrder(null);
      setAddedItems([]);
      fetchInitialData();
    } catch (err) {
      alert("Güncelleme hatası");
    }
  };

  const addItemToOrder = () => {
    if (!itemWidth || !itemLength) {
      alert("Lütfen en ve boy giriniz.");
      return;
    }
    const newItem = {
      type: itemType,
      width: itemWidth,
      length: itemLength,
      quantity: itemQuantity
    };
    setAddedItems([...addedItems, newItem]);
    setItemWidth('');
    setItemLength('');
    setItemQuantity('1');
  };

  const calculateTotalM2 = () => {
    return addedItems.reduce((total, item) => total + (item.width * item.length * item.quantity), 0).toFixed(2);
  };

  const handleCreateNewOrder = async (e) => {
    e.preventDefault();
    try {
      // 1. Create customer
      const custRes = await createCustomer({
        firstName: newCustomerForm.firstName,
        lastName: newCustomerForm.lastName,
        phone: newCustomerForm.phone,
        address: newCustomerForm.address
      });
      // 2. Create order
      await createOrder({
        customerId: custRes.data.id,
        notes: newCustomerForm.notes || 'Saha personeli tarafından oluşturuldu.',
        totalAmount: 0 // Will be updated automatically
      });
      
      alert("Yeni müşteri ve sipariş kaydı oluşturuldu!");
      setIsCreatingNew(false);
      setNewCustomerForm({ firstName: '', lastName: '', phone: '', address: '', notes: '' });
      await fetchInitialData();
    } catch (err) {
      alert("Oluşturulurken hata meydana geldi.");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if(driverName.trim() !== '') {
      setIsAuthenticated(true);
      fetchInitialData(); // Load after auth
    } else {
      alert("Lütfen adınızı girin.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-screen bg-slate-900 justify-center items-center px-6 mx-auto sm:max-w-md w-full">
        <div className="w-full bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">CleanAqua</h1>
            <p className="text-slate-500 font-medium">Saha Personeli Girişi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Adınız Soyadınız *</label>
               <input type="text" required value={driverName} onChange={e => setDriverName(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Örn: Ahmet Yılmaz"/>
            </div>
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Şifre *</label>
               <input type="password" required 
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••"/>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition active:scale-[0.98]">
              Sisteme Gir
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden">
      
      {/* Mobile Top Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg leading-tight uppercase tracking-widest">Saha Görevleri</h1>
            <p className="text-blue-200 text-[10px] font-black uppercase">Hoşgeldin, {driverName}</p>
          </div>
          <button onClick={() => setShowProfileModal(true)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition shadow-inner">
            <UserCircleIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 relative z-0 pb-20">
        {loading ? (
          <p className="text-center text-slate-500 mt-10 font-bold uppercase tracking-widest text-xs">Görevler yükleniyor...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-200 mt-10">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <ClipboardDocumentListIcon className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Tüm İşler Tamam!</h2>
            <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest leading-relaxed">Şu an sıradaki alınacak sipariş bulunmuyor.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform flex flex-col gap-3 group"
                 onClick={() => setSelectedOrder(order)}>
               <div className="flex justify-between items-start">
                 <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-blue-100 uppercase tracking-widest">
                   {order.status}
                 </span>
                 <span className="text-slate-900 font-black text-sm tabular-nums">#{order.id.toString().padStart(4, '0')}</span>
               </div>
               
               <div>
                 <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{order.Customer?.firstName} {order.Customer?.lastName}</h3>
                 <div className="flex items-start gap-2 mt-2 text-slate-500 text-xs font-bold leading-relaxed">
                   <MapPinIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                   <p className="line-clamp-2 uppercase tracking-wide">{order.Customer?.address} - {order.Customer?.district}</p>
                 </div>
               </div>
               
               {order.notes && (
                 <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 font-bold uppercase border border-slate-100 italic">
                   NOT: {order.notes}
                 </div>
               )}
            </div>
          ))
        )}
      </main>

      {/* FAB (Floating Action Button) for New Order */}
      <button onClick={() => setIsCreatingNew(true)} className="absolute bottom-24 right-6 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl shadow-slate-900/40 hover:scale-110 transition active:scale-95 z-10 flex items-center justify-center">
        <DocumentPlusIcon className="w-7 h-7" />
      </button>

      {/* Bottom Navigation (PWA style) */}
      <nav className="bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-around p-4 pb-safe absolute bottom-0 w-full z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('tasks')} className={`flex flex-col items-center gap-1 ${activeTab === 'tasks' ? 'text-blue-600 scale-110 font-bold' : 'text-slate-300'}`}>
          <ClipboardDocumentListIcon className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Görevler</span>
        </button>
        <button onClick={() => setActiveTab('deliveries')} className={`flex flex-col items-center gap-1 ${activeTab === 'deliveries' ? 'text-blue-600 scale-110 font-bold' : 'text-slate-300'}`}>
          <TruckIcon className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Dağıtım</span>
        </button>
      </nav>

      {/* Order Detail Slide-up Modal */}
      {selectedOrder && (
        <div className="absolute inset-0 bg-slate-900/60 z-20 flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-[40px] p-8 shadow-2xl pb-safe flex flex-col max-h-[95vh]">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8"></div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedOrder.Customer?.firstName} {selectedOrder.Customer?.lastName}</h2>
                  <p className="text-blue-600 font-black text-lg tabular-nums mt-1">{selectedOrder.Customer?.phone}</p>
                </div>
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <QrCodeIcon className="w-6 h-6" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Konum Bilgisi</p>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed uppercase">{selectedOrder.Customer?.address}<br/><span className="text-blue-600">{selectedOrder.Customer?.district} / İSTANBUL</span></p>
                </div>
                
                {selectedOrder.notes && (
                  <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Müşteri Notu</p>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">{selectedOrder.notes}</p>
                  </div>
                )}
                
                <div className="p-6 border-2 border-slate-100 bg-white shadow-xl shadow-slate-100 rounded-[32px] mt-4">
                  <p className="text-xs font-black text-slate-900 mb-5 flex items-center gap-2 uppercase tracking-widest">
                    <PlusCircleIcon className="w-6 h-6 text-blue-600" /> Ürün Detay Girişi
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Ürün Tipi</label>
                      <select value={itemType} onChange={e => setItemType(e.target.value)} className="w-full p-4 border border-slate-100 rounded-2xl text-sm font-black bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                        {services.map(s => <option key={s.id} value={s.name}>{s.name} (₺{s.pricePerM2}/m²)</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">En (m)</label>
                        <input type="number" step="0.1" placeholder="2.5" value={itemWidth} onChange={e => setItemWidth(e.target.value)} className="w-full p-4 border border-slate-100 rounded-2xl text-sm font-black bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Boy (m)</label>
                        <input type="number" step="0.1" placeholder="3.0" value={itemLength} onChange={e => setItemLength(e.target.value)} className="w-full p-4 border border-slate-100 rounded-2xl text-sm font-black bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={addItemToOrder} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black flex justify-center items-center gap-2 hover:bg-slate-800 transition shadow-xl shadow-slate-200 uppercase tracking-[0.2em]">
                    <PlusCircleIcon className="w-6 h-6" /> Listeye Kaydet
                  </button>

                  {addedItems.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <p className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4">Mevcut Liste ({addedItems.length})</p>
                      <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                        {addedItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                            <div>
                               <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.type}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">{item.width}m x {item.length}m</p>
                            </div>
                            <span className="text-sm font-black text-blue-600 tabular-nums">{(item.width*item.length*item.quantity).toFixed(2)} M²</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-xs font-black text-white bg-blue-600 p-5 rounded-2xl shadow-xl shadow-blue-100 uppercase tracking-[0.1em]">
                        <span>Toplam Metraj:</span>
                        <span className="text-xl tracking-tighter tabular-nums">{calculateTotalM2()} M²</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 bg-white">
               <button onClick={() => { setSelectedOrder(null); setAddedItems([]); }} className="flex-1 py-5 bg-slate-100 text-slate-700 font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-slate-200 transition">
                 İptal
               </button>
               <button onClick={() => handlePickup(selectedOrder.id)} className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/30 text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition active:scale-95">
                 Teslim Aldım & Bitir
               </button>
            </div>
          </div>
        </div>
      )}

      {/* New Order Creation Modal */}
      {isCreatingNew && (
        <div className="absolute inset-0 bg-slate-900/60 z-30 flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-[40px] p-8 shadow-2xl pb-safe flex flex-col max-h-[95vh]">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8"></div>
            <div className="flex-1 overflow-y-auto">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tighter"><DocumentPlusIcon className="w-7 h-7 text-blue-600"/> Yeni Müşteri Kaydı</h2>
              <form onSubmit={handleCreateNewOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Ad</label>
                    <input required placeholder="..." value={newCustomerForm.firstName} onChange={e => setNewCustomerForm({...newCustomerForm, firstName: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Soyad</label>
                    <input required placeholder="..." value={newCustomerForm.lastName} onChange={e => setNewCustomerForm({...newCustomerForm, lastName: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Telefon</label>
                  <input required type="tel" placeholder="05XX XXX XX XX" value={newCustomerForm.phone} onChange={e => setNewCustomerForm({...newCustomerForm, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Açık Adres</label>
                  <textarea required placeholder="Mahalle, Şehir vb." rows="3" value={newCustomerForm.address} onChange={e => setNewCustomerForm({...newCustomerForm, address: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Müşteri Notu</label>
                  <input placeholder="..." value={newCustomerForm.notes} onChange={e => setNewCustomerForm({...newCustomerForm, notes: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsCreatingNew(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest">Vazgeç</button>
                  <button type="submit" className="flex-[2] py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20">Kaydı Tamamla</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Driver Profile Modal */}
      {showProfileModal && (
        <div className="absolute inset-0 bg-slate-900/60 z-40 flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-[40px] shadow-2xl pb-safe flex flex-col">
            <div className="p-10">
              <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-10"></div>
              <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 bg-blue-600 text-white rounded-[32px] flex items-center justify-center font-black text-4xl shadow-2xl shadow-blue-200">
                  {driverName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{driverName}</h2>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Aktif Saha Personeli</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center group">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</p>
                     <p className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Çevrimiçi</p>
                   </div>
                 </div>
              </div>

              <div className="space-y-4">
                <button onClick={() => { setIsAuthenticated(false); setShowProfileModal(false); }} className="w-full py-5 bg-red-50 text-red-600 font-black rounded-3xl border border-red-100 text-xs uppercase tracking-[0.2em] active:scale-95 transition">
                  Oturumu Kapat
                </button>
                <button onClick={() => setShowProfileModal(false)} className="w-full py-2 text-slate-300 font-black text-[10px] uppercase tracking-widest">
                  Geri Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
