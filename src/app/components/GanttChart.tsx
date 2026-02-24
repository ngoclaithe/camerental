import { useState, useEffect } from 'react';
import { GanttChartSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { calendarApi } from '../../api';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/vi';

dayjs.extend(isBetween);
dayjs.locale('vi');

export default function GanttChart() {
    const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
    const [calendarData, setCalendarData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const start = currentMonth.startOf('month').toISOString();
                const end = currentMonth.endOf('month').toISOString();

                const data = await calendarApi.get(start, end);
                setCalendarData(data);
            } catch (error) {
                console.error('Failed to fetch calendar data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentMonth]);

    const daysInMonth = currentMonth.daysInMonth();
    const days = Array.from({ length: daysInMonth }, (_, i) => currentMonth.date(i + 1));

    const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
    const nextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));
    const today = () => setCurrentMonth(dayjs().startOf('month'));

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RENTING': return 'bg-blue-500 border-blue-600 shadow-blue-500/50';
            case 'PENDING': return 'bg-amber-500 border-amber-600 shadow-amber-500/50';
            case 'CONFIRMED': return 'bg-indigo-500 border-indigo-600 shadow-indigo-500/50';
            case 'LATE': return 'bg-rose-500 border-rose-600 shadow-rose-500/50';
            case 'COMPLETED': return 'bg-emerald-500 border-emerald-600 shadow-emerald-500/50';
            default: return 'bg-slate-500 border-slate-600 shadow-slate-500/50';
        }
    };

    if (loading && calendarData.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">ĐANG TẢI BIỂU ĐỒ GANTT...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">BIỂU ĐỒ GANTT</h2>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4 opacity-70">Tổng quan lịch sử dụng thiết bị (Theo tháng)</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-[22px] border border-slate-100 dark:border-slate-700 shadow-sm w-fit">
                    <button onClick={prevMonth} className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-xl hover:bg-blue-500 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5 stroke-[3]" />
                    </button>
                    <div className="px-6 text-center">
                        <span className="text-[13px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                            THÁNG {currentMonth.format('MM/YYYY')}
                        </span>
                    </div>
                    <button onClick={today} className="text-[10px] font-black uppercase text-blue-600 tracking-widest px-4 hover:underline">HIỆN TẠI</button>
                    <button onClick={nextMonth} className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-xl hover:bg-blue-500 hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5 stroke-[3]" />
                    </button>
                </div>
            </div>

            {/* Gantt Chart Content */}
            <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm p-8 overflow-hidden">
                <div className="overflow-x-auto hide-scrollbar border border-slate-100 dark:border-slate-700 rounded-3xl pb-2">
                    <div className="min-w-max relative">
                        {/* Header Row (Days) */}
                        <div className="flex border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md z-20">
                            <div className="w-[300px] flex-shrink-0 p-6 border-r border-slate-100 dark:border-slate-700 flex items-center bg-white dark:bg-slate-800 sticky left-0 z-30">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">THIẾT BỊ</span>
                            </div>
                            <div className="flex flex-1">
                                {days.map((day) => {
                                    const isToday = day.isSame(dayjs(), 'day');
                                    return (
                                        <div key={day.toISOString()} className={`flex-1 min-w-[48px] p-4 border-r border-slate-100/50 dark:border-slate-700/50 flex flex-col items-center justify-center ${isToday ? 'bg-blue-50/50 dark:bg-blue-500/10' : ''}`}>
                                            <span className={`text-[10px] font-black uppercase ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{day.format('dd').charAt(0)}</span>
                                            <span className={`text-sm font-black mt-1 ${isToday ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}>{day.format('D')}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rows (Equipments) */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {calendarData.map((equipment) => (
                                <div key={equipment.equipmentId} className="flex group hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                    <div className="w-[300px] flex-shrink-0 p-6 border-r border-slate-100 dark:border-slate-700 flex flex-col justify-center bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors sticky left-0 z-10 shadow-[10px_0_15px_-10px_rgba(0,0,0,0.1)] dark:shadow-[10px_0_15px_-10px_rgba(0,0,0,0.5)]">
                                        <span className="text-[12px] font-black text-slate-900 dark:text-white uppercase leading-tight truncate" title={equipment.equipmentName}>{equipment.equipmentName}</span>
                                        <span className="text-[9px] font-black text-blue-500 tracking-[0.2em] uppercase mt-1">ID: {equipment.equipmentId.split('-')[0]}</span>
                                    </div>
                                    <div className="flex flex-1 relative min-h-[80px]">
                                        {/* Background Grid */}
                                        <div className="absolute inset-0 flex">
                                            {days.map((day) => {
                                                const isToday = day.isSame(dayjs(), 'day');
                                                return <div key={day.toISOString()} className={`flex-1 min-w-[48px] border-r border-slate-100/50 dark:border-slate-700/50 ${isToday ? 'bg-blue-50/30 dark:bg-blue-500/5' : ''}`} />;
                                            })}
                                        </div>

                                        {/* Bookings Overlay */}
                                        {equipment.bookings.map((booking: any) => {
                                            const start = dayjs(booking.startDate);
                                            const end = dayjs(booking.endDate);

                                            // Handle cases where booking spans multiple months
                                            const validStart = start.isBefore(currentMonth.startOf('month')) ? currentMonth.startOf('month') : start;
                                            const validEnd = end.isAfter(currentMonth.endOf('month')) ? currentMonth.endOf('month') : end;

                                            // If the booking is completely outside this month, ignore it (handled by API mostly, but just in case)
                                            if (start.isAfter(currentMonth.endOf('month')) || end.isBefore(currentMonth.startOf('month'))) return null;

                                            const startOffsetDays = validStart.diff(currentMonth.startOf('month'), 'day');
                                            const durationDays = validEnd.diff(validStart, 'day') + 1;

                                            return (
                                                <div
                                                    key={booking.orderId}
                                                    className={`absolute top-1/2 -translate-y-1/2 h-10 rounded-xl flex items-center px-4 ${getStatusColor(booking.status)} overflow-hidden group/booking cursor-pointer shadow-lg border text-white transition-transform hover:scale-[1.02] hover:-translate-y-[calc(50%+2px)] z-20`}
                                                    style={{
                                                        left: `calc((${startOffsetDays} / ${daysInMonth}) * 100% + 4px)`,
                                                        width: `calc((${durationDays} / ${daysInMonth}) * 100% - 8px)`
                                                    }}
                                                    title={`${booking.customerName} (${dayjs(booking.startDate).format('DD/MM')} - ${dayjs(booking.endDate).format('DD/MM')})`}
                                                >
                                                    <span className="text-[10px] font-black uppercase truncate racking-widest opacity-90">{booking.customerName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 px-2 justify-center">
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-[6px] bg-blue-500 border border-blue-600 shadow-sm" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">ĐANG THUÊ</span></div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-[6px] bg-amber-500 border border-amber-600 shadow-sm" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">CHỜ DUYỆT</span></div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-[6px] bg-indigo-500 border border-indigo-600 shadow-sm" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">ĐÃ XÁC NHẬN</span></div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-[6px] bg-rose-500 border border-rose-600 shadow-sm" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">TRỄ HẠN</span></div>
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-[6px] bg-emerald-500 border border-emerald-600 shadow-sm" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">HOÀN TẤT</span></div>
                </div>
            </div>
        </div>
    );
}
