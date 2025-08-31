import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { btnPrimary, btnGhost } from '../styles/buttons';

type EmailStatus = 'sent' | 'clicked' | 'reported' | 'ignored';

interface CampaignEmail {
  userId: string;
  status: EmailStatus;
}

interface Campaign {
  _id: string;
  name: string;
  status: 'draft' | 'running' | 'completed';
  type: string;
  createdAt: string;
  users: { _id: string; name: string }[];
  emails?: CampaignEmail[];
}

interface User {
  _id: string;
  name: string;
}

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get<Campaign[]>('/campaigns'), api.get<User[]>('/users')])
      .then(([c, u]) => {
        setCampaigns(c.data);
        setUsers(u.data);
      })
      .catch((err) => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const { totalSent, totalClicks, phishRate } = useMemo(() => {
    const sent = campaigns.reduce(
      (acc, c) => acc + (c.emails?.length ?? c.users?.length ?? 0),
      0
    );
    const clicks = campaigns.reduce(
      (acc, c) =>
        acc + (c.emails?.filter((e) => e.status === 'clicked').length ?? 0),
      0
    );
    const rate = sent ? Math.round((clicks / sent) * 100) : 0;
    return { totalSent: sent, totalClicks: clicks, phishRate: rate };
  }, [campaigns]);

  const activeCount = useMemo(
    () => campaigns.filter((c) => c.status === 'running').length,
    [campaigns]
  );

  const recent = useMemo(
    () =>
      [...campaigns]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 5),
    [campaigns]
  );

  if (loading) return <div className='p-6'>Loading dashboard…</div>;

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Welcome back, Denis 👋</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <div className='rounded-xl shadow-lg p-6 bg-blue-600 text-white'>
          <div className='text-sm opacity-80 mb-2'>Total Campaigns</div>
          <div className='text-5xl font-bold'>{campaigns.length}</div>
        </div>

        <div className='rounded-xl shadow-lg p-6 bg-emerald-600 text-white'>
          <div className='text-sm opacity-80 mb-2'>Total Targets</div>
          <div className='text-5xl font-bold'>{users.length}</div>
        </div>

        <div className='rounded-xl shadow-lg p-6 bg-amber-400 text-slate-900'>
          <div className='text-sm opacity-80 mb-2'>Phish Rate</div>
          <div className='text-5xl font-extrabold'>{phishRate}%</div>
        </div>
      </div>

      <div className='flex gap-3 mb-4'>
        <Link to='/campaigns' className={btnPrimary}>
          + New Campaign
        </Link>
        <button className={btnGhost}>+ Email Template</button>
        <Link to='/users' className={btnGhost}>
          + Target List
        </Link>
      </div>

      <h2 className='text-xl font-semibold mb-3'>Recent Campaigns</h2>
      <div className='bg-white rounded-xl shadow-lg overflow-x-auto'>
        <table className='w-full text-left'>
          <thead>
            <tr className='bg-slate-50 text-slate-600 text-xs uppercase tracking-wide'>
              <th className='px-6 py-3'>Campaign Name</th>
              <th className='px-6 py-3'>Sent</th>
              <th className='px-6 py-3'>Clicks</th>
              <th className='px-6 py-3'>Reports</th>
              <th className='px-6 py-3'>Status</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {recent.map((c) => {
              const sent = c.emails?.length ?? c.users?.length ?? 0;
              const clicks =
                c.emails?.filter((e) => e.status === 'clicked').length ?? 0;
              const reports =
                c.emails?.filter((e) => e.status === 'reported').length ?? 0;

              const { label, tone } = statusBadge(c.status);
              return (
                <tr key={c._id} className='hover:bg-blue-50/40 transition'>
                  <td className='px-6 py-4 font-medium'>{c.name}</td>
                  <td className='px-6 py-4'>{sent}</td>
                  <td className='px-6 py-4'>{clicks}</td>
                  <td className='px-6 py-4'>{reports}</td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tone}`}
                    >
                      {label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {recent.length === 0 && (
              <tr>
                <td className='px-6 py-6 text-slate-500' colSpan={5}>
                  No campaigns yet. Create your first one to see stats here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='mt-6 text-sm text-slate-600'>
        Active campaigns: <strong>{activeCount}</strong> • Total sent:{' '}
        <strong>{totalSent}</strong> • Total clicks:{' '}
        <strong>{totalClicks}</strong>
      </div>
    </div>
  );
}

function statusBadge(status: Campaign['status']) {
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
