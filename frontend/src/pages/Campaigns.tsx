import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { btnPrimary, btnDanger, btnGhost } from '../styles/buttons';

type CampaignStatus = 'draft' | 'running' | 'completed';

interface User {
  _id: string;
  name: string;
}

interface Campaign {
  _id: string;
  name: string;
  type: 'invoice' | 'password-reset' | 'hr-alert';
  status: CampaignStatus;
  createdAt: string;
  users: { _id: string; name: string }[];
  template?: { _id: string; name: string };
}

interface Template {
  _id: string;
  name: string;
}

const inputStyles =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400';

function statusBadge(status: CampaignStatus) {
  switch (status) {
    case 'running':
      return { label: 'Ongoing', tone: 'bg-amber-100 text-amber-700' };
    case 'completed':
      return { label: 'Done', tone: 'bg-emerald-100 text-emerald-700' };
    case 'draft':
    default:
      return { label: 'Draft', tone: 'bg-slate-100 text-slate-700' };
  }
}

function typeLabel(t: Campaign['type']) {
  if (t === 'invoice') return 'Invoice Scam';
  if (t === 'password-reset') return 'Password Reset';
  return 'HR Alert';
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<Campaign['type']>('invoice');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [template, setTemplate] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<Campaign[]>('/campaigns'),
      api.get<User[]>('/users'),
      api.get<Template[]>('/templates'),
    ])
      .then(([campaignResponse, userRespone, templateResponse]) => {
        setCampaigns(campaignResponse.data);
        setUsers(userRespone.data);
        setTemplates(templateResponse.data);
      })
      .catch((err) => console.error('Error fetching data:', err))
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
        template,
      })
      .then((res) => {
        setCampaigns((prev) => [...prev, res.data]);
        resetForm();
        setIsModalOpen(false);
      })
      .catch((err) => console.error('Error adding campaign:', err));
  };

  const handleSendCampaign = (id: string) => {
    api
      .post(`/campaigns/${id}/send`)
      .then(() => alert('Emails sent (check Ethereal inbox)'))
      .catch((err) => console.error('Error sending campaign:', err));
  };

  const handleDeleteCampaign = (id: string) => {
    api
      .delete(`/campaigns/${id}`)
      .then(() => setCampaigns((prev) => prev.filter((c) => c._id !== id)))
      .catch((err) => console.error('Error deleting campaign:', err));
  };

  const recentSorted = useMemo(
    () =>
      [...campaigns].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      ),
    [campaigns]
  );

  if (loading) return <p className='p-6'>Loading campaigns…</p>;

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Campaigns</h1>
        <button onClick={() => setIsModalOpen(true)} className={btnPrimary}>
          + New Campaign
        </button>
      </div>

      <div className='bg-white rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-left'>
          <thead>
            <tr className='bg-slate-50 text-slate-600 text-xs uppercase tracking-wide'>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Type</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3'>Created</th>
              <th className='px-6 py-3'>Users</th>
              <th className='px-6 py-3'>Template</th>
              <th className='px-6 py-3 w-28'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {recentSorted.map((c) => {
              const badge = statusBadge(c.status as CampaignStatus);
              return (
                <tr key={c._id} className='hover:bg-blue-50/40 transition'>
                  <td className='px-6 py-4 font-medium'>{c.name}</td>
                  <td className='px-6 py-4'>{typeLabel(c.type)}</td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.tone}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4'>
                    {c.users?.map((u) => u.name).join(', ') || '—'}
                  </td>
                  <td className='px-6 py-4'>{c.template?.name || '—'}</td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleSendCampaign(c._id)}
                        className={`${btnPrimary} text-sm px-4 py-2`}
                      >
                        Send
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(c._id)}
                        className={`${btnDanger} text-sm px-4 py-2`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {campaigns.length === 0 && (
              <tr>
                <td className='px-6 py-6 text-slate-500' colSpan={6}>
                  No campaigns yet. Click “New Campaign” to create one.
                </td>
              </tr>
            )}
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
            <label className='block text-sm font-medium mb-1'>Name</label>
            <input
              className={inputStyles}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Quarterly Security Test'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Type</label>
            <select
              className={inputStyles}
              value={type}
              onChange={(e) => setType(e.target.value as Campaign['type'])}
            >
              <option value='invoice'>Invoice Scam</option>
              <option value='password-reset'>Password Reset</option>
              <option value='hr-alert'>HR Alert</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Select Targets
            </label>
            <div className='border border-slate-300 rounded-md p-2 max-h-48 overflow-y-auto bg-white'>
              {users.map((u) => (
                <label
                  key={u._id}
                  className='flex items-center gap-2 py-1 px-1 rounded hover:bg-slate-50'
                >
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
                  <span className='text-sm'>{u.name}</span>
                </label>
              ))}
              {users.length === 0 && (
                <div className='text-sm text-slate-500 px-1 py-2'>
                  No users available.
                </div>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Template</label>
            <select
              className='w-full border p-2 rounded bg-white'
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              required
            >
              <option value='' disabled>
                Select a template
              </option>
              {templates.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
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
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
