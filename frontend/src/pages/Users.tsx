import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { btnPrimary, btnDanger, btnGhost } from '../styles/buttons';

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
}

const DEPARTMENTS = [
  'Engineering',
  'IT',
  'Finance',
  'HR',
  'Marketing',
  'Sales',
  'Operations',
  'Legal',
];

const inputStyles =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ' +
  'focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // modal + form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api
      .get<User[]>('/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setDepartment('');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post<User>('/users', { name, email, department })
      .then((res) => {
        setUsers((prev) => [...prev, res.data]);
        resetForm();
        setIsModalOpen(false); // ✅ close (don’t toggle)
      })
      .catch((err) => console.error('Error adding user:', err));
  };

  const handleDeleteUser = (id: string) => {
    api
      .delete(`/users/${id}`)
      .then(() => setUsers((prev) => prev.filter((u) => u._id !== id)))
      .catch((err) => console.error('Error deleting user:', err));
  };

  if (loading) return <p className='p-6'>Loading users…</p>;

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      {/* Page header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Users</h1>
        <button onClick={() => setIsModalOpen(true)} className={btnPrimary}>
          + Add User
        </button>
      </div>

      {/* Card table */}
      <div className='bg-white rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-left'>
          <thead>
            <tr className='bg-slate-50 text-slate-600 text-xs uppercase tracking-wide'>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Email</th>
              <th className='px-6 py-3'>Department</th>
              <th className='px-6 py-3 w-24'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {users.map((u) => (
              <tr key={u._id} className='hover:bg-blue-50/40 transition'>
                <td className='px-6 py-4 font-medium'>{u.name}</td>
                <td className='px-6 py-4'>{u.email}</td>
                <td className='px-6 py-4'>{u.department}</td>
                <td className='px-6 py-4'>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className={`${btnDanger} text-sm px-4 py-2`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className='px-6 py-6 text-slate-500' colSpan={4}>
                  No users yet. Click “Add User” to create your first target.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        title='Add New User'
      >
        <form onSubmit={handleAddUser} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Name</label>
            <input
              className={inputStyles}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Ada Lovelace'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Email</label>
            <input
              type='email'
              className={inputStyles}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='ada@example.com'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Department</label>
            <select
              className={inputStyles}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value='' disabled>
                Select a department
              </option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={() => {
                resetForm();
                setIsModalOpen(false);
              }}
              className={btnGhost}
            >
              Cancel
            </button>
            <button type='submit' className={btnPrimary}>
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
