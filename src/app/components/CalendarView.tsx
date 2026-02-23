import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Camera } from 'lucide-react';
import { calendarApi } from '../../api';
import dayjs from 'dayjs';

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const start = selectedDate.startOf('day').toISOString();
        const end = selectedDate.endOf('day').toISOString();

        const data = await calendarApi.get(start, end);
        setCalendarData(data);
      } catch (error) {
        console.error('Failed to fetch calendar data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const formatDate = (date: dayjs.Dayjs) => {
    return date.format('dddd, [ngày] D [tháng] M, YYYY');
  };

  const previousDay = () => setSelectedDate(selectedDate.subtract(1, 'day'));
  const nextDay = () => setSelectedDate(selectedDate.add(1, 'day'));
  const today = () => setSelectedDate(dayjs());

  if (loading && calendarData.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">ĐANG TẢI LỊCH THUÊ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header & Date Navigation */}
      <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <button onClick={previousDay} className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all active:scale-90">
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>
            <div className="text-center min-w-[250px]">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">{formatDate(selectedDate)}</h2>
              <button onClick={today} className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-500 tracking-[0.3em] mt-3 hover:opacity-70 transition-opacity">Hôm nay</button>
            </div>
            <button onClick={nextDay} className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all active:scale-90">
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-6 p-4 px-8 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /><span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Đang thuê</span></div>
            <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" /><span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Chờ giao</span></div>
          </div>
        </div>
      </div>

      {/* Equipment Schedule List */}
      <div className="grid grid-cols-1 gap-6">
        {calendarData.map((item) => (
          <div key={item.equipmentId} className="group bg-white dark:bg-slate-800 rounded-[44px] border border-slate-100 dark:border-slate-700 p-10 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-700 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-black text-blue-600 border border-slate-100 dark:border-slate-700 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{item.equipmentName}</h3>
                  <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-3">SER_ID: {item.equipmentId.split('-')[0]}</p>
                </div>
              </div>
              {item.bookings.length === 0 && (
                <span className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl border border-emerald-100 dark:border-emerald-500/20">TRỐNG LỊCH</span>
              )}
            </div>

            <div className="space-y-4">
              {item.bookings.length > 0 ? (
                item.bookings.map((booking: any, idx: number) => (
                  <div key={idx} className="relative group/booking">
                    <div className={`p-8 rounded-[32px] border-l-[8px] ${booking.status === 'RENTING' ? 'border-l-emerald-500 bg-emerald-50/10 dark:bg-emerald-500/5' : 'border-l-amber-500 bg-amber-50/10 dark:bg-amber-500/5'} dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-500 hover:translate-x-2`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{booking.customerName}</span>
                          <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm ${booking.status === 'RENTING' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                            {booking.status === 'RENTING' ? 'ĐANG THUÊ' : 'CHỜ GIAO'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-inner"><span className="text-slate-900 dark:text-white">{dayjs(booking.startDate).format('HH:mm')}</span> — <span className="text-slate-900 dark:text-white">{dayjs(booking.endDate).format('HH:mm')}</span></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                          <span>HẠN TRẢ: {dayjs(booking.endDate).format('DD/MM')}</span>
                        </div>
                      </div>
                      <button className="px-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">CHI TIẾT</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-24 rounded-[32px] border-2 border-dashed border-slate-100 dark:border-slate-700 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/30">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">CHƯA CÓ LỊCH TRONG NGÀY</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="fixed bottom-24 right-8 lg:bottom-12 lg:right-12 w-20 h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-[28px] shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all hover:scale-110 hover:-rotate-90 active:scale-95 z-50 group">
        <Plus className="w-10 h-10 stroke-[3]" />
      </button>
    </div>
  );
}
