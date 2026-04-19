import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ArrowUpRightIcon, 
  ArrowDownRightIcon, 
  ClockIcon, 
  CheckCircleIcon,
  TruckIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { getOrders } from '../api';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = orders.filter(o => o.status === 'Bekliyor').length;
  const washingCount = orders.filter(o => o.status === 'Yıkamada').length;
  const deliveryCount = orders.filter(o => o.status === 'Teslimatta').length;

  // Simple monthly revenue calculation
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = orders
    .filter(o => {
      const d = new Date(o.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  const statsDisplay = [
    { name: 'Bekleyen Siparişler', value: pendingCount.toString(), icon: ClockIcon, change: '+2', changeType: 'positive' },
    { name: 'Yıkamadaki Ürünler', value: washingCount.toString(), icon: CheckCircleIcon, change: '+12%', changeType: 'positive' },
    { name: 'Teslimattaki Siparişler', value: deliveryCount.toString(), icon: TruckIcon, change: 'Aktif durumda', changeType: 'positive' },
    { name: 'Aylık Ciro', value: `₺${monthlyRevenue.toLocaleString()}`, icon: ArrowUpRightIcon, change: '+15.2%', changeType: 'positive' },
  ];

  const recentOrders = orders.slice(0, 5);

  const chartData = [
    { name: 'Pzt', ciro: 4000 },
    { name: 'Sal', ciro: 3000 },
    { name: 'Çar', ciro: 5200 },
    { name: 'Per', ciro: 2800 },
    { name: 'Cum', ciro: 6900 },
    { name: 'Cts', ciro: 8500 },
    { name: 'Paz', ciro: 9100 },
  ];

  return (
    <div>
      <div className="print-header no-print:hidden">
        <h1 className="text-3xl font-bold">CleanAqua Halı Yıkama - Performans Raporu</h1>
        <p className="text-slate-500">Tarih: {new Date().toLocaleDateString('tr-TR')} | Raporu Oluşturan: Yönetici</p>
      </div>

      <div className="flex justify-between items-end mb-8 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gösterge Paneli</h1>
          <p className="mt-1 text-sm text-slate-500">İşletmenizin genel durumunu tek ekrandan takip edin.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Rapor Yazdır
          </button>
          <Link to="/admin/orders/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition-all flex items-center gap-2">
            <span>+</span> Yeni Sipariş
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsDisplay.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
              <span className="ml-2 text-slate-500">geçen aya göre</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-96 transition-all duration-300">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-semibold text-slate-800">Haftalık Ciro Analizi</h2>
           </div>
           <div className="flex-1 w-full h-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCiro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `₺${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₺${value}`, 'Ciro']}
                  />
                  <Area type="monotone" dataKey="ciro" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCiro)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">Son Siparişler</h2>
          <div className="flex gap-4 items-center">
             <div className="relative">
               <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400"/>
               <input type="text" placeholder="Hızlı ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <Link to="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700">Tümünü gör &rarr;</Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sipariş No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Müşteri</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">İçerik</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tarih</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tutar</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Durum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {recentOrders.filter(o => (o.Customer?.firstName + ' ' + o.Customer?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || String(o.id).includes(searchTerm)).map((order) => {
                let statusColor = '';
                switch (order.status) {
                  case 'Bekliyor': statusColor = 'bg-amber-100 text-amber-800 border-amber-200'; break;
                  case 'Alındı': statusColor = 'bg-indigo-100 text-indigo-800 border-indigo-200'; break;
                  case 'Yıkamada': statusColor = 'bg-blue-100 text-blue-800 border-blue-200'; break;
                  case 'Hazır': statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-200'; break;
                  default: statusColor = 'bg-slate-100 text-slate-800 border-slate-200';
                }
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{order.Customer ? `${order.Customer.firstName} ${order.Customer.lastName}` : 'Misafir'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs">{order.notes || 'Halı Yıkama'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">₺{order.totalAmount || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusColor}`}>
                        {order.status}
                      </span>
                      <button onClick={() => window.print()} className="p-1.5 text-slate-400 hover:text-blue-600 no-print" title="Fişi Yazdır">
                        <PrinterIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
