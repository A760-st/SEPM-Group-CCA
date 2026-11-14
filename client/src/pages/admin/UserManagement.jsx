import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useNotifications } from '../../context/NotificationContext';
import { ROLES, DEPARTMENTS } from '../../types';
import { formatDate } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  Mail,
  Building,
  Hash,
} from 'lucide-react';

export default function UserManagement() {
  const { showToast } = useNotifications();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);

  // Form states
  const [actionLoading, setActionLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    student_id_number: '',
    role: ROLES.ORGANIZER,
    department: DEPARTMENTS[0],
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchUsers = async () => {
    try {
      const res = await userService.getUsers({});
      if (res.success) setUsers(res.data);
    } catch {
      showToast('Failed to load users list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      showToast('Please provide a name and email.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await userService.createUser(newUser);
      showToast(`User account created with role ${newUser.role}.`, 'success');
      setShowCreateModal(false);
      setNewUser({
        name: '',
        email: '',
        student_id_number: '',
        role: ROLES.ORGANIZER,
        department: DEPARTMENTS[0],
      });
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to create user.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!userToEdit) return;

    setActionLoading(true);
    try {
      await userService.updateUser(userToEdit.id, {
        name: userToEdit.name,
        department: userToEdit.department,
        role: userToEdit.role,
      });
      showToast('User record updated successfully.', 'success');
      setUserToEdit(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update user.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!userToToggleStatus) return;
    setActionLoading(true);
    try {
      await userService.toggleUserStatus(userToToggleStatus.id);
      showToast(
        `User account ${userToToggleStatus.status === 'ACTIVE' ? 'deactivated' : 'activated'}.`,
        'info'
      );
      setUserToToggleStatus(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to toggle status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChangeDirect = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      showToast(`Role updated to ${newRole}.`, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update role.', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchDept = deptFilter === 'ALL' || u.department === deptFilter;
    const matchSearch =
      !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.student_id_number && u.student_id_number.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchRole && matchDept && matchSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading user directory..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Account Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit campus members, provision faculty organizer privileges, and manage security states
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={UserPlus}
          onClick={() => setShowCreateModal(true)}
        >
          Provision User Account
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card noPadding>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search by name, email, or Student ID..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Roles' },
              { value: ROLES.STUDENT, label: 'Students' },
              { value: ROLES.ORGANIZER, label: 'Organizers' },
              { value: ROLES.ADMIN, label: 'Administrators' },
            ]}
          />

          <Select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Departments' },
              ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
            ]}
          />
        </div>

        <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Found <strong>{filteredUsers.length}</strong> matching user{filteredUsers.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[11px] text-slate-400">
            Role updates are enforced across all subsequent API sessions.
          </span>
        </div>
      </Card>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <Card>
          <EmptyState
            title="No users match your filters"
            description="Try modifying search keywords or clearing role filters."
          />
        </Card>
      ) : (
        <Card noPadding className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role & Assign</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Student/Staff ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChangeDirect(u.id, e.target.value)}
                        className="text-xs font-semibold rounded border border-slate-200 bg-white py-1 px-2 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value={ROLES.STUDENT}>STUDENT</option>
                        <option value={ROLES.ORGANIZER}>ORGANIZER</option>
                        <option value={ROLES.ADMIN}>ADMIN</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {u.department}
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {u.student_id_number || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant={u.status} size="sm">
                        {u.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedUserForDetail(u)}
                      >
                        View
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => setUserToEdit(u)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant={u.status === 'ACTIVE' ? 'ghost' : 'outline'}
                        size="sm"
                        className={u.status === 'ACTIVE' ? 'text-rose-600 hover:text-rose-700' : 'text-emerald-700'}
                        onClick={() => setUserToToggleStatus(u)}
                      >
                        {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </Card>
      )}

      {/* Provision User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Provision New Campus User"
        subtitle="Administratively create accounts for faculty organizers, admins, or students"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={actionLoading}
              onClick={handleCreateUser}
            >
              Create Account
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="e.g. Dr. Arthur Vance"
          />

          <Input
            label="Institutional Email"
            type="email"
            required
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="e.g. arthur.vance@apex.edu"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned System Role"
              required
              options={[
                { value: ROLES.ORGANIZER, label: 'ORGANIZER (Faculty / Society Lead)' },
                { value: ROLES.ADMIN, label: 'ADMIN (Dean / System Staff)' },
                { value: ROLES.STUDENT, label: 'STUDENT (Enrolled Student)' },
              ]}
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            />

            <Input
              label="Student/Staff ID (Optional)"
              value={newUser.student_id_number}
              onChange={(e) => setNewUser({ ...newUser, student_id_number: e.target.value })}
              placeholder="e.g. FAC-2024-09"
            />
          </div>

          <Select
            label="Academic Department"
            options={DEPARTMENTS}
            value={newUser.department}
            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
          />
        </form>
      </Modal>

      {/* Edit User Modal */}
      {userToEdit && (
        <Modal
          isOpen={Boolean(userToEdit)}
          onClose={() => setUserToEdit(null)}
          title="Edit User Record"
          subtitle={userToEdit.email}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setUserToEdit(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={actionLoading}
                onClick={handleEditUser}
              >
                Save Updates
              </Button>
            </>
          }
        >
          <form onSubmit={handleEditUser} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={userToEdit.name}
              onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
            />

            <Select
              label="Assigned Role"
              options={[
                { value: ROLES.STUDENT, label: 'STUDENT' },
                { value: ROLES.ORGANIZER, label: 'ORGANIZER' },
                { value: ROLES.ADMIN, label: 'ADMIN' },
              ]}
              value={userToEdit.role}
              onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value })}
            />

            <Select
              label="Department"
              options={DEPARTMENTS}
              value={userToEdit.department}
              onChange={(e) => setUserToEdit({ ...userToEdit, department: e.target.value })}
            />
          </form>
        </Modal>
      )}

      {/* User Detail Modal */}
      {selectedUserForDetail && (
        <Modal
          isOpen={Boolean(selectedUserForDetail)}
          onClose={() => setSelectedUserForDetail(null)}
          title="User Account Details"
          subtitle={`User ID: ${selectedUserForDetail.id}`}
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedUserForDetail(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Legal Name:</span>
              <span className="font-bold text-slate-900">{selectedUserForDetail.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Email:</span>
              <span className="font-mono text-slate-800">{selectedUserForDetail.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Assigned Role:</span>
              <Badge variant={selectedUserForDetail.role} size="sm">
                {selectedUserForDetail.role}
              </Badge>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Department:</span>
              <span className="text-slate-800">{selectedUserForDetail.department}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Student/Staff ID:</span>
              <span className="font-mono text-slate-800">
                {selectedUserForDetail.student_id_number || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Account Status:</span>
              <Badge variant={selectedUserForDetail.status} size="sm">
                {selectedUserForDetail.status}
              </Badge>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Registered At:</span>
              <span className="text-slate-800">{formatDate(selectedUserForDetail.created_at)}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Toggle Status */}
      <ConfirmDialog
        isOpen={Boolean(userToToggleStatus)}
        onClose={() => setUserToToggleStatus(null)}
        onConfirm={handleToggleStatus}
        title={
          userToToggleStatus?.status === 'ACTIVE'
            ? 'Deactivate User Account'
            : 'Activate User Account'
        }
        message={`Are you sure you want to change the status of "${userToToggleStatus?.name}" to ${
          userToToggleStatus?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        }? Inactive accounts cannot sign in to the portal.`}
        confirmText={userToToggleStatus?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        confirmVariant={userToToggleStatus?.status === 'ACTIVE' ? 'danger' : 'primary'}
        loading={actionLoading}
      />
    </div>
  );
}
