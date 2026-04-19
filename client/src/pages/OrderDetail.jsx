import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getOrder, 
  updateOrder, 
  createOrderItem, 
  getServices, 
  getActiveCampaigns, 
  verifyCoupon 
} from '../api';
import { 
  PrinterIcon, 
  ArrowLeftIcon, 
  QrCodeIcon, 
  CheckCircleIcon, 
  ArrowPathIcon, 
  PlusIcon,
  ShoppingBagIcon,
  TicketIcon,
  HashtagIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const STATUS_STAGES = [
  'Bekliyor',
  'Alındı',
  'Yıkamada',
  'Kurumada',
  'Hazır',
  'Teslim Edildi'
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [services, setServices] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  
  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // New Item Form State
  const [newItem, setNewItem] = useState({
    type: '',
    width: '',
    length: '',
    quantity: '1'
  });

  useEffect(() => {
    fetchOrder();
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const [svcRes, campRes] = await Promise.all([
        getServices(),
        getActiveCampaigns()
      ]);
      setServices(svcRes.data);
      setActiveCampaigns(campRes.data);
      if (svcRes.data.length > 0) {
        setNewItem(prev => ({ ...prev, type: svcRes.data[0].name }));
      }
    } catch (err) {
      console.error('Data fetching error:', err);
    }
  };

  const fetchOrder = async () => {
    try {
      const res = await getOrder(id);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      alert('Sipariş bulunamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateOrder(id, { status: newStatus });
      await fetchOrder();
    } catch (err) {
      alert('Durum güncellenirken hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.width || !newItem.length) {
      alert('Lütfen en ve boy ölçülerini giriniz.');
      return;
    }

    setUpdating(true);
    try {
      const selectedService = services.find(s => s.name === newItem.type);
      await createOrderItem(id, {
        ...newItem,
        unitPrice: selectedService ? selectedService.pricePerM2 : 0
      });
      
      // If status is "Bekliyor", auto-advance to "Alındı"
      if (order.status === 'Bekliyor') {
        await updateOrder(id, { status: 'Alındı' });
      }
      setNewItem({ ...newItem, width: '', length: '', quantity: '1' });
      await fetchOrder();
    } catch (err) {
      alert('Ürün eklenirken hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setUpdating(true);
    setCouponError('');
    try {
      const res = await verifyCoupon(couponInput);
      const coupon = res.data;
      await updateOrder(id, { couponId: coupon.id });
      setCouponInput('');
      await fetchOrder();
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Kupon bulunamadı.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectCampaign = async (campaignId) => {
    setUpdating(true);
    try {
      await updateOrder(id, { campaignId: campaignId === order.campaignId ? null : campaignId });
      await fetchOrder();
    } catch (err) {
      alert('Kampanya uygulanırken hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  // --- CALCULATION LOGIC ---

  const subtotal = order?.OrderItems?.reduce((acc, item) => {
    // Falls back to a default if unitPrice is somehow missing (for legacy items)
    const price = item.unitPrice || 45; 
    return acc + (item.squareMeters * price);
  }, 0) || 0;

  // Highest discount wins logic
  const campaignDiscountRate = order?.Campaign?.discountPercentage || 0;
  const couponDiscountRate = order?.Coupon?.discountPercentage || 0;
  const bestDiscountRate = Math.max(campaignDiscountRate, couponDiscountRate);
  
  const discountAmount = (subtotal * bestDiscountRate) / 100;
  const finalTotal = subtotal - discountAmount;

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest mt-20">Veriler Yükleniyor...</div>;
  if (!order) return <div className="p-8 text-center text-red-500 font-black">Sipariş Bulunamadı.</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold uppercase text-xs transition-colors">
          <ArrowLeftIcon className="w-5 h-5"/> Liste Görünümü
        </button>
        <div className="flex gap-3 no-print">
          <button onClick={() => window.print()} className="bg-slate-900 border border-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black hover:bg-slate-800 shadow-xl shadow-slate-200 flex items-center gap-2 transition-all uppercase tracking-widest">
            <PrinterIcon className="w-5 h-5"/> Fişi Yazdır (Profesyonel)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Management Panel */}
        <div className="lg:col-span-1 space-y-6 no-print">
          {/* Status Control Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <ArrowPathIcon className={`w-5 h-5 text-blue-600 ${updating ? 'animate-spin' : ''}`} />
              İşlem Aşaması
            </h3>
            <div className="space-y-1.5">
              {STATUS_STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => handleStatusUpdate(stage)}
                  disabled={updating}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-black border transition-all flex justify-between items-center uppercase ${
                    order.status === stage
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  {stage}
                  {order.status === stage && <CheckCircleIcon className="w-4 h-4 shadow-sm" />}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Item Entry Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 border-t-4 border-t-emerald-500">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <PlusIcon className="w-5 h-5 text-emerald-600" />
              Ürün Ekle
            </h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Cinsi</label>
                <select 
                  value={newItem.type} 
                  onChange={e => setNewItem({...newItem, type: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {services.map(s => <option key={s.id} value={s.name}>{s.name} (₺{s.pricePerM2})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">En (m)</label>
                  <input 
                    type="number" step="0.01" required
                    value={newItem.width} 
                    onChange={e => setNewItem({...newItem, width: e.target.value})}
                    placeholder="2.5"
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Boy (m)</label>
                  <input 
                    type="number" step="0.01" required
                    value={newItem.length} 
                    onChange={e => setNewItem({...newItem, length: e.target.value})}
                    placeholder="3.0"
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={updating}
                className="w-full py-3 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition uppercase tracking-widest disabled:opacity-50"
              >
                {updating ? 'Ekleniyor...' : 'Siparişe Dahil Et'}
              </button>
            </form>
          </div>

          {/* Discount & Campaigns Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 border-t-4 border-t-purple-500">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <TicketIcon className="w-5 h-5 text-purple-600" />
              İndirim \u0026 Kampanya
            </h3>
            
            {/* Coupon Application */}
            <div className="mb-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">İndirim Kodu (Kupon)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="KODU GİR"
                  className="flex-1 p-2.5 bg-purple-50 border border-purple-100 rounded-xl text-xs font-black tracking-widest text-purple-700 focus:ring-2 focus:ring-purple-400 outline-none uppercase"
                />
                <button 
                  onClick={handleApplyCoupon}
                  disabled={updating || !couponInput}
                  className="bg-purple-600 text-white px-4 rounded-xl text-[10px] font-black uppercase hover:bg-purple-700 disabled:opacity-50"
                >
                  Uygula
                </button>
              </div>
              {couponError && <p className="text-[10px] text-red-500 mt-1 font-bold">{couponError}</p>}
              {order.Coupon && (
                <div className="mt-2 flex items-center justify-between p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <span className="text-[10px] font-black text-emerald-700">KUPON: {order.Coupon.code} (-%{order.Coupon.discountPercentage})</span>
                  <button onClick={() => updateOrder(id, { couponId: null }).then(fetchOrder)} className="text-emerald-700 hover:text-red-500"><XMarkIcon className="w-3 h-3"/></button>
                </div>
              )}
            </div>

            {/* Active Campaigns */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Aktif Kampanyalar</label>
              <div className="space-y-2">
                {activeCampaigns.map(camp => (
                  <button 
                    key={camp.id}
                    onClick={() => handleSelectCampaign(camp.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                      order.campaignId === camp.id 
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase leading-none">{camp.name}</p>
                      <span className={`text-[10px] font-black ${order.campaignId === camp.id ? 'text-white' : 'text-purple-600'}`}>%{camp.discountPercentage}</span>
                    </div>
                  </button>
                ))}
                {activeCampaigns.length === 0 && <p className="text-[10px] text-slate-400 italic">Şu an aktif kampanya bulunmuyor.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Receipt Display (Print Area) */}
        <div className="lg:col-span-3">
          <div id="receipt-area" className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden sticky top-6">
            {/* Receipt Header */}
            <div className="bg-slate-900 text-white p-10 flex justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-900/50">C</div>
                  <h1 className="text-4xl font-black tracking-tighter">CleanAqua</h1>
                </div>
                <p className="text-blue-400 text-[10px] font-black tracking-[0.4em] uppercase opacity-70">Profesyonel Endüstriyel Temizleme</p>
              </div>
              <div className="text-right relative z-10">
                <h2 className="text-xs font-black opacity-40 mb-1 uppercase tracking-widest">SİPARİŞ DÖKÜMÜ</h2>
                <p className="text-4xl font-black text-blue-500 tracking-tighter">ORD-{order.id.toString().padStart(5, '0')}</p>
                <p className="text-slate-500 text-xs mt-1 font-bold">{new Date(order.createdAt).toLocaleDateString('tr-TR')} • {new Date(order.createdAt).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}</p>
              </div>
            </div>

            {/* Status & Alerts */}
            <div className="px-10 py-5 bg-blue-50 border-b border-blue-100 flex justify-between items-center no-print">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Süreci Takip Et</span>
               </div>
               <span className="px-5 py-2 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-blue-200 uppercase tracking-widest">
                 {order.status}
               </span>
            </div>

            {/* Customer & Info Grid */}
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-slate-50">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Teslimat Adresi \u0026 İletişim</h3>
                <p className="font-black text-slate-900 text-3xl mb-2">{order.Customer?.firstName} {order.Customer?.lastName}</p>
                <div className="space-y-2 mt-4">
                  <p className="text-slate-900 text-xl font-black flex items-center gap-2">
                    <span className="text-blue-500"><HashtagIcon className="w-5 h-5"/></span>
                    {order.Customer?.phone}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed font-bold italic">
                    {order.Customer?.address} <br/> 
                    <span className="font-black text-slate-800 not-italic uppercase tracking-wider">{order.Customer?.district} / İSTANBUL</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end md:justify-center">
                 <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <QrCodeIcon className="w-20 h-20 text-slate-900" />
                 </div>
                 <p className="text-[10px] text-slate-400 font-black mt-3 uppercase tracking-widest opacity-50">SİPARİŞ DOĞRULAMA KODU</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="px-10 py-12">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 rounded-md">Ürün Döküm Listesi</h3>
                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{order.OrderItems?.length || 0} PARÇA ÜRÜN</span>
              </div>
              
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-4 border-slate-900">
                    <th className="pb-5 text-left text-[10px] font-black text-slate-900 uppercase tracking-widest">Hizmet \u0026 Barkod</th>
                    <th className="pb-5 text-left text-[10px] font-black text-slate-900 uppercase tracking-widest">Metraj / Ölçü</th>
                    <th className="pb-5 text-right text-[10px] font-black text-slate-900 uppercase tracking-widest">Birim Fiyat</th>
                    <th className="pb-5 text-right text-[10px] font-black text-slate-900 uppercase tracking-widest">Toplam Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.OrderItems && order.OrderItems.length > 0 ? (
                    order.OrderItems.map(item => (
                      <tr key={item.id} className="group transition-colors hover:bg-slate-50/50">
                        <td className="py-6">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-900 border border-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                               <TagIcon className="w-5 h-5 text-blue-400" />
                             </div>
                             <div>
                               <p className="text-base font-black text-slate-900 uppercase tracking-tight">{item.type}</p>
                               <p className="text-[10px] font-mono text-blue-600 font-black uppercase">{item.barcode}</p>
                             </div>
                           </div>
                        </td>
                        <td className="py-6">
                          <p className="text-sm font-black text-slate-900">{item.width} x {item.length}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.squareMeters} M²</p>
                        </td>
                        <td className="py-6 text-right">
                          <p className="text-sm font-black text-slate-400 tabular-nums line-through decoration-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">₺{(item.unitPrice * 1.2).toFixed(2)}</p>
                          <p className="text-sm font-black text-slate-900 tabular-nums">₺{item.unitPrice} <span className="text-[9px] text-slate-400 uppercase">/m²</span></p>
                        </td>
                        <td className="py-6 text-right font-black text-slate-900 text-base tabular-nums">
                          ₺{(item.squareMeters * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 transition-transform hover:scale-110">
                          <ShoppingBagIcon className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-sm text-slate-400 font-black uppercase tracking-widest">Liste henüz boş</p>
                        <p className="text-[10px] text-slate-300 uppercase mt-2 max-w-xs mx-auto font-bold">Müşteri ürünleri tesisimize ulaştığında döküm buraya eklenecektir.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations & Summary */}
            <div className="border-t border-slate-50 bg-slate-50/30 p-10">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                  <div className="flex-1 space-y-4">
                     <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mt-1 no-print">
                           <CheckCircleIcon className="w-3 h-3 text-white" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Teslimat Koşulları</p>
                           <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-sm">
                             Halılarınız endüstriyel vakum ve dezenfekte aşamalarından geçmiştir. 24 saat içerisinde poşetlerinden çıkarmanız önerilir.
                           </p>
                        </div>
                     </div>
                     {bestDiscountRate > 0 && (
                        <div className="bg-purple-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block shadow-lg shadow-purple-200 animate-pulse">
                          %{bestDiscountRate} ÖZEL İNDİRİM UYGULANDI
                        </div>
                     )}
                  </div>
                  
                  <div className="w-full md:w-80 space-y-3">
                     <div className="flex justify-between items-center text-slate-400">
                        <p className="text-[10px] font-black uppercase tracking-widest">Ara Toplam</p>
                        <p className="text-sm font-black tabular-nums">₺{subtotal.toFixed(2)}</p>
                     </div>
                     {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-emerald-600">
                           <p className="text-[10px] font-black uppercase tracking-widest">İndirim ({bestDiscountRate}%)</p>
                           <p className="text-sm font-black tabular-nums">-₺{discountAmount.toFixed(2)}</p>
                        </div>
                     )}
                     <div className="flex justify-between items-center text-slate-900 pt-3 border-t-2 border-slate-200">
                        <div>
                           <p className="text-[11px] font-black uppercase tracking-widest">GeneL ToPLam</p>
                           <p className="text-[9px] text-slate-400 font-bold tracking-tighter">TÜM KDV VE MASRAFLAR DAHİL</p>
                        </div>
                        <p className="text-5xl font-black tabular-nums tracking-tighter text-slate-900">₺{finalTotal.toFixed(2)}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-900 text-white px-10 py-6 flex justify-between items-center">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30">CLEAN AQUA INDUSTRIAL SYSTEM v4.2</p>
              <div className="flex gap-4 opacity-50">
                 <div className="w-1 h-1 bg-white rounded-full"></div>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          body * { visibility: hidden; }
          #receipt-area, #receipt-area * { visibility: visible; }
          #receipt-area { 
            position: absolute; 
            left: 0; 
            top: 10px; 
            width: 100%; 
            box-shadow: none !important; 
            border: none !important; 
            border-radius: 0 !important;
          }
          .no-print { display: none !important; }
        }
      `}} />
    </div>
  );
}

