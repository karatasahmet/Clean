import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentCheckIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  TruckIcon,
  CurrencyDollarIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const navGroups = [
  {
    title: 'Ana Operasyon',
    items: [
      { name: 'Dashboard', path: '/admin', icon: HomeIcon },
      { name: 'Siparişler', path: '/admin/orders', icon: ClipboardDocumentCheckIcon },
      { name: 'Müşteriler', path: '/admin/customers', icon: UsersIcon },
      { name: 'Saha Takibi', path: '/admin/fleet', icon: TruckIcon },
    ]
  },
  {
    title: 'Finans & Kontrol',
    items: [
      { name: 'Gelir & Gider', path: '/admin/finance', icon: CurrencyDollarIcon },
      { name: 'Ayarlar & Güvenlik', path: '/admin/settings', icon: Cog6ToothIcon },
    ]
  }
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 shadow-xl transition-all duration-300 relative`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        className="absolute -right-3 top-6 bg-blue-600 rounded-full p-1 shadow-lg border-2 border-slate-900 z-10 hover:bg-blue-500 transition"
      >
        {isCollapsed ? <Bars3Icon className="w-4 h-4"/> : <ChevronLeftIcon className="w-4 h-4"/>}
      </button>

      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <span className={`text-xl font-bold tracking-wider text-blue-400 ${isCollapsed && 'hidden'}`}>
          <span className="text-white">Clean</span>Aqua
        </span>
        {isCollapsed && <span className="text-xl font-bold text-blue-400 mx-auto">CA</span>}
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 overflow-x-hidden">
        <nav className="space-y-6 px-3">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              {!isCollapsed && <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{group.title}</h3>}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-3'} py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                    title={isCollapsed ? item.name : ""}
                  >
                    <item.icon className={`${isCollapsed ? 'mr-0' : 'mr-3'} h-5 w-5 flex-shrink-0`} aria-hidden="true" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-800 shrink-0">
        <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col gap-4' : ''}`}>
          <div className="flex items-center truncate">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-blue-500/20">
              AD
            </div>
            {!isCollapsed && (
              <div className="ml-3 truncate">
                <p className="text-sm font-bold text-white truncate">Administrator</p>
                <p className="text-[11px] text-slate-500 font-medium truncate uppercase tracking-tighter">Süper Yetkili</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className={`${isCollapsed ? 'p-2' : 'p-1.5'} text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors`}
            title="Güvenli Çıkış"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
  );
}
