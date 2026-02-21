import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecures";
import Swal from "sweetalert2";
import { 
  Package, Eye, X, User, MapPin, 
  Smartphone, CheckCircle2, Navigation, Map, Mail, Search, CreditCard,
  Loader2
} from "lucide-react";

const UnpaidOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Step 1: Fetch only UNPAID orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["unpaid-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders");
      // Shudhu unpaid orders filter hobe
      return res.data.filter(order => order.paymentStatus === "unpaid");
    },
  });

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders.filter(order => order.deliveryStatus !== "success");
    return orders.filter(order => 
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.phone?.includes(searchTerm)
    );
  }, [orders, searchTerm]);

  // Step 2: Mutation for Status Update
  const mutation = useMutation({
    mutationFn: async ({ id, nextDeliveryStatus, nextPaymentStatus }) => {
      const updateData = { deliveryStatus: nextDeliveryStatus };
      if (nextPaymentStatus) updateData.paymentStatus = nextPaymentStatus;
      
      const res = await axiosSecure.patch(`/orders/${id}`, updateData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["unpaid-orders"]);
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Status Updated!', showConfirmButton: false, timer: 1000 });
    },
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#f1f5f9]"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;

  return (
    <div className="p-4 md:p-10  min-h-screen text-slate-800 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase italic">Unpaid Desk</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search unpaid orders..." 
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-[#cbd5e1] border border-slate-300 rounded-[2rem] p-6 shadow-sm flex flex-col transition-all hover:shadow-xl group border-b-4 border-b-orange-400 hover:border-b-indigo-600">
            
            <div className="flex justify-between items-start mb-5">
              <span className="text-[10px] font-black px-3 py-1 bg-white/80 text-orange-600 rounded-lg uppercase tracking-widest shadow-sm">
                {order.paymentStatus}
              </span>
              <div className="text-slate-600 font-mono text-[10px] bg-white/30 px-2 py-0.5 rounded italic">#{order._id.slice(-5).toUpperCase()}</div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-[1000] text-slate-900 uppercase truncate leading-tight mb-2">{order.name}</h3>
              <p className="text-[13px] font-bold text-slate-700 flex items-center gap-2 mb-1"><Smartphone size={14} className="text-indigo-600"/> {order.phone}</p>
              <p className="text-[11px] font-black text-slate-500 flex items-center gap-2 uppercase italic leading-none"><MapPin size={13}/> {order.district}</p>
            </div>

            {/* Price Box */}
            <div className="bg-white/40 p-3 rounded-2xl border border-white/40 flex justify-between items-center mb-6 shadow-inner">
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase">Cash to Collect</p>
                <p className="text-[16px] font-black text-slate-900 tracking-tighter">৳{order.totalAmount}</p>
              </div>
              <div className="bg-white/60 px-2 py-1 rounded-lg">
                <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Status</p>
                <p className="text-[10px] font-bold text-slate-600">{order.deliveryStatus}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex items-center gap-3">
              {/* Colorful Eye Button */}
              <button 
                onClick={() => setSelectedOrder(order)} 
                className="p-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-indigo-200"
              >
                <Eye size={20} />
              </button>
              
              <button
                onClick={() => {
                  if (order.deliveryStatus === "pending") {
                    // Step 1: Confirm Order
                    mutation.mutate({ id: order._id, nextDeliveryStatus: "confirmed" });
                  } else {
                    // Step 2: Mark as Success Delivery and Paid
                    mutation.mutate({ 
                      id: order._id, 
                      nextDeliveryStatus: "success", 
                      nextPaymentStatus: "paid" 
                    });
                  }
                }}
                className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-white shadow-lg active:scale-95 ${
                  order.deliveryStatus === "pending" ? "bg-slate-900 hover:bg-black shadow-slate-200" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                }`}
              >
                {order.deliveryStatus === "pending" ? "Confirm Order" : "Success & Paid"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- POPUP MODAL (Same as PaidOrders) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 rounded-xl text-white"><Package size={22}/></div>
                  <h3 className="font-[1000] text-slate-900 uppercase text-md">Order Details</h3>
               </div>
               <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={28}/></button>
            </div>

            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
                  <p className="text-[10px] font-black text-indigo-600 uppercase mb-4 tracking-widest">Recipient</p>
                  <h4 className="text-[17px] font-black text-slate-900 uppercase mb-2">{selectedOrder.name}</h4>
                  <p className="text-[13px] font-bold text-slate-600 flex items-center gap-2"><Mail size={14} className="text-indigo-400"/> {selectedOrder.email}</p>
                  <p className="text-[13px] font-bold text-slate-600 flex items-center gap-2 mt-1"><Smartphone size={14} className="text-indigo-400"/> {selectedOrder.phone}</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Settlement</p>
                  <p className="text-sm font-black text-slate-800 uppercase italic mb-2">Method: {selectedOrder.paymentMethod}</p>
                  <div className="bg-white p-3 rounded-xl border border-orange-200">
                    <p className="text-[9px] font-black text-orange-600 uppercase mb-1">Payment Status</p>
                    <p className="text-[12px] font-bold uppercase text-slate-700">{selectedOrder.paymentStatus}</p>
                  </div>
                </div>
              </div>

              {/* ADDRESS LABELS */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                 <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4">Detailed Address</p>
                 <div className="space-y-4">
                    <div className="flex items-start gap-3 border-b border-white/10 pb-3">
                       <Map size={18} className="text-indigo-400 mt-1 shrink-0" />
                       <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase">Street / Location</p>
                          <p className="text-sm font-black uppercase">{selectedOrder.address}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                       <div><p className="text-[9px] font-black text-slate-500 uppercase">Thana</p><p className="text-[12px] font-black uppercase">{selectedOrder.thana}</p></div>
                       <div><p className="text-[9px] font-black text-slate-500 uppercase">District</p><p className="text-[12px] font-black uppercase">{selectedOrder.district}</p></div>
                       <div><p className="text-[9px] font-black text-slate-500 uppercase">Zip</p><p className="text-[12px] font-black uppercase">{selectedOrder.zip}</p></div>
                    </div>
                 </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-5 p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                    <img src={item.image} className="h-14 w-14 rounded-xl object-cover" alt="" />
                    <div className="flex-1">
                       <div className="flex gap-2 mb-1.5">
                          <span className="text-[13px] font-black px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase tracking-tighter">SKU: {item.sku}</span>
                          <span className="text-[13px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded uppercase">Size: {item.size}</span>
                          <span className="text-[13px] font-black px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase tracking-tighter">Quantity: {item.quantity}</span>
                         
                       </div>
                       <p className="text-[13px] font-black text-slate-800 uppercase leading-tight">{item.name}</p>
                    </div>
                    <p className="text-[15px] font-[1000] text-slate-900 pr-2">৳{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Grand Total */}
              <div className="bg-[#f8fafc] p-8 rounded-[3rem] border border-slate-200 flex justify-between items-center shadow-inner">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Cash to Collect</p>
                    <h4 className="text-[34px] font-[1000] text-slate-900 tracking-tighter italic leading-none">৳{selectedOrder.totalAmount}</h4>
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnpaidOrders;