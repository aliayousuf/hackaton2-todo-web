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
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 break-words">User Profile</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed break-words">Personal details and account information</p>
      </div>

      <div className="card">
        <div className="p-6 sm:p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-base w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-base w-full"
                    readOnly
                  />
                  <p className="mt-2 text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                <div className="text-base text-gray-900 break-words">{formData.name}</div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                <div className="text-base text-gray-900 break-words">{formData.email}</div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Account Status</h4>
                <div className="text-base text-gray-900 break-words">Active</div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}