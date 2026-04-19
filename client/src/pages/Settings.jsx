import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  UserPlusIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  UsersIcon, 
  TagIcon, 
  TicketIcon, 
  PencilSquareIcon, 
  TrashIcon,
  PlusIcon,
  ListBulletIcon,
  KeyIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { 
  getCustomers, updateCustomer, createCustomer,
  getServices, createService, updateService, deleteService,
  getCampaigns, createCampaign, updateCampaign, deleteCampaign,
  getCoupons, createCoupon, updateCoupon, deleteCoupon,
  getLogs,
  getUsers, createUser, updateUser, deleteUser
} from '../api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('roles');
  const [loading, setLoading] = useState(false);
  
  // --- ROLES & USERS ---
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', role: 'Saha Personeli', email: '', phone: '', password: '', status: 'Aktif' });

  // --- CUSTOMERS ---
  const [customers, setCustomers] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({ firstName: '', lastName: '', phone: '', address: '', district: '' });
  const [customerSearch, setCustomerSearch] = useState('');

  // --- SERVICES (PRODUCTS) ---
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', pricePerM2: '', isActive: true });

  // --- CAMPAIGNS & COUPONS ---
  const [campaigns, setCampaigns] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignForm, setCampaignForm] = useState({ name: '', discountPercentage: '', startDate: '', endDate: '', isActive: true, isAutomatic: false });
  
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({ code: '', discountPercentage: '', usageLimit: '', expiryDate: '', isActive: true });

  // --- LOGS ---
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (activeTab === 'roles') fetchUsers();
    if (activeTab === 'customers') fetchCustomers();
    if (activeTab === 'services') fetchServices();
    if (activeTab === 'campaigns') {
      fetchCampaigns();
      fetchCoupons();
    }
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await getCampaigns();
      setCampaigns(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCoupons = async () => {
    try {
      const res = await getCoupons();
      setCoupons(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchLogs = async () => {
    if (activeTab !== 'logs') return;
    setLoading(true);
    try {
      const res = await getLogs();
      setLogs(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // --- HANDLERS ---

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      const { id, createdAt, updatedAt, lastLogin, ...sanitizedData } = userForm;
      if (editingUser) {
        await updateUser(editingUser.id, sanitizedData);
      } else {
        await createUser(sanitizedData);
      }
      setShowUserModal(false);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Bilinmeyen bir hata oluştu';
      alert('Hata: ' + msg); 
    }
  };

  const handleDeleteUser = async (id) => {
    if(window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) { alert('Hata: ' + (err.response?.data?.error || err.message)); }
    }
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    try {
      const { id, createdAt, updatedAt, ...sanitizedData } = customerForm;
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, sanitizedData);
      } else {
        await createCustomer(sanitizedData);
      }
      setShowCustomerModal(false);
      fetchCustomers();
    } catch (err) { 
      const msg = err.response?.data?.error || err.message || 'Bilinmeyen bir hata oluştu';
      alert('Hata: ' + msg); 
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const { id, createdAt, updatedAt, ...sanitizedData } = serviceForm;
      if (editingService) {
        await updateService(editingService.id, sanitizedData);
      } else {
        await createService(sanitizedData);
      }
      setShowServiceModal(false);
      fetchServices();
    } catch (err) { 
      const msg = err.response?.data?.error || err.message || 'Bilinmeyen bir hata oluştu';
      alert('Hata: ' + msg); 
    }
  };

  const handleDeleteService = async (id) => {
    if(window.confirm('Bu hizmet türünü silmek istediğinize emin misiniz?')) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (err) { alert('Silme hatası: ' + (err.response?.data?.error || err.message)); }
    }
  };

  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    try {
      const { id, createdAt, updatedAt, ...sanitizedData } = campaignForm;
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, sanitizedData);
      } else {
        await createCampaign(sanitizedData);
      }
      setShowCampaignModal(false);
      fetchCampaigns();
    } catch (err) { 
      const msg = err.response?.data?.error || err.message || 'Bilinmeyen bir hata oluştu';
      alert('Hata: ' + msg); 
    }
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    try {
      const { id, createdAt, updatedAt, usedCount, ...sanitizedData } = couponForm;
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, sanitizedData);
      } else {
        await createCoupon(sanitizedData);
      }
      setShowCouponModal(false);
      fetchCoupons();
    } catch (err) { 
      const msg = err.response?.data?.error || err.message || 'Bilinmeyen bir hata oluştu';
      alert('Hata: ' + msg); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-2 px-4 animate-in fade-in duration-500">
      <div className="mb-8 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Yönetim Paneli</h1>
        <nav className="-mb-px flex space-x-6 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: 'roles', name: 'Kullanıcılar', icon: ShieldCheckIcon },
            { id: 'customers', name: 'Müşteriler', icon: UsersIcon },
            { id: 'services', name: 'Hizmetler \u0026 Fiyatlar', icon: TagIcon },
            { id: 'campaigns', name: 'Kampanya \u0026 Kupon', icon: TicketIcon },
            { id: 'logs', name: 'Aktivite Günlüğü', icon: ListBulletIcon },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition-all ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4"/>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {loading && activeTab !== 'logs' && <p className="text-center py-10 text-slate-500 font-medium">Veriler yükleniyor...</p>}

      {/* --- USERS TAB --- */}
      {activeTab === 'roles' && !loading && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Personel Yönetimi</h2>
            <button onClick={() => { setEditingUser(null); setUserForm({ name: '', role: 'Saha Personeli', email: '', phone: '', password: '', status: 'Aktif' }); setShowUserModal(true); }} 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition">
              <UserPlusIcon className="w-4 h-4"/> Yeni Personel / Rol Ekle
            </button>
          </div>
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-white">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Kullanıcı</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Yetki</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">E-posta / Telefon</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 text-[10px] font-black rounded-lg border uppercase ${
                       u.role === 'Süper Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                     }`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    <p>{u.email}</p>
                    <p className="text-xs text-slate-400">{u.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => { setEditingUser(u); setUserForm({...u, password: ''}); setShowUserModal(true); }} className="p-2 text-slate-400 hover:text-blue-600">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-600">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- CUSTOMERS TAB --- */}
      {activeTab === 'customers' && !loading && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="relative w-72">
               <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400"/>
               <input type="text" placeholder="Müşteri ara..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <button onClick={() => { setEditingCustomer(null); setCustomerForm({ firstName: '', lastName: '', phone: '', address: '', district: '' }); setShowCustomerModal(true); }} 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition">
              <PlusIcon className="w-4 h-4"/> Yeni Müşteri
            </button>
          </div>
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-white">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">İletişim</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Bölge / Adres</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{c.firstName} {c.lastName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{c.phone}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{c.district || '-'}</p>
                    <p className="text-xs text-slate-400 truncate max-w-xs">{c.address}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditingCustomer(c); setCustomerForm(c); setShowCustomerModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- SERVICES TAB --- */}
      {activeTab === 'services' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Hizmet \u0026 Fiyat Listesi</h2>
            <button onClick={() => { setEditingService(null); setServiceForm({ name: '', pricePerM2: '', isActive: true }); setShowServiceModal(true); }} 
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <PlusIcon className="w-4 h-4"/> Yeni Hizmet Ekle
            </button>
          </div>
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-white">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Hizmet Adı</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Birim Fiyat (M²)</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{s.name}</td>
                  <td className="px-6 py-4 text-sm font-black text-blue-600">₺{s.pricePerM2}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                       {s.isActive ? 'Aktif' : 'Pasif'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => { setEditingService(s); setServiceForm(s); setShowServiceModal(true); }} className="p-2 text-slate-400 hover:text-blue-600">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteService(s.id)} className="p-2 text-slate-400 hover:text-red-600">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- CAMPAIGNS TAB --- */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
           {/* Campaigns Section */}
           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-fit">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Genel Kampanyalar</h2>
                <button onClick={() => { setEditingCampaign(null); setCampaignForm({ name: '', discountPercentage: '', startDate: '', endDate: '', isActive: true, isAutomatic: false }); setShowCampaignModal(true); }} 
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg shadow-sm hover:scale-110 transition-transform"><PlusIcon className="w-5 h-5"/></button>
              </div>
              <div className="divide-y divide-slate-50">
                {campaigns.map(c => (
                  <div key={c.id} className="p-4 hover:bg-slate-50 transition flex justify-between items-center group">
                    <div>
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500 font-medium">%{c.discountPercentage} İndirim • {c.startDate ? new Date(c.startDate).toLocaleDateString('tr-TR') : 'Süresiz'} - {c.endDate ? new Date(c.endDate).toLocaleDateString('tr-TR') : 'Süresiz'}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingCampaign(c); setCampaignForm({...c, startDate: c.startDate?.split('T')[0], endDate: c.endDate?.split('T')[0]}); setShowCampaignModal(true); }} className="text-blue-600"><PencilSquareIcon className="w-4 h-4"/></button>
                      <button onClick={async () => { if(window.confirm('Kampanyayı sil?')) { try{ await deleteCampaign(c.id); fetchCampaigns(); } catch(err){ alert('Hata: ' + (err.response?.data?.error || err.message)); } } }} className="text-red-500"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Coupons Section */}
           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-fit">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">İndirim Kodları (Kuponlar)</h2>
                <button onClick={() => { setEditingCoupon(null); setCouponForm({ code: '', discountPercentage: '', usageLimit: '', expiryDate: '', isActive: true }); setShowCouponModal(true); }} 
                  className="p-2 bg-purple-100 text-purple-600 rounded-lg shadow-sm hover:scale-110 transition-transform"><PlusIcon className="w-5 h-5"/></button>
              </div>
              <div className="divide-y divide-slate-50">
                {coupons.map(cp => (
                  <div key={cp.id} className="p-4 hover:bg-slate-50 transition flex justify-between items-center group">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-purple-600 tracking-wider text-sm bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{cp.code}</span>
                        <span className="text-xs font-black text-slate-800">-%{cp.discountPercentage}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">
                        Kullanım: {cp.usedCount} / {cp.usageLimit || 'Sınırsız'} • SKT: {cp.expiryDate ? new Date(cp.expiryDate).toLocaleDateString('tr-TR') : 'Yok'}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingCoupon(cp); setCouponForm({...cp, expiryDate: cp.expiryDate?.split('T')[0]}); setShowCouponModal(true); }} className="text-blue-600"><PencilSquareIcon className="w-4 h-4"/></button>
                      <button onClick={async () => { if(window.confirm('Kuponu sil?')) { try{ await deleteCoupon(cp.id); fetchCoupons(); } catch(err){ alert('Hata: ' + (err.response?.data?.error || err.message)); } } }} className="text-red-500"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}

      {/* --- LOGS TAB --- */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Sistem Aktivite Günlüğü</h2>
              <p className="text-xs text-slate-400 font-medium">Son 100 işlem aşağıda listelenmektedir.</p>
            </div>
            <button onClick={fetchLogs} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-white">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarih</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Kullanıcı</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">İşlem</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Açıklama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length > 0 ? logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-slate-500 tabular-nums">
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                      {log.userName || 'Sistem'}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                         log.actionType.includes('LOGIN') ? 'bg-blue-100 text-blue-700' :
                         log.actionType.includes('CREATE') ? 'bg-emerald-100 text-emerald-700' :
                         log.actionType.includes('UPDATE') ? 'bg-amber-100 text-amber-700' :
                         log.actionType.includes('DELETE') ? 'bg-red-100 text-red-700' :
                         'bg-slate-100 text-slate-500'
                       }`}>
                         {log.actionType}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      {log.description}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-sm font-medium">Henüz bir aktivite kaydı bulunmuyor.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}
      
      {/* User (Personnel) Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-6">{editingUser ? 'Personel Düzenle' : 'Yeni Personel Ekle'}</h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Ad Soyad</label>
                  <div className="relative">
                    <ShieldCheckIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
                    <input required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm font-bold"/>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">E-posta</label>
                    <div className="relative">
                      <EnvelopeIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
                      <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Telefon</label>
                    <div className="relative">
                      <PhoneIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
                      <input value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm"/>
                    </div>
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Yetki / Rol</label>
                  <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold uppercase tracking-widest">
                    <option value="Saha Personeli">Saha Personeli</option>
                    <option value="Tesis Görevlisi">Tesis Görevlisi</option>
                    <option value="Süper Admin">Süper Admin</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
                    {editingUser ? 'Yeni Şifre (Değişmeyecekse boş bırakın)' : 'Şifre'}
                  </label>
                  <div className="relative">
                    <KeyIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
                    <input required={!editingUser} type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm"/>
                  </div>
               </div>
               <div className="pt-4 flex gap-4">
                 <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 py-3 text-slate-400 font-bold text-sm">İptal</button>
                 <button type="submit" className="flex-1 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition">Kaydet</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-6">{editingCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri Kaydı'}</h3>
            <form onSubmit={handleSaveCustomer} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Adı</label>
                    <input required value={customerForm.firstName} onChange={e => setCustomerForm({...customerForm, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Soyadı</label>
                    <input required value={customerForm.lastName} onChange={e => setCustomerForm({...customerForm, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Telefon</label>
                  <input required value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Bölge / Mahalle</label>
                  <input value={customerForm.district} onChange={e => setCustomerForm({...customerForm, district: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Açık Adres</label>
                  <textarea rows="3" value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"></textarea>
               </div>
               <div className="pt-4 flex gap-4">
                 <button type="button" onClick={() => setShowCustomerModal(false)} className="flex-1 py-3 text-slate-400 font-bold text-sm">İptal</button>
                 <button type="submit" className="flex-1 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition">Kaydet</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-6">{editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Tanımla'}</h3>
            <form onSubmit={handleSaveService} className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Hizmet Adı (Örn: Makine Halısı)</label>
                  <input required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Birim Fiyat (M² / Adet)</label>
                  <input required type="number" step="0.01" value={serviceForm.pricePerM2} onChange={e => setServiceForm({...serviceForm, pricePerM2: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
               </div>
               <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" checked={serviceForm.isActive} onChange={e => setServiceForm({...serviceForm, isActive: e.target.checked})} className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                  <span className="text-sm font-bold text-slate-700">Hizmet Aktif</span>
               </div>
               <div className="pt-4 flex gap-4">
                 <button type="button" onClick={() => setShowServiceModal(false)} className="flex-1 py-3 text-slate-400 font-bold text-sm">İptal</button>
                 <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition">Kaydet</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-6">Kampanya Detayları</h3>
            <form onSubmit={handleSaveCampaign} className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Kampanya İsmi</label>
                  <input required value={campaignForm.name} onChange={e => setCampaignForm({...campaignForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm"/>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">İndirim Oranı (%)</label>
                  <input required type="number" value={campaignForm.discountPercentage} onChange={e => setCampaignForm({...campaignForm, discountPercentage: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-black"/>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Başlangıç</label>
                    <input type="date" value={campaignForm.startDate} onChange={e => setCampaignForm({...campaignForm, startDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Bitiş</label>
                    <input type="date" value={campaignForm.endDate} onChange={e => setCampaignForm({...campaignForm, endDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm"/>
                  </div>
               </div>
               <div className="pt-4 flex gap-4">
                 <button type="button" onClick={() => setShowCampaignModal(false)} className="flex-1 py-3 text-slate-400 font-bold text-sm">İptal</button>
                 <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition">Kaydet</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-6">İndirim Kodu Üret</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Kupon Kodu (Örn: BAHAR20)</label>
                  <input required placeholder="Örn: BAYRAM15" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} className="w-full bg-purple-50 border border-purple-100 text-purple-700 font-black tracking-widest rounded-xl p-4 text-center text-lg uppercase outline-none focus:ring-4 focus:ring-purple-200 transition-all"/>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">İndirim Oranı (%)</label>
                  <input required type="number" value={couponForm.discountPercentage} onChange={e => setCouponForm({...couponForm, discountPercentage: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-black"/>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Kullanım Limiti</label>
                    <input type="number" placeholder="Sınırsız" value={couponForm.usageLimit} onChange={e => setCouponForm({...couponForm, usageLimit: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Son Tarih</label>
                    <input type="date" value={couponForm.expiryDate} onChange={e => setCouponForm({...couponForm, expiryDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm"/>
                  </div>
               </div>
               <div className="pt-4 flex gap-4">
                 <button type="button" onClick={() => setShowCouponModal(false)} className="flex-1 py-3 text-slate-400 font-bold text-sm">İptal</button>
                 <button type="submit" className="flex-1 py-3 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-200 hover:bg-purple-700 transition">Kuponu Kaydet</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
