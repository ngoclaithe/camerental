import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Camera, X, User, Calendar as CalendarIcon } from 'lucide-react';
import { calendarApi } from '../../api';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {calendarData.map((item) => (
          <div key={item.equipmentId} className="group bg-white dark:bg-slate-800 rounded-[44px] border border-slate-100 dark:border-slate-700 p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-700 relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-black text-blue-600 border border-slate-100 dark:border-slate-700 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 overflow-hidden relative shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.equipmentName} className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 relative z-10" />
                  )}
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
                item.bookings.map((booking: any, idx: number) => {
                  const isRenting = booking.status === 'RENTING' || booking.status === 'LATE';
                  return (
                    <div key={idx} className="relative group/booking">
                      <div className={`p-8 rounded-[32px] border-l-[8px] ${isRenting ? 'border-l-emerald-500 bg-emerald-50/10 dark:bg-emerald-500/5' : 'border-l-amber-500 bg-amber-50/10 dark:bg-amber-500/5'} dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-500 hover:translate-x-2`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{booking.customerName}</span>
                            <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm ${isRenting ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                              {isRenting ? 'ĐANG THUÊ' : 'CHỜ GIAO'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-inner"><span className="text-slate-900 dark:text-white">{dayjs(booking.startDate).format('HH:mm')}</span> — <span className="text-slate-900 dark:text-white">{dayjs(booking.endDate).format('HH:mm')}</span></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <span>HẠN TRẢ: {dayjs(booking.endDate).format('DD/MM')}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedBooking({ ...booking, equipmentName: item.equipmentName, equipmentId: item.equipmentId })}
                          className="px-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          CHI TIẾT
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-24 rounded-[32px] border-2 border-dashed border-slate-100 dark:border-slate-700 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/30">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">CHƯA CÓ LỊCH TRONG NGÀY</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">THÔNG TIN ĐẶT LỊCH</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 relative">
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-100 dark:border-blue-800/50 flex flex-col items-center justify-center font-black">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">KHÁCH HÀNG</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{selectedBooking.customerName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">THIẾT BỊ</p>
                  <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase">{selectedBooking.equipmentName}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">TRẠNG THÁI</p>
                  <span className={`w-fit px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-sm ${selectedBooking.status === 'RENTING' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {selectedBooking.status === 'RENTING' ? 'ĐANG THUÊ' : 'CHỜ GIAO'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[32px] p-6 border border-slate-100 dark:border-slate-700 relative z-10">
                <div className="flex items-start gap-5">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-5">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">THỜI GIAN NHẬN MÁY</p>
                      <p className="font-black text-slate-900 dark:text-white text-[15px]">{dayjs(selectedBooking.startDate).format('HH:mm - D [tháng] M, YYYY')}</p>
                    </div>
                    <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">THỜI GIAN TRẢ MÁY</p>
                      <p className="font-black text-slate-900 dark:text-white text-[15px]">{dayjs(selectedBooking.endDate).format('HH:mm - D [tháng] M, YYYY')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-5 rounded-[24px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95"
              >
                ĐÓNG LẠI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
