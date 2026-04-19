import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { createCustomer, createOrder } from '../api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', address: '', notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create Customer
      const custRes = await createCustomer({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
      });

      // Create Order linked to Customer
      await createOrder({
        customerId: custRes.data.id,
        notes: form.notes,
        totalAmount: 0 // Calculated later
      });

      setSubmitted(true);
    } catch (err) {
      alert("Hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center text-slate-800">
          <CheckCircleIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Talebiniz Alındı!</h2>
          <p className="text-slate-500 mb-6">Müşteri temsilcimiz onay için kısa süre içerisinde sizinle iletişime geçecek. Bizi tercih ettiğiniz için teşekkür ederiz.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition">Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight text-blue-900">
          Clean<span className="text-blue-500">Aqua</span>
        </div>
        <div className="hidden md:flex gap-6 text-slate-600 font-medium text-sm">
          <a href="#hizmetler" className="hover:text-blue-600 transition">Hizmetlerimiz</a>
          <a href="#fiyatlar" className="hover:text-blue-600 transition">Fiyat Listesi</a>
          <a href="#iletisim" className="hover:text-blue-600 transition">İletişim</a>
        </div>
        <button onClick={() => navigate('/admin')} className="text-sm border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium hover:bg-slate-50">
          Yönetici Girişi
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-r from-blue-500 to-transparent blur-3xl transform -rotate-12"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6 border border-blue-500/30">
              Hızlı & Güvenilir Temizlik
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Halılarınız <br/><span className="text-blue-400">İlk Günkü Gibi</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              Profesyonel ekipmanlar, özel şampuanlar ve ücretsiz servis ağımızla kapınızdan alıyor, kapınıza tertemiz teslim ediyoruz.
            </p>
            <div className="flex gap-4">
              <a href="#randevu" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all">
                Hemen Randevu Al
              </a>
              <a href="tel:+905555555555" className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl font-bold text-white transition-all backdrop-blur-sm border border-white/10">
                <PhoneIcon className="w-5 h-5" /> 0555 555 55 55
              </a>
            </div>
          </div>
          
          {/* Order Form Modal Lookalike */}
          <div id="randevu" className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl relative">
            <h3 className="text-2xl font-bold mb-1">Online Sipariş Oluştur</h3>
            <p className="text-sm text-slate-500 mb-8">Bilgileri doldurun, kapınıza gelelim.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Adınız</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                     value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} placeholder="Ahmet" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Soyadınız</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                     value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} placeholder="Yılmaz" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Telefon Numaranız</label>
                <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                     value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0 5XX XXX XX XX" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Açık Adresiniz</label>
                <textarea required rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                     value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Mahalle, sokak, no, ilçe..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Ek Notlar (İsteğe bağlı)</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                     value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Örn: 2 adet makine halısı, lekeli" />
              </div>
              
              <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-slate-800 transition shadow-lg disabled:opacity-70">
                {loading ? 'Gönderiliyor...' : 'Talebi Gönder'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Hizmetler Section */}
      <section id="hizmetler" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Hizmetlerimiz</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-12">Son teknoloji makinelerle her türden halınızı özenle temizliyoruz.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h3 className="text-xl font-bold mb-2 text-slate-800">Makine Halısı Yıkama</h3>
              <p className="text-slate-500 text-sm">Günlük kullanım makinelerine özel, derinlemesine toz alma ve şampuanlama işlemi.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border-b-4 border-blue-500">
              <h3 className="text-xl font-bold mb-2 text-slate-800">Yün & El Dokuma Halı</h3>
              <p className="text-slate-500 text-sm">Hassas dokulara zarar vermeden, özel fırçalarla yapılan ince işçilik temizliği.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h3 className="text-xl font-bold mb-2 text-slate-800">Stor Perde & Battaniye</h3>
              <p className="text-slate-500 text-sm">Sadece halı değil, evinizin büyük tekstil ürünlerini de dezenfekte ediyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fiyatlar Section */}
      <section id="fiyatlar" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Fiyat Listesi</h2>
            <p className="text-slate-500">M² üzerinden yapılan şeffaf fiyatlandırma tablomuz.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-100">
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700">Makine Halısı</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">45 ₺ / m²</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700">Shaggy & Yün Halı</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">65 ₺ / m²</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700">İpek & El Dokuma</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">90 ₺ / m²</td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-700">Stor Perde</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">35 ₺ / m²</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* İletişim Section */}
      <section id="iletisim" className="py-20 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Bize Ulaşın</h2>
          <p className="mb-8 text-blue-100 max-w-lg mx-auto">Her türlü soru, görüş veya kurumsal temizlik anlaşmaları için bizimle iletişime geçebilirsiniz.</p>
          <div className="flex flex-col md:flex-row justify-center gap-6 text-lg font-medium">
            <p className="flex items-center justify-center gap-2">📞 0555 555 55 55</p>
            <p className="flex items-center justify-center gap-2">📍 Merkez Mah. Atatürk Cad. No:1</p>
            <p className="flex items-center justify-center gap-2">✉️ info@cleanaqua.com</p>
          </div>
        </div>
      </section>
      
      {/* Footer Area */}
      <footer className="bg-slate-900 py-12 text-center text-slate-500">
        <p className="font-medium text-slate-300 mb-2">CleanAqua Halı Yıkama © 2026</p>
        <p className="text-sm">Tüm hakları saklıdır. Gelişmiş Halı Yıkama Otomasyonu ile desteklenmektedir.</p>
      </footer>
    </div>
  );
}
