import { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Plus, FileText, BarChart3, Menu, X, Bell, Search, LogOut, Settings, User, Camera, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { authApi } from '../../api';

interface MainLayoutProps {
    children: React.ReactNode;
    currentView: string;
    setCurrentView: (view: any) => void;
}

export default function MainLayout({ children, currentView, setCurrentView }: MainLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, clearUser } = useStore();

    useEffect(() => {
        // Force dark mode
        document.documentElement.classList.add('dark');

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            clearUser();
        } catch (error) {
            console.error('Logout failed', error);
            clearUser();
        }
    };

    const navigation = [
        { id: 'dashboard', label: 'THỐNG KÊ', icon: LayoutDashboard },
        { id: 'calendar', label: 'LỊCH THUÊ', icon: Calendar },
        { id: 'create', label: 'TẠO ĐƠN', icon: Plus },
        { id: 'orders', label: 'ĐƠN HÀNG', icon: FileText },
        { id: 'equipments', label: 'THIẾT BỊ', icon: Camera },
        { id: 'customers', label: 'KHÁCH HÀNG', icon: Users },
        { id: 'reports', label: 'BÁO CÁO', icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-blue-500/30">

            {/* Sidebar Desktop */}
            <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block bg-[#1E293B] border-r border-slate-800 transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'w-24' : 'w-80'}`}>
                <div className="flex h-full flex-col relative">

                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="absolute -right-4 top-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-[#0F172A] hover:scale-110 transition-all z-50 shadow-xl"
                    >
                        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>

                    <div className={`flex h-24 items-center gap-4 px-8 border-b border-slate-800 overflow-hidden ${sidebarCollapsed ? 'justify-center px-0' : ''}`}>
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-[22px] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/30 font-black text-white text-2xl">C</div>
                        {!sidebarCollapsed && (
                            <div className="animate-in fade-in duration-500">
                                <h1 className="text-xl font-black tracking-tight text-white uppercase">Camrent Pro</h1>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 opacity-70">MASTER CONTROL</p>
                            </div>
                        )}
                    </div>

                    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id)}
                                    className={`w-full group flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all duration-500 relative ${isActive
                                        ? 'bg-[#2563EB] text-white shadow-xl shadow-blue-500/20 translate-x-1'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                        } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                                >
                                    <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    {!sidebarCollapsed && <span className="text-[11px] uppercase tracking-[0.1em] animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>}
                                    {isActive && !sidebarCollapsed && <div className="ml-auto w-1 h-3 bg-white/40 rounded-full" />}

                                    {/* Tooltip for collapsed state */}
                                    {sidebarCollapsed && (
                                        <div className="absolute left-full ml-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-700 pointer-events-none whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className={`p-6 mt-auto ${sidebarCollapsed ? 'px-4' : ''}`}>
                        <div className="bg-slate-800/40 rounded-[32px] p-4 border border-slate-800 group hover:shadow-xl transition-all duration-500 overflow-hidden text-center">
                            <div className={`flex items-center gap-4 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                                <div className="relative flex-shrink-0">
                                    <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563EB&color=fff`} className="w-12 h-12 rounded-2xl shadow-lg border-2 border-slate-700 group-hover:scale-105 transition-transform duration-500" alt="User" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-800 rounded-full" />
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="flex-1 min-w-0 text-left animate-in fade-in duration-300">
                                        <p className="text-sm font-black truncate text-white uppercase">{user?.name}</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">ADMINISTRATOR</p>
                                    </div>
                                )}
                            </div>

                            {!sidebarCollapsed && (
                                <div className="flex gap-2 mt-5 animate-in fade-in duration-500">
                                    <button className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-slate-800 border border-slate-700 transition-all hover:bg-slate-700 active:scale-95">
                                        <Settings className="w-4 h-4 text-slate-400" />
                                    </button>
                                    <button onClick={handleLogout} className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-slate-800 border border-slate-700 transition-all hover:bg-rose-500/10 hover:border-rose-500/20 group active:scale-95">
                                        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                                    </button>
                                </div>
                            )}

                            {sidebarCollapsed && (
                                <button onClick={handleLogout} className="mt-4 w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 transition-all hover:bg-rose-500/10 hover:border-rose-500/20 group mx-auto">
                                    <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`transition-all duration-500 ease-in-out flex flex-col min-h-screen ${sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-80'}`}>
                <header className={`sticky top-0 z-40 px-5 lg:px-12 py-6 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-[#0F172A]/90 backdrop-blur-2xl border-b border-slate-800 shadow-sm' : 'bg-transparent'}`}>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-3.5 rounded-2xl bg-slate-800 shadow-sm border border-slate-700">
                            <Menu className="w-6 h-6 text-white" />
                        </button>
                        <div className="hidden sm:flex items-center gap-5 bg-slate-800/50 border border-slate-700/50 rounded-[28px] px-8 py-4 w-[450px] group focus-within:bg-slate-800 focus-within:shadow-2xl focus-within:shadow-blue-500/5 transition-all">
                            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-blue-500" />
                            <input type="text" placeholder="Tìm kiếm nhanh hệ thống..." className="bg-transparent border-none focus:ring-0 text-[13px] w-full placeholder:text-slate-600 font-black uppercase tracking-tight text-white" />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="relative p-4 rounded-2xl bg-slate-800 shadow-sm border border-slate-800 hover:bg-slate-700 transition-all active:scale-95">
                            <Bell className="w-5 h-5 text-slate-400" />
                            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-[3px] border-slate-800 shadow-lg animate-pulse" />
                        </button>
                        <div className="hidden md:flex items-center gap-4 bg-slate-800/80 p-2.5 pr-8 rounded-[28px] border border-slate-700 shadow-sm group hover:border-blue-500/30 transition-all cursor-pointer">
                            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 flex items-center justify-center font-black text-blue-500 group-hover:scale-105 transition-transform">HQ</div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black leading-none uppercase text-white">{user?.name}</span>
                                <span className="text-[10px] font-black text-emerald-500 uppercase mt-1.5 tracking-[0.2em]">TRỰC TUYẾN</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-12">
                    <div className="max-w-[1700px] mx-auto">
                        {children}
                    </div>
                </main>

                {/* Mobile Sidebar Overlay */}
                {mobileSidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-[100] flex">
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setMobileSidebarOpen(false)} />
                        <div className="relative w-85 bg-[#1E293B] shadow-2xl flex flex-col p-10 space-y-10 animate-in slide-in-from-left duration-500 border-r border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[22px] bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20">C</div>
                                    <span className="font-black uppercase tracking-tighter text-white text-xl">CAMRENT PRO</span>
                                </div>
                                <button onClick={() => setMobileSidebarOpen(false)} className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-white"><X className="w-6 h-6" /></button>
                            </div>
                            <nav className="flex-1 space-y-3 overflow-y-auto">
                                {navigation.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setCurrentView(item.id); setMobileSidebarOpen(false); }}
                                        className={`w-full flex items-center gap-5 px-8 py-5 rounded-[24px] font-black text-[13px] uppercase tracking-widest transition-all ${currentView === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 overflow-hidden' : 'text-slate-400 hover:bg-slate-800 text-white'}`}
                                    >
                                        <item.icon className="w-5 h-5" /> {item.label}
                                    </button>
                                ))}
                            </nav>
                            <div className="pt-10 border-t border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563EB&color=fff`} className="w-12 h-12 rounded-2xl" alt="User" />
                                    <span className="font-black uppercase text-white text-xs">{user?.name}</span>
                                </div>
                                <button onClick={handleLogout} className="p-4 bg-slate-800 rounded-2xl border border-slate-700"><LogOut className="w-5 h-5 text-rose-500" /></button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Nav Mobile */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] bg-[#0F172A]/90 backdrop-blur-3xl border-t border-slate-800 p-3 pb-8 shadow-2xl">
                    <div className="flex justify-around items-center h-16">
                        {navigation.slice(0, 5).map((item) => (
                            <button key={item.id} onClick={() => setCurrentView(item.id)} className={`flex flex-col items-center gap-2 transition-all ${currentView === item.id ? 'text-blue-500 scale-110' : 'text-slate-500'}`}>
                                <item.icon className={`w-5 h-5 ${currentView === item.id ? 'stroke-[3]' : 'stroke-[2]'}`} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
}
