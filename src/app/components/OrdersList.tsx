import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, FileText, Calendar, DollarSign, User } from 'lucide-react';
import { orderApi } from '../../api';
import { toast } from 'sonner';

export default function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = async () => {
    try {
      const data = await orderApi.findAll();
      setOrders(data);
    } catch (error: any) {
      console.error('Failed to fetch orders', error);
      toast.error('Lỗi tải danh sách', {
        description: error.response?.data?.message || 'Không thể lấy dữ liệu đơn hàng.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const statusOptions = ['PENDING', 'CONFIRMED', 'RENTING', 'LATE', 'COMPLETED', 'CANCELLED'];

  const statusMap: Record<string, string> = {
    'PENDING': 'CHỜ DUYỆT',
    'CONFIRMED': 'ĐÃ XÁC NHẬN',
    'RENTING': 'ĐANG THUÊ',
    'LATE': 'TRỄ HẠN',
    'COMPLETED': 'HOÀN TẤT',
    'CANCELLED': 'ĐÃ HỦY'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RENTING': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      case 'LATE': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'COMPLETED': return 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400';
      case 'CANCELLED': return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-500/20 dark:text-neutral-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Đã cập nhật trạng thái đơn hàng');
    } catch (error: any) {
      toast.error('Lỗi cập nhật', {
        description: error.response?.data?.message || 'Không thể thay đổi trạng thái.'
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.customer?.name || '';
    const orderCode = order.code || '';
    const equipmentNames = order.orderItems?.map((item: any) => item.equipment.name).join(' ') || '';

    const matchesSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipmentNames.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 if search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">ĐANG TẢI DANH SÁCH ĐƠN HÀNG...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Quản lý đơn hàng</h2>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-2">{filteredOrders.length} ĐƠN TÌM THẤY</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group flex-1 sm:min-w-[300px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên khách, thiết bị..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all font-black text-sm uppercase text-slate-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`p-4 rounded-2xl transition-all flex items-center justify-center border-2 ${showFilter ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${filterStatus === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                TẤT CẢ
              </button>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${filterStatus === status ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {statusMap[status] || status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Orders Table/List */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-widest">ĐƠN HÀNG</th>
                <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-widest">KHÁCH HÀNG</th>
                <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-widest">THỜI GIAN</th>
                <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-widest">TỔNG TIỀN</th>
                <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-widest text-center">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-black uppercase tracking-widest">
                    KHÔNG TÌM THẤY ĐƠN HÀNG NÀO
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{order.code}</span>
                        <div className="flex flex-wrap gap-1 mt-1 max-w-[250px]">
                          {order.orderItems?.map((i: any, idx: number) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-900 text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded uppercase">{i.equipment.name}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-sm font-black text-blue-600 dark:text-blue-400">
                          {order.customer?.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-slate-700 dark:text-slate-300 uppercase leading-tight">{order.customer?.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-widest">{order.customer?.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1 text-[11px] font-black text-slate-500 uppercase">
                        <span className="text-slate-700 dark:text-slate-300">{new Date(order.startDate).toLocaleDateString('vi-VN')} - {new Date(order.endDate).toLocaleDateString('vi-VN')}</span>
                        <span className="text-blue-500 tracking-widest">THUÊ {order.totalDays} NGÀY</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 dark:text-white text-lg">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`appearance-none cursor-pointer outline-none px-4 py-2 text-[10px] leading-none rounded-xl font-black uppercase tracking-widest text-center border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all ${getStatusColor(order.status)}`}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{statusMap[opt] || opt}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-700 min-h-[400px]">
          {currentOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-black uppercase tracking-widest">
              KHÔNG TÌM THẤY ĐƠN HÀNG NÀO
            </div>
          ) : (
            currentOrders.map(order => (
              <div key={order.id} className="p-6 space-y-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg leading-none">{order.code}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <p className="font-black text-xs text-slate-600 dark:text-slate-400 uppercase">{order.customer?.name}</p>
                    </div>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`shrink-0 appearance-none cursor-pointer outline-none px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-center ${getStatusColor(order.status)}`}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{statusMap[opt] || opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-1">
                  {order.orderItems?.map((i: any, idx: number) => (
                    <span key={idx} className="bg-slate-100 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 px-2 py-1 rounded truncate max-w-full">
                      {i.equipment.name}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex flex-col gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>{new Date(order.startDate).toLocaleDateString('vi-VN')}</span>
                    <span className="text-blue-500">{order.totalDays} NGÀY</span>
                  </div>
                  <span className="font-black text-lg text-slate-900 dark:text-white leading-none">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 px-6 py-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block">
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} / {filteredOrders.length}
          </p>
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-50 text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-black text-xs uppercase transition-colors"
            >
              TRƯỚC
            </button>
            <div className="font-black text-[13px] text-slate-900 dark:text-white px-2">
              <span className="text-blue-600">{currentPage}</span> / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-50 text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-black text-xs uppercase transition-colors"
            >
              SAU
            </button>
          </div>
        </div>
      )}

      {/* Global Summary */}
      {filteredOrders.length > 0 && (
        <div className="bg-slate-900 rounded-[32px] p-8 lg:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tổng GT lọc được</p>
              <p className="text-3xl font-black text-white">{formatCurrency(filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0))}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
