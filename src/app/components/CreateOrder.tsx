import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Search, User, Camera, Calendar as CalendarIcon, CreditCard, ShoppingBag } from 'lucide-react';
import { customerApi, equipmentApi, orderApi } from '../../api';
import dayjs from 'dayjs';

export default function CreateOrder() {
  const [step, setStep] = useState(1);
  const [customers, setCustomers] = useState<any[]>([]);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    equipmentIds: [] as string[],
    equipmentNames: [] as string[],
    startDate: '',
    endDate: '',
    days: 0,
    pricePerDay: 0,
    deposit: 0,
    discount: 0,
    totalAmount: 0,
    note: '',
  });

  useEffect(() => {
    if (step === 1) {
      customerApi.findAll().then(setCustomers);
    } else if (step === 2) {
      equipmentApi.findAll().then(data => setEquipments(data.filter((e: any) => e.status === 'AVAILABLE')));
    }
  }, [step]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const nextStep = () => step < 4 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const selectCustomer = (customer: any) => {
    setFormData({ ...formData, customerId: customer.id, customerName: customer.name });
    nextStep();
  };

  const toggleEquipment = (eq: any) => {
    const isSelected = formData.equipmentIds.includes(eq.id);
    let newIds, newNames, newPricePerDay;

    if (isSelected) {
      newIds = formData.equipmentIds.filter(id => id !== eq.id);
      newNames = formData.equipmentNames.filter(name => name !== eq.name);
      newPricePerDay = formData.pricePerDay - eq.pricePerDay;
    } else {
      newIds = [...formData.equipmentIds, eq.id];
      newNames = [...formData.equipmentNames, eq.name];
      newPricePerDay = formData.pricePerDay + eq.pricePerDay;
    }

    const totalAmount = (newPricePerDay * formData.days) - formData.discount;
    setFormData({ ...formData, equipmentIds: newIds, equipmentNames: newNames, pricePerDay: newPricePerDay, totalAmount });
  };

  const updateDates = (start: string, end: string) => {
    if (!start || !end) return;
    const s = dayjs(start);
    const e = dayjs(end);
    const days = e.diff(s, 'day') || 1;
    const totalAmount = (formData.pricePerDay * days) - formData.discount;
    setFormData({ ...formData, startDate: start, endDate: end, days, totalAmount });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await orderApi.create({
        customerId: formData.customerId,
        equipmentIds: formData.equipmentIds,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        totalDays: formData.days,
        pricePerDay: formData.pricePerDay,
        deposit: formData.deposit,
        discount: formData.discount,
        totalAmount: formData.totalAmount,
        note: formData.note,
      });
      alert('Đơn thuê đã được tạo thành công!');
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể tạo đơn hàng'));
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.phone.includes(searchCustomer)
  );

  const steps = [
    { title: 'KHÁCH HÀNG', icon: User },
    { title: 'THIẾT BỊ', icon: Camera },
    { title: 'THANH TOÁN', icon: CreditCard },
    { title: 'XÁC NHẬN', icon: ShoppingBag },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 lg:pb-0">

      {/* Step Indicator Header */}
      <div className="bg-white dark:bg-slate-800 rounded-[48px] p-10 lg:p-14 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50 dark:bg-slate-900" />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-[28px] left-0 w-full h-1 bg-slate-50 dark:bg-slate-700 -translate-y-1/2 rounded-full hidden sm:block" />
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              const isCompleted = step > idx + 1;
              const isActive = step === idx + 1;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-4">
                  <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-500 shadow-xl ${isActive ? 'bg-blue-600 text-white scale-110 shadow-blue-500/30 ring-4 ring-blue-500/10' :
                    isCompleted ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-2 border-slate-50 dark:border-slate-700'
                    }`}>
                    {isCompleted ? <Check className="w-8 h-8" /> : <StepIcon className="w-8 h-8" />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto min-h-[500px]">
        {/* Step 1: Customer Selection */}
        {step === 1 && (
          <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">CHỌN KHÁCH HÀNG</h3>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest opacity-70">Tìm kiếm từ danh sách hội viên hệ thống</p>
            </div>

            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400 group-focus-within:text-blue-600 transition-all" />
              <input
                type="text"
                placeholder="TÊN KHÁCH, SỐ ĐIỆN THOẠI..."
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="w-full pl-18 pr-10 py-6 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-[32px] focus:border-blue-600 transition-all font-black text-xl shadow-sm uppercase tracking-tighter"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectCustomer(c)}
                  className={`p-10 rounded-[44px] border-2 text-left transition-all duration-500 group relative overflow-hidden ${formData.customerId === c.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10 shadow-2xl shadow-blue-500/5' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-blue-200 dark:hover:border-blue-900'
                    }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${formData.customerId === c.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <User className="w-7 h-7" />
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{c.name}</p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">{c.phone}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Equipment & Dates */}
        {step === 2 && (
          <div className="space-y-12 animate-in slide-in-from-right-10 duration-1000">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              <div className="xl:col-span-2 space-y-8">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">THIẾT BỊ SẴN SÀNG</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {equipments.map(eq => (
                    <button
                      key={eq.id}
                      onClick={() => toggleEquipment(eq)}
                      className={`p-8 rounded-[40px] border-2 text-left transition-all duration-500 flex items-center gap-6 relative overflow-hidden ${formData.equipmentIds.includes(eq.id) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10 shadow-xl shadow-blue-500/5' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                      <div className={`p-5 rounded-2xl transition-all duration-500 ${formData.equipmentIds.includes(eq.id) ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                        <Camera className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-black text-slate-900 dark:text-white uppercase leading-tight">{eq.name}</p>
                        <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-tighter">{formatCurrency(eq.pricePerDay)}<span className="text-[10px] text-slate-400 opacity-60 ml-1">/NGÀY</span></p>
                      </div>
                      {formData.equipmentIds.includes(eq.id) && <Check className="w-7 h-7 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">THỜI GIAN THUÊ</h3>
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[48px] border border-slate-100 dark:border-slate-700 shadow-sm space-y-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">NGÀY BẮT ĐẦU</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input type="date" value={formData.startDate} onChange={e => updateDates(e.target.value, formData.endDate)} className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-[22px] font-black uppercase text-sm" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">NGÀY KẾT THÚC</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input type="date" value={formData.endDate} onChange={e => updateDates(formData.startDate, e.target.value)} className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-[22px] font-black uppercase text-sm" />
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-50 dark:border-slate-700 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Tổng số ngày thuê</p>
                    <span className="text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">{formData.days}</span>
                    <span className="ml-3 text-xs font-black uppercase tracking-widest text-slate-400 opacity-60">NGÀY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment Details */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto space-y-10 animate-in zoom-in-95 duration-700">
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">THANH TOÁN</h3>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest opacity-70">Điều chỉnh tiền cọc và giảm giá cho khách hàng</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[56px] border border-slate-100 dark:border-slate-700 p-12 lg:p-16 shadow-sm space-y-12">
              <div className="flex justify-between items-end border-b border-slate-50 dark:border-slate-900 pb-10">
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">TẠM TÍNH</p>
                  <p className="text-xl font-black text-slate-500 uppercase tracking-tighter">Giá thuê niêm yết</p>
                </div>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(formData.pricePerDay * formData.days)}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">TIỀN CỌC (VNĐ)</label>
                  <input type="number" placeholder="0" value={formData.deposit || ''} onChange={e => setFormData({ ...formData, deposit: Number(e.target.value) })} className="w-full p-6 py-7 bg-slate-50 dark:bg-slate-900 border-none rounded-[28px] font-black text-2xl tracking-tighter focus:ring-4 focus:ring-blue-100" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">GIẢM GIÁ (VNĐ)</label>
                  <input type="number" placeholder="0" value={formData.discount || ''} onChange={e => {
                    const disc = Number(e.target.value);
                    setFormData({ ...formData, discount: disc, totalAmount: (formData.pricePerDay * formData.days) - disc });
                  }} className="w-full p-6 py-7 bg-slate-50 dark:bg-slate-900 border-none rounded-[28px] font-black text-2xl tracking-tighter text-emerald-600 focus:ring-4 focus:ring-emerald-100" />
                </div>
              </div>

              <div className="bg-slate-900 rounded-[44px] p-12 text-white flex justify-between items-center shadow-2xl shadow-slate-900/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-full bg-blue-600 transition-all duration-700 group-hover:w-40" />
                <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-3">TỔNG CỘNG THỰC THU</p>
                  <p className="text-5xl font-black tracking-tighter">{formatCurrency(formData.totalAmount)}</p>
                </div>
                <div className="relative z-10 w-20 h-20 rounded-[28px] bg-white/10 flex items-center justify-center border border-white/5 backdrop-blur-sm">
                  <Check className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-1000">
            <div className="bg-white dark:bg-slate-800 rounded-[56px] border border-slate-100 dark:border-slate-700 p-12 lg:p-20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-[100px] flex items-center justify-center pl-10 pb-10">
                <Check className="w-16 h-16 text-emerald-500" />
              </div>

              <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-16 leading-tight">XÁC NHẬN HỢP ĐỒNG<br /><span className="text-slate-400 opacity-60">TỔNG HỢP THÔNG TIN</span></h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <div className="space-y-3">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60">KHÁCH HÀNG THUÊ</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{formData.customerName}</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60">DANH SÁCH THIẾT BỊ</p>
                    <div className="flex flex-wrap gap-2.5">
                      {formData.equipmentNames.map((n, i) => (
                        <span key={i} className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-tight border border-slate-100 dark:border-slate-700">{n}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-10 lg:text-right">
                  <div className="space-y-3">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60">THỜI GIAN HIỆU LỰC</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{dayjs(formData.startDate).format('DD/MM')} — {dayjs(formData.endDate).format('DD/MM/YYYY')}</p>
                    <p className="text-sm font-black text-blue-600 uppercase tracking-widest mt-2">TỔNG {formData.days} NGÀY THUÊ</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60">THÀNH TIỀN</p>
                    <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{formatCurrency(formData.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-20 space-y-6">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">GHI CHÚ HỢP ĐỒNG / YÊU CẦU RIÊNG</label>
                <textarea
                  placeholder="NHẬP CÁC LƯU Ý BỔ SUNG..."
                  className="w-full p-10 rounded-[44px] border-2 border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 transition-all font-black text-xl uppercase tracking-tighter h-48 shadow-inner resize-none appearance-none"
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 lg:relative lg:bg-transparent lg:border-0 lg:p-0">
        <div className="max-w-xl mx-auto flex gap-6">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 text-slate-600 dark:text-white"
            >
              QUAY LẠI
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!formData.customerId || (step === 2 && (formData.equipmentIds.length === 0 || !formData.startDate || !formData.endDate))}
              className="flex-1 py-6 bg-blue-600 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/40 disabled:opacity-30 disabled:grayscale transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              TIẾP TỤC <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-6 bg-emerald-600 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-emerald-500/40 disabled:opacity-30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? 'ĐANG LƯU...' : 'LƯU HỢP ĐỒNG'} <Check className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
