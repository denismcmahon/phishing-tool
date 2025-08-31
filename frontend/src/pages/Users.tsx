import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';

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

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
      .catch((err) => console.error('Error fetching users: ', err))
      .finally(() => setLoading(false));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post<User>('/users', { name, email, department })
      .then((res) => {
        setUsers([...users, res.data]);
        setName('');
        setEmail('');
        setDepartment('');
      })
      .catch((err) => console.error('Error adding user: ', err))
      .finally(() => setIsModalOpen(!isModalOpen));
  };

  const handleDeleteUser = (id: string) => {
    api
      .delete(`/users/${id}`)
      .then(() => {
        setUsers(users.filter((u) => u._id !== id));
      })
      .catch((err) => console.error('Error deleting user: ', err));
  };

  if (loading) return <p className='p-6'>Loading users...</p>;

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>Users</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          + Add User
        </button>
      </div>

      <div className='overflow-x-auto bg-white rounded-lg shadow-lg'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-100 text-gray-700 text-sm uppercase tracking-wider'>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Email</th>
              <th className='px-6 py-3'>Department</th>
              <th className='px-6 py-3'></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr
                key={u._id}
                className={`text-gray-800 ${
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50 transition`}
              >
                <td className='px-6 py-4 font-medium'>{u.name}</td>
                <td className='px-6 py-4'>{u.email}</td>
                <td className='px-6 py-4'>{u.department}</td>
                <td className='px-6 py-4'>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Add New User'
      >
        <form onSubmit={handleAddUser} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              className='w-full border p-2 rounded'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              className='w-full border p-2 rounded'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Department
            </label>
            <select
              className='w-full border p-2 rounded bg-white'
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
          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={() => setIsModalOpen(false)}
              className='px-4 py-2 rounded border border-gray-300 hover:bg-gray-100'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Users;
