import React, { useState, useEffect } from 'react';
import { getCustomers } from '../api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Müşteri Veritabanı</h1>
        <div className="flex gap-4 items-center w-1/2 justify-end">
          <div className="relative w-full max-w-sm">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-400"/>
            <input type="text" placeholder="İsim veya telefonla ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button onClick={fetchCustomers} className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap">Yenile</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="p-6 text-center text-slate-500">Yükleniyor...</p>
        ) : customers.length === 0 ? (
          <p className="p-6 text-center text-slate-500">Henüz müşteri bulunmuyor.</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Müşteri Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Bölge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Açık Adres</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {customers.filter(c => (c.firstName + ' ' + c.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm)).map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{c.firstName} {c.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{c.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{c.district || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-sm"><p className="truncate">{c.address}</p></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
