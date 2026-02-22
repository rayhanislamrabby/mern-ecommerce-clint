import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingBag,
  Zap,
  Activity,
  Ticket,
  ShoppingCart,
  CheckCircle2,
  Clock,
  CreditCard,
  AlertCircle,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecures";

const DashBoardHome = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/admin-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Dashboard Data Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, [axiosSecure]);

  const COLORS = [
    "#F472B6",
    "#60A5FA",
    "#34D399",
    "#FBBF24",
    "#818CF8",
    "#A78BFA",
  ];

  // অ্যানিমেশন ভেরিয়েন্টস
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050811]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-t-4 border-b-4 border-emerald-500 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="mt-8 font-black text-emerald-400 tracking-[0.5em] uppercase text-xs"
        >
          Analyzing Neural Net...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-4 md:p-8  min-h-screen space-y-8 font-sans pb-20"
    >
      {/* --- Section 1: Dynamic Header --- */}
      <motion.div
        variants={itemVars}
        className="relative bg-gradient-to-r from-[#111827] via-[#1e1b4b] to-[#111827] p-10 rounded-[3.5rem] border border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.15)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/40">
                Live Core v4.0
              </span>
              <Activity className="text-rose-500 animate-pulse" size={16} />
            </div>
            <h1 className="text-5xl lg:text-7xl font-[1000] text-white tracking-tighter uppercase italic italic">
              Shop
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                Zone
              </span>{" "}
            
            </h1>
            <p className="text-indigo-200/50 font-bold mt-4 max-w-xl">
              Deep analytics integration with real-time order tracking and
              inventory intelligence.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-emerald-500 text-white font-black px-12 py-5 rounded-[2rem] text-xs uppercase shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            System Reboot
          </motion.button>
        </div>
      </motion.div>

      {/* --- Section 2: High-Vibrancy Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Revenue",
            val: `$${stats.summary?.totalRevenue}`,
            icon: <TrendingUp />,
            grad: "from-blue-600 to-indigo-700",
          },
          {
            label: "Confirmed Orders",
            val: stats.summary?.successOrders,
            icon: <CheckCircle2 />,
            grad: "from-emerald-500 to-teal-700",
          },
          {
            label: "Pending Sales",
            val: stats.summary?.pendingOrders,
            icon: <Clock />,
            grad: "from-orange-500 to-rose-600",
          },
          {
            label: "Active Customers",
            val: stats.summary?.totalUsers,
            icon: <Users />,
            grad: "from-purple-600 to-pink-700",
          },
          {
            label: "Paid Invoices",
            val: stats.summary?.paidOrders,
            icon: <CreditCard />,
            grad: "from-cyan-500 to-blue-500",
          },
          {
            label: "Unpaid Balance",
            val: stats.summary?.unpaidOrders,
            icon: <AlertCircle />,
            grad: "from-rose-600 to-red-800",
          },
          {
            label: "Live Cart Items",
            val: stats.summary?.totalCartItems,
            icon: <ShoppingCart />,
            grad: "from-indigo-600 to-violet-800",
          },
          {
            label: "Active Coupons",
            val: stats.summary?.totalCoupons,
            icon: <Ticket />,
            grad: "from-amber-500 to-orange-600",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={itemVars}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`bg-gradient-to-br ${item.grad} p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group`}
          >
            <div className="absolute -right-4 -top-4 text-white/10 group-hover:scale-150 transition-transform duration-700">
              {React.cloneElement(item.icon, { size: 100 })}
            </div>
            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/30 text-white">
              {item.icon}
            </div>
            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
              {item.label}
            </p>
            <h2 className="text-4xl font-black text-white tracking-tighter mt-1">
              {item.val}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* --- Section 3: Advanced Graphs --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Intelligence (Vertical Bar Chart) */}
        <motion.div
          variants={itemVars}
          className="lg:col-span-2 bg-[#554245] p-10 rounded-[3.5rem] border border-indigo-500/10 shadow-inner"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white uppercase italic flex items-center gap-4">
              <div className="w-2 h-10 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>
              Inventory Intelligence
            </h3>
            <LayoutGrid className="text-indigo-500 opacity-50" />
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData || []} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6366f1", fontSize: 12, fontWeight: 900 }}
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{
                    backgroundColor: "#0d111d",
                    border: "none",
                    borderRadius: "15px",
                  }}
                />
                <Bar dataKey="value" radius={[0, 20, 20, 0]} barSize={25}>
                  {stats.categoryData?.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution (Pie Chart) */}
        <motion.div
          variants={itemVars}
          className="bg-[#0e485a] p-10 rounded-[3.5rem] border border-indigo-500/10 flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-black text-white uppercase italic mb-8 self-start tracking-widest">
            Order Success Ratio
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Success", value: stats.summary?.successOrders },
                    { name: "Pending", value: stats.summary?.pendingOrders },
                  ]}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>{" "}
              Delivered
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase">
              <div className="w-3 h-3 bg-rose-500 rounded-full"></div>{" "}
              Processing
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Section 4: Revenue & Potential --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <motion.div
          variants={itemVars}
          className="bg-[#445791] p-10 rounded-[3.5rem] border border-indigo-500/10 shadow-2xl"
        >
          <h3 className="text-xl font-black text-white uppercase italic mb-8 flex items-center gap-3">
            <Sparkles className="text-amber-400" /> Revenue Growth Stream
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData || []}>
                <defs>
                  <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#1e293b"
                />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0d111d", border: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#60a5fa"
                  strokeWidth={6}
                  fill="url(#neonGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Interactive Stats Widget */}
        <motion.div
          variants={itemVars}
          className="bg-gradient-to-br from-indigo-900 to-blue-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-between group overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter leading-none mb-6">
              Master <br />
              Control
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-indigo-300">
                <span>System Stability</span>
                <span>99.9%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "99.9%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-emerald-400 shadow-[0_0_15px_#34d399]"
                />
              </div>
            </div>
          </div>
          <button className="bg-white text-indigo-900 font-black py-5 rounded-2xl uppercase text-xs tracking-widest mt-10 hover:bg-emerald-400 hover:text-white transition-all">
            Export Master Database
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashBoardHome;
