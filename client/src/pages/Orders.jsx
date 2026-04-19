import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getOrders } from '../api';
import { MagnifyingGlassIcon, PrinterIcon } from '@heroicons/react/24/outline';

export default function Orders() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Tüm Siparişler</h1>
        <div className="flex gap-4 items-center w-1/2 justify-end">
          <div className="relative w-full max-w-sm">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-slate-400"/>
            <input type="text" placeholder="Sipariş No veya Müşteri Ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button onClick={fetchOrders} className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap">Yenile</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="p-6 text-center text-slate-500">Yükleniyor...</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-center text-slate-500">Henüz sipariş bulunmuyor.</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Parça Sayısı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Durum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {orders.filter(order => {
                const customerName = order.Customer ? `${order.Customer.firstName} ${order.Customer.lastName}`.toLowerCase() : '';
                const search = searchTerm.toLowerCase();
                return String(order.id).includes(search) || customerName.includes(search);
              }).map(order => {
                let statusColor = '';
                switch (order.status) {
                  case 'Bekliyor': statusColor = 'bg-amber-100 text-amber-800 border-amber-200'; break;
                  case 'Alındı': statusColor = 'bg-indigo-100 text-indigo-800 border-indigo-200'; break;
                  case 'Yıkamada': statusColor = 'bg-blue-100 text-blue-800 border-blue-200'; break;
                  case 'Kurumada': statusColor = 'bg-cyan-100 text-cyan-800 border-cyan-200'; break;
                  case 'Hazır': statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-200'; break;
                  case 'Teslim Edildi': statusColor = 'bg-slate-100 text-slate-800 border-slate-200'; break;
                  default: statusColor = 'bg-blue-100 text-blue-800 border-blue-200';
                }
                
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                      <Link to={`/admin/orders/${order.id}`} className="hover:underline">#{order.id}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                      {order.Customer ? `${order.Customer.firstName} ${order.Customer.lastName}` : 'Bilinmeyen'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <span className="font-bold text-slate-700">{order.OrderItems?.length || 0}</span> Parça
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2 items-center">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${statusColor}`}>
                        {order.status}
                      </span>
                      {order.OrderItems && order.OrderItems.length > 0 && (
                         <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                           Barkodlu
                         </span>
                      )}
                      <button onClick={() => window.print()} className="ml-2 p-1.5 text-slate-400 hover:text-blue-600 no-print transition-colors" title="Fişi Yazdır">
                        <PrinterIcon className="w-4 h-4" />
                      </button>
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="ml-auto text-xs font-black text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all uppercase tracking-wider shadow-sm"
                      >
                        İşle & Detay
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
