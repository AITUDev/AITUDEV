"use client"

import { useState, useEffect } from 'react';
import { KeyRound, Shield, UserPlus, Trash2, Check, Lock, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/app/dashboard/authCheck';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountRole?: 'admin' | 'lead' | 'member';
  status: 'active' | 'inactive' | 'away';
  skills?: string[];
  bio?: string;
  avatar?: { url: string };
  createdAt?: string;
}

export function TeamAccountsManager() {
  const { user, refreshUser } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [accountRole, setAccountRole] = useState<'admin' | 'lead' | 'member'>('member');
  const [password, setPassword] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile Change Password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passSubmitting, setPassSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/team-members');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMembers(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('role', roleTitle || 'Team Member');
      formData.append('accountRole', accountRole);
      formData.append('password', password);
      formData.append('bio', bio);
      formData.append('status', 'active');

      const skills = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
      formData.append('skills', JSON.stringify(skills));

      const res = await fetch('/api/team-members', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Team member account created successfully!' });
        setShowAddModal(false);
        resetForm();
        fetchMembers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create account' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Unexpected error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePasswordOrRole = async (memberId: string, newPassword?: string, newRole?: string) => {
    try {
      const formData = new FormData();
      formData.append('id', memberId);
      if (newPassword) formData.append('password', newPassword);
      if (newRole) formData.append('accountRole', newRole);

      const res = await fetch('/api/team-members', {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Member account updated successfully' });
        fetchMembers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Update failed' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Connection error' });
    }
  };

  const handleChangeOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Your password has been updated successfully' });
        setCurrentPass('');
        setNewPass('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setPassSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRoleTitle('');
    setAccountRole('member');
    setPassword('');
    setSkillsStr('');
    setBio('');
  };

  return (
    <div className="space-y-6">
      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-md border flex items-center justify-between text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-semibold hover:underline">
            Close
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{members.length}</h3>
              <p className="text-xs text-gray-500 mt-1">Each member has an account</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <UserCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admin Accounts</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {members.filter((m) => m.accountRole === 'admin' || m.role?.toLowerCase().includes('admin')).length || 1}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Full management access</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Logged in user</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">{user?.name}</h3>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold uppercase">
                {user?.role}
              </span>
            </div>
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-lg">
              <KeyRound className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Member Accounts Table */}
      <Card className="bg-white border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">Team Accounts & Roles</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Manage team member login emails, role permissions, and passwords.
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Member Account
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Loading member accounts...</div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No members added yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700 border-b">
                  <tr>
                    <th className="p-4 font-semibold">Member</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Role Title</th>
                    <th className="p-4 font-semibold">Account Role</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {members.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                            {member.avatar?.url ? (
                              <img src={member.avatar.url} alt={member.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              member.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{member.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{member.email}</td>
                      <td className="p-4 text-gray-600">{member.role}</td>
                      <td className="p-4">
                        <select
                          value={member.accountRole || 'member'}
                          onChange={(e) => handleUpdatePasswordOrRole(member._id, undefined, e.target.value)}
                          className="bg-white border rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="member">Member</option>
                          <option value="lead">Lead</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          {member.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newP = prompt(`Enter new password for ${member.name}:`);
                            if (newP && newP.trim().length >= 4) {
                              handleUpdatePasswordOrRole(member._id, newP.trim());
                            }
                          }}
                          className="h-8 text-xs"
                        >
                          <KeyRound className="h-3.5 w-3.5 mr-1 text-blue-600" />
                          Set Password
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password Card for Logged In User */}
      <Card className="bg-white border shadow-sm p-6">
        <CardHeader className="p-0 pb-4 border-b mb-4">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-700" />
            Change Your Password ({user?.name})
          </CardTitle>
          <CardDescription className="text-gray-500 text-xs">
            Update your account password anytime for security.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleChangeOwnPassword} className="max-w-md space-y-4 text-sm">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Current password"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="New password (min 6 chars)"
            />
          </div>
          <Button type="submit" disabled={passSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2">
            {passSubmitting ? 'Updating...' : 'Update My Password'}
          </Button>
        </form>
      </Card>

      {/* Create Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                Create New Member Account
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Ahmed Ali"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="ahmed@aitudev.org"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Fullstack Developer"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Account Role</label>
                  <select
                    value={accountRole}
                    onChange={(e: any) => setAccountRole(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="member">Member</option>
                    <option value="lead">Lead</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Initial password for member"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="React, Node.js, Python"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  {submitting ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
