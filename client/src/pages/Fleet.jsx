import React, { useState, useEffect } from 'react';
import { 
  MapIcon, 
  TruckIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getOrders } from '../api';

const mockDrivers = [
  { id: 1, name: 'Ahmet Yılmaz', status: 'Görevde', jobCount: 4, lastUpdate: '3 dk önce', location: 'Pendik / Fevzi Çakmak', phone: '0555 123 45 01', vehicle: '34 AA 123 (Fiat Doblo)' },
  { id: 2, name: 'Mehmet Demir', status: 'Mola', jobCount: 2, lastUpdate: '15 dk önce', location: 'Kartal / Sahil', phone: '0555 123 45 02', vehicle: '34 BB 456 (Renault Kangoo)' },
  { id: 3, name: 'Caner Kaya', status: 'Depoda', jobCount: 0, lastUpdate: '1 saat önce', location: 'Tuzla / Merkez (Ana Depo)', phone: '0555 123 45 03', vehicle: '34 CC 789 (Ford Transit)' },
  { id: 4, name: 'Selin Şahin', status: 'Görevde', jobCount: 5, lastUpdate: 'Yeni', location: 'Maltepe / Altayçeşme', phone: '0555 123 45 04', vehicle: '34 DD 101 (VW Caddy)' }
];

export default function Fleet() {
  const [selectedDriver, setSelectedDriver] = useState(mockDrivers[0]);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');

  const fetchOrdersForTask = async () => {
    try {
      const res = await getOrders();
      // Only show orders that need attention
      setOrders(res.data.filter(o => o.status === 'Bekliyor' || o.status === 'Alındı'));
      setShowTaskModal(true);
    } catch (err) {
       console.error(err);
    }
  };

  const handleAssignTask = () => {
    if(!selectedOrderId) return alert('Lütfen bir sipariş seçin!');
    alert(`Sipariş #${selectedOrderId}, ${selectedDriver.name} personeline başarıyla atandı.`);
    setShowTaskModal(false);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saha & Araç Takibi</h1>
          <p className="mt-1 text-sm text-slate-500">Personel konumlarını ve günlük iş yüklerini anlık izleyin.</p>
        </div>
        <div className="bg-white p-1 rounded-lg border border-slate-200 flex shadow-sm no-print">
          <button 
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'map' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <MapIcon className="w-4 h-4" /> Harita Görünümü
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Liste Görünümü
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left: Driver List */}
        <div className="lg:col-span-1 border border-slate-200 rounded-2xl bg-white overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Aktif Personeller</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {mockDrivers.map(driver => (
              <div 
                key={driver.id} 
                onClick={() => setSelectedDriver(driver)}
                className={`p-4 cursor-pointer transition-all hover:bg-blue-50/30 ${selectedDriver.id === driver.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900">{driver.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    driver.status === 'Görevde' ? 'bg-emerald-100 text-emerald-700' :
                    driver.status === 'Mola' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {driver.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2 truncate">{driver.location}</p>
                <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                   <span className="flex items-center gap-1"><TruckIcon className="w-3 h-3"/> {driver.vehicle.split(' ')[0]}</span>
                   <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3"/> {driver.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {viewMode === 'list' ? (
             <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="font-bold text-slate-800 text-sm">{selectedDriver.name} - Günlük Rota Listesi</h2>
                </div>
                <div className="p-12 text-center flex-1 flex flex-col justify-center">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TruckIcon className="w-8 h-8 text-slate-400" />
                   </div>
                   <p className="text-slate-500 font-medium">Bu personel için henüz bir rota oluşturulmadı.</p>
                   <p className="text-sm text-slate-400 mt-1 mb-6">Sistem üzerinden görev atayarak başlatabilirsiniz.</p>
                   <button onClick={fetchOrdersForTask} className="inline-flex items-center gap-2 mx-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                     Hemen Görev ATA
                   </button>
                </div>
             </div>
          ) : (
            <div className="flex-1 flex flex-col gap-6">
              {/* Driver Detail Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/20">
                      {selectedDriver.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedDriver.name}</h2>
                      <p className="text-sm text-slate-500">{selectedDriver.vehicle}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => alert('Aranıyor... ' + selectedDriver.phone)} className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                      <PhoneIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => alert('Mesaj paneli açılıyor...')} className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                      <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                    </button>
                    <button onClick={fetchOrdersForTask} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition">
                      Görev ATA
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Şu anki Konum</p>
                      <p className="text-sm font-bold text-slate-800">{selectedDriver.location}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tamamlanan İş</p>
                      <p className="text-sm font-bold text-slate-800">{selectedDriver.jobCount} Sipariş</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Durum</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${selectedDriver.status === 'Görevde' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        <span className="text-sm font-bold text-slate-800">{selectedDriver.status}</span>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Telefon</p>
                      <p className="text-sm font-bold text-slate-800">{selectedDriver.phone}</p>
                   </div>
                </div>
              </div>

              {/* Map Mockup */}
              <div className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl relative overflow-hidden group shadow-inner min-h-[400px]">
                 <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.9,29.2&zoom=11&size=800x400&sensor=false')] bg-cover bg-center grayscale-50 opacity-40"></div>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/10 pointer-events-none">
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-bold text-slate-800 shadow-xl border border-slate-200 flex items-center gap-2">
                      <MapIcon className="w-4 h-4 text-blue-600" /> Canlı Takip Etiketi Aktif
                    </span>
                 </div>
                 
                 {/* Simple Pins Mockup */}
                 <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-bounce">
                    <TruckIcon className="w-4 h-4 text-white" />
                 </div>
                 <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-emerald-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                 </div>
                 <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-xl flex items-center justify-center">
                    <ExclamationCircleIcon className="w-3 h-3 text-white" />
                 </div>

                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 text-[11px] font-medium text-slate-700 shadow-lg">
                    <div className="flex items-center gap-2 mb-1.5">
                       <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0"></span> {selectedDriver.name} bu güzergahta
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full flex-shrink-0"></span> Son Teslimat Noktası
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Görev Ata Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 no-print">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Görev Atama</h3>
                  <p className="text-sm text-slate-500">{selectedDriver.name} için iş emri seçin.</p>
                </div>
                <button onClick={() => setShowTaskModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <XMarkIcon className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="p-8">
                 <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-tight">Aktif Sipariş Seçin</label>
                 <select 
                   value={selectedOrderId} 
                   onChange={e => setSelectedOrderId(e.target.value)}
                   className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition-all mb-8 appearance-none"
                 >
                   <option value="">-- Sipariş Listesi --</option>
                   {orders.map(o => (
                     <option key={o.id} value={o.id}>
                       Sipariş #{o.id} - {o.Customer?.firstName} {o.Customer?.lastName} ({o.status})
                     </option>
                   ))}
                 </select>

                 <div className="flex gap-4">
                    <button onClick={() => setShowTaskModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition">İptal</button>
                    <button onClick={handleAssignTask} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition">Görevi Onayla</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
