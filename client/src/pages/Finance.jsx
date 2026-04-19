import React, { useState } from 'react';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, XMarkIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Finance() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Gelir', desc: 'Sipariş No #4 Onaylandı', amount: 2500, date: 'Bugün' },
    { id: 2, type: 'Gider', desc: 'Şampuan ve Temizlik Malzemesi Alımı', amount: 8000, date: 'Dün' },
    { id: 3, type: 'Gelir', desc: 'Sipariş No #3 Teslimatı', amount: 1200, date: '16.04.2026' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ type: 'Gelir', desc: '', amount: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const totalGelir = transactions.filter(t => t.type === 'Gelir').reduce((acc, curr) => acc + curr.amount, 0);
  const totalGider = transactions.filter(t => t.type === 'Gider').reduce((acc, curr) => acc + curr.amount, 0);
  const netKasa = totalGelir - totalGider;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setTransactions(transactions.map(t => 
        t.id === editingItem.id 
          ? { ...t, type: form.type, desc: form.desc, amount: Number(form.amount) } 
          : t
      ));
    } else {
      setTransactions([{
        id: Date.now(),
        type: form.type,
        desc: form.desc,
        amount: Number(form.amount),
        date: new Date().toLocaleDateString('tr-TR')
      }, ...transactions]);
    }
    closeModal();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({ type: item.type, desc: item.desc, amount: item.amount });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu finansal işlemi silmek istediğinize emin misiniz?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm({ type: 'Gelir', desc: '', amount: '' });
  };
  return (
    <div className="max-w-6xl mx-auto py-2">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gelir & Gider Raporları</h1>
          <p className="text-slate-500 mt-1">İşletmenizin finansal durumunu detaylı şekilde takip edin.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition">
          + Yeni Fiş / Fatura İşle
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border text-center border-slate-200 p-6 rounded-2xl shadow-sm">
           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <ArrowTrendingUpIcon className="w-6 h-6"/>
           </div>
           <p className="text-slate-500 font-medium text-sm">Bu Ayki Güncel Gelir</p>
           <p className="text-3xl font-bold text-slate-800 mt-2">₺ {totalGelir.toLocaleString()}</p>
        </div>
        <div className="bg-white border text-center border-slate-200 p-6 rounded-2xl shadow-sm">
           <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <ArrowTrendingDownIcon className="w-6 h-6"/>
           </div>
           <p className="text-slate-500 font-medium text-sm">Bu Ayki Güncel Gider</p>
           <p className="text-3xl font-bold text-slate-800 mt-2">₺ {totalGider.toLocaleString()}</p>
        </div>
        <div className="bg-blue-600 text-center border border-blue-600 p-6 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)]">
           <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-4">
             <CurrencyDollarIcon className="w-6 h-6"/>
           </div>
           <p className="text-blue-100 font-medium text-sm">Net Kasa (Kâr)</p>
           <p className="text-3xl font-bold text-white mt-2">₺ {netKasa.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Son İşlem Hareketleri</h2>
          <div className="relative w-full max-w-xs">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400"/>
            <input type="text" placeholder="İşlemlerde ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">İşlem Türü</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Açıklama</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.filter(t => t.desc.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${item.type === 'Gelir' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.desc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.date}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${item.type === 'Gelir' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {item.type === 'Gelir' ? '+' : '-'}₺{item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">{editingItem ? 'İşlemi Düzenle' : 'Kasa İşlemi Kaydet'}</h3>
                <button onClick={closeModal}><XMarkIcon className="w-6 h-6 text-slate-400"/></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">İşlem Türü</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm">
                    <option>Gelir</option>
                    <option>Gider</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tutar (₺)</label>
                  <input required type="number" min="1" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm" placeholder="Örn: 2500" />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Açıklama</label>
                  <input required type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm" placeholder="Örn: Araç bakımı" />
               </div>
               <div className="pt-4 flex gap-3">
                 <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg">İptal</button>
                 <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                   {editingItem ? 'Güncelle' : 'İşlemi Kaydet'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
