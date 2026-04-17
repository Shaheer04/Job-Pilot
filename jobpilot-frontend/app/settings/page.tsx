"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { User, Mail, Shield, Bell, Trash2, Save } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import api from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useUIStore();
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user profile info
    api.get("/auth/profile/")
      .then(res => {
        setFormData({
          username: res.data.username,
          email: res.data.email
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch user:", err);
        setIsLoading(false);
      });
  }, [router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/auth/profile/", formData);
      showToast("Profile settings updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you SURE you want to delete your account? This will permanently remove all your data and cannot be undone.")) {
      try {
        await api.delete("/auth/profile/");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        showToast("Account deleted successfully");
        router.push("/login");
      } catch (err) {
        console.error("Failed to delete account:", err);
        showToast("Failed to delete account");
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-surface custom-scrollbar">
        <TopNav showSearch={false} />
        
        <div className="p-8 max-w-4xl mx-auto w-full space-y-12 py-12">
          <header>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Account Settings</h1>
            <p className="text-on-surface-variant font-medium text-sm">Manage your profile and account status.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Navigation Tabs */}
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                <User size={16} />
                Profile
              </button>
            </div>

            {/* Settings Form */}
            <div className="md:col-span-2 space-y-10">
              {/* Profile Section */}
              <section className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 space-y-6">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <User size={14} className="text-indigo-500" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest ml-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 text-zinc-600" size={16} />
                      <input 
                        type="text" 
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        disabled={isLoading}
                        className="w-full bg-zinc-950 border border-outline-variant/20 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-zinc-600" size={16} />
                      <input 
                        type="email" 
                        value={formData.email}
                        readOnly
                        className="w-full bg-zinc-950/50 border border-outline-variant/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-500 outline-none cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-600 italic ml-1">Email address is linked to your account and cannot be changed.</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving || isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Save size={14} />
                    {isSaving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="bg-error/5 border border-error/20 p-8 rounded-2xl space-y-4">
                <h3 className="text-xs font-black text-error uppercase tracking-[0.2em] flex items-center gap-2">
                  <Trash2 size={14} />
                  Danger Zone
                </h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Permanently delete your account and all your tracked jobs. This action cannot be undone.
                </p>
                <button 
                  onClick={handleDelete}
                  className="px-6 py-2.5 border border-error text-error text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-error hover:text-white transition-all"
                >
                  Delete Account
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
