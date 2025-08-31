import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';

interface User {
  _id: string;
  name: string;
}

interface Campaign {
  _id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  users: { _id: string; name: string }[];
}

function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('invoice');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([api.get<Campaign[]>('/campaigns'), api.get<User[]>('/users')])
      .then(([campaignsRes, usersResponse]) => {
        setCampaigns(campaignsRes.data);
        setUsers(usersResponse.data);
      })
      .catch((err) => console.error('Error fetching data: ', err))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setName('');
    setType('invoice');
    setSelectedUsers([]);
  };

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post<Campaign>('/campaigns', {
        name,
        type,
        users: selectedUsers,
      })
      .then((res) => {
        setCampaigns([...campaigns, res.data]);
        setName('');
        setType('invoice');
        setSelectedUsers([]);
      })
      .catch((err) => console.error('Error adding campaign: ', err))
      .finally(() => setIsModalOpen(!isModalOpen));
  };

  const handleDeleteCampaign = (id: string) => {
    api
      .delete(`/campaigns/${id}`)
      .then(() => {
        setCampaigns(campaigns.filter((c) => c._id !== id));
      })
      .catch((err) => console.error('Error deleting campaign: ', err));
  };

  if (loading) return <p className='p-6'>Loading campaigns...</p>;

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Campaigns</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          + New Campaign
        </button>
      </div>

      <div className='overflow-x-auto bg-white rounded-lg shadow-lg'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-100 text-gray-700 text-sm uppercase tracking-wider'>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Type</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3'>Created</th>
              <th className='px-6 py-3'>Users</th>
              <th className='px-6 py-3'></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, idx) => (
              <tr
                key={c._id}
                className={`text-gray-800 ${
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50 transition`}
              >
                <td className='px-6 py-4 font-medium'>{c.name}</td>
                <td className='px-6 py-4'>{c.type}</td>
                <td className='px-6 py-4'>{c.status}</td>
                <td className='px-6 py-4'>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4'>
                  {c.users.map((u) => u.name).join(', ')}
                </td>
                <td className='px-6 py-4'>
                  <button
                    onClick={() => handleDeleteCampaign(c._id)}
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
        onClose={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        title='Create New Campaign'
      >
        <form onSubmit={handleAddCampaign} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Name
            </label>
            <input
              className='w-full border p-2 rounded'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Quarterly Security Test'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Type
            </label>
            <select
              className='w-full border p-2 rounded bg-white'
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value='invoice'>Invoice Scam</option>
              <option value='password-reset'>Password Reset</option>
              <option value='hr-alert'>HR Alert</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Select Targets
            </label>
            <div className='border rounded p-2 max-h-40 overflow-y-auto bg-white'>
              {users.map((u) => (
                <label key={u._id} className='flex items-center gap-2 py-1'>
                  <input
                    type='checkbox'
                    value={u._id}
                    checked={selectedUsers.includes(u._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers((prev) => [...prev, u._id]);
                      } else {
                        setSelectedUsers((prev) =>
                          prev.filter((id) => id !== u._id)
                        );
                      }
                    }}
                  />
                  <span>{u.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={() => {
                resetForm();
                setIsModalOpen(false);
              }}
              className='px-4 py-2 rounded border border-gray-300 hover:bg-gray-100'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Campaigns;
