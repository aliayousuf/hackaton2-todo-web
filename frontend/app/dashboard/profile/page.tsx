'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        name: user.email?.split('@')[0] || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would update the user profile
    console.log('Updating profile:', formData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="card">
          <div className="p-6 sm:p-8 flex justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-20 px-10">
      <div className="mb-8 space-y-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-50 break-words">User Profile</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed break-words">Personal details and account information</p>
      </div>

      <div className="glass-card p-6 sm:p-8">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-base w-full bg-slate-700/50 border border-white/20 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-base w-full bg-slate-700/50 border border-white/20 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-400"
                  readOnly
                />
                <p className="mt-2 text-sm text-slate-400">Email cannot be changed</p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-10 pt-20">
            <div className="bg-slate-900/50 p-6 rounded-xl">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium text-slate-400">Full Name</h4>
                <div className="text-base text-slate-50 break-words">{formData.name}</div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium text-slate-400">Email Address</h4>
                <div className="text-base text-slate-50 break-words">{formData.email}</div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium text-slate-400">Account Status</h4>
                <div className="text-base text-slate-50 break-words">Active</div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-slate-800 text-white border border-indigo-500/50 px-4 py-2 rounded-lg hover:bg-slate-700 w-fit"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}