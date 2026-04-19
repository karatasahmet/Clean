import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, createCustomer, createOrder } from '../api';

export default function NewOrder() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerForm, setCustomerForm] = useState({
    firstName: '', lastName: '', phone: '', address: '', district: ''
  });
  const [orderForm, setOrderForm] = useState({
    notes: '', totalAmount: '', scheduledDate: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let customerId = selectedCustomerId;
      
      // If adding a new customer
      if (isNewCustomer) {
        const customerRes = await createCustomer(customerForm);
        customerId = customerRes.data.id;
      }
      
      if (!customerId) {
        alert("Lütfen bir müşteri seçin veya oluşturun!");
        setLoading(false);
        return;
      }

      // Create Order
      await createOrder({
        customerId,
        notes: orderForm.notes,
        totalAmount: orderForm.totalAmount || 0,
        scheduledDate: orderForm.scheduledDate || null
      });

      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Yeni Sipariş Oluştur</h1>
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 font-medium text-sm">
          &larr; İptal ve Geri Dön
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Müşteri Seçimi / Ekleme */}
          <section>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <h2 className="text-lg font-semibold text-slate-800">Müşteri Bilgileri</h2>
              <button 
                type="button" 
                onClick={() => setIsNewCustomer(!isNewCustomer)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {isNewCustomer ? 'Mevcut Müşteri Seç' : '+ Yeni Müşteri Ekle'}
              </button>
            </div>

            {isNewCustomer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ad *</label>
                  <input required type="text" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" 
                    value={customerForm.firstName} onChange={e => setCustomerForm({...customerForm, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Soyad *</label>
                  <input required type="text" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                    value={customerForm.lastName} onChange={e => setCustomerForm({...customerForm, lastName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefon *</label>
                  <input required type="tel" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                    value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} placeholder="05XX XXX XX XX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bölge/İlçe</label>
                  <input type="text" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                    value={customerForm.district} onChange={e => setCustomerForm({...customerForm, district: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tam Adres *</label>
                  <textarea required rows="2" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                    value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})}></textarea>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kayıtlı Müşteri Seç *</label>
                <select 
                  required={!isNewCustomer}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                >
                  <option value="">-- Müşteri Seçin --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName} - {c.phone}</option>
                  ))}
                </select>
              </div>
            )}
          </section>

          {/* Sipariş Detayları */}
          <section>
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h2 className="text-lg font-semibold text-slate-800">Sipariş / Teslim Alma Detayları</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tahmini Alınacak Tarih</label>
                <input type="datetime-local" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                  value={orderForm.scheduledDate} onChange={e => setOrderForm({...orderForm, scheduledDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ön Tutar (₺) - Opsiyonel</label>
                <input type="number" step="0.01" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                  value={orderForm.totalAmount} onChange={e => setOrderForm({...orderForm, totalAmount: e.target.value})} placeholder="Hesaplanmadı" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Sipariş Notu / İçerik Özeti</label>
                <textarea rows="3" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                  value={orderForm.notes} onChange={e => setOrderForm({...orderForm, notes: e.target.value})} placeholder="Örn: 2 parça makine halısı alınacak, biri lekeli."></textarea>
              </div>
            </div>
          </section>

          <div className="pt-5 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              İptal
            </button>
            <button disabled={loading} type="submit" className="px-5 py-2.5 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-colors disabled:opacity-50">
              {loading ? 'Kaydediliyor...' : 'Siparişi Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
