import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  ArrowRightOnRectangleIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';

export default function Header() {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if(query.trim()) {
      navigate(`/admin/orders?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm relative z-30">
      <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl">
        <label htmlFor="search" className="sr-only">Ara...</label>
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors group-focus-within:text-blue-500">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full rounded-xl border-0 py-2 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all bg-slate-50/50"
            placeholder="Sipariş no veya müşteri adı yaz ve Enter'a bas..."
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>
      
      <div className="ml-4 flex items-center gap-x-6">
        {/* User Info */}
        <div className="hidden lg:flex items-center gap-3 pr-6 border-r border-slate-200">
           <div className="text-right">
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{user?.name || 'Yönetici'}</p>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{user?.role || 'Admin'}</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <UserCircleIcon className="w-7 h-7" />
           </div>
        </div>

        <div className="flex items-center gap-x-3">
          <button type="button" className="relative p-2 text-slate-400 hover:text-blue-500 rounded-xl hover:bg-blue-50 transition-all group">
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <button 
            onClick={logout}
            title="Çıkış Yap"
            type="button" 
            className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 group"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
