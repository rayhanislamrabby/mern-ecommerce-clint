import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecures";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  User,
  Mail,
  Crown,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const MakeAsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 1. Load All Users (Admin list)
  const { data: allUsers = [], isLoading: loadingAll } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const adminList = allUsers.filter((user) => user.role === "admin");

  // 2. Instant Search (Suggestion)
  const { data: searchedUser, isLoading: searchLoading } = useQuery({
    queryKey: ["searchUser", searchTerm],
    queryFn: async () => {
      if (searchTerm.length < 2) return null;
      const res = await axiosSecure.get(`/users/search?email=${searchTerm}`);
      return res.data;
    },
    enabled: searchTerm.length >= 2,
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, newRole }) => {
      const endpoint =
        newRole === "admin" ? `/users/admin/${id}` : `/users/user/${id}`;
      return await axiosSecure.patch(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      queryClient.invalidateQueries(["searchUser"]);
      setSearchTerm("");
    },
  });

  // --- Organic SweetAlert Logic ---
  const handleRoleToggle = (user, newRole) => {
    Swal.fire({
      title: `<span class="font-bold text-xl">${newRole === "admin" ? "Make Administrator?" : "Remove Admin Access?"}</span>`,
      text: `${user.name}  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Confiram",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#1e293b",
      color: "#ffffff",
      confirmButtonColor: newRole === "admin" ? "#22c55e" : "#ef4444",
      customClass: {
        popup: "rounded-3xl border border-slate-700 shadow-2xl",
        confirmButton: "rounded-full px-6 py-2 font-bold",
        cancelButton: "rounded-full px-6 py-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ id: user._id, newRole });
      }
    });
  };

  return (
    <div className="p-8 w-full max-w-6xl mx-auto  min-h-screen text-slate-200">
      {/* Search Header - Full Width Organic Input */}
      <div className="mb-12 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 tracking-tight">
          <Crown className="text-amber-400" /> Manage{" "}
          <span className="text-cyan-400">Permissions</span>
        </h2>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search email to promote..."
            className="w-full bg-slate-800/50 border-2 border-slate-700 py-4 px-12 rounded-2xl text-sm outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-4 top-4.5 text-slate-500"
            size={20}
          />
          {searchLoading && (
            <Loader2
              size={18}
              className="absolute right-4 top-4.5 animate-spin text-cyan-500"
            />
          )}
        </div>

        {/* Suggestion Card - Organic Button */}
        {searchedUser && searchedUser.role !== "admin" && (
          <div className="mt-4 p-5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-3xl flex items-center justify-between shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400">
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-white uppercase text-sm tracking-wide">
                  {searchedUser.name}
                </p>
                <p className="text-lg text-white">{searchedUser.email}</p>
              </div>
            </div>
            <button
              onClick={() => handleRoleToggle(searchedUser, "admin")}
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded-full text-xs font-black uppercase transition-all shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:-translate-y-1 active:scale-95"
            >
              Make Admin
            </button>
          </div>
        )}
      </div>

      {/* Admin Grid - Large Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingAll ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
          </div>
        ) : (
          adminList.map((admin) => (
            <div
              key={admin._id}
              className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50 flex flex-col items-center text-center group hover:bg-slate-800 transition-all hover:shadow-2xl hover:border-cyan-500/20"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform duration-500">
                  <User className="text-cyan-500" size={32} />
                </div>
                <div className="absolute -top-2 -right-2 bg-amber-500 p-1.5 rounded-full shadow-lg border-4 border-[#0f172a]">
                  <Crown size={12} className="text-black" />
                </div>
              </div>

              <h4 className="font-black text-white text-base uppercase tracking-widest mb-1">
                {admin.name}
              </h4>
              <p className="text-lg  text-white italic mb-6 flex items-center gap-1">
                <Mail size={15} /> {admin.email}
              </p>

              <button
                onClick={() => handleRoleToggle(admin, "user")}
                className="w-full py-3 bg-slate-900 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all font-bold text-xs uppercase tracking-[0.2em] border border-slate-700 flex items-center justify-center gap-2 group-hover:border-rose-500"
              >
                <ShieldAlert size={16} /> Remove Admin
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MakeAsAdmin;
