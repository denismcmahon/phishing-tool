import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface User {
    _id: string;
    name: string;
}

interface Campaign {
    _id: string;
    status: string;
}

function Dashboard() {
    const [userCount, setUserCount] = useState(0);
    const [campaignCount, setCampaignCount] = useState(0);
    const [activeCampaigns, setActiveCampaigns] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get<User[]>('/users'), api.get<Campaign[]>('/campaigns')])
            .then(([usersRes, campaignsRes]) => {
                const users = usersRes.data;
                const campaigns = campaignsRes.data;

                setUserCount(users.length);
                setCampaignCount(campaigns.length);
                setActiveCampaigns(campaigns.filter((c) => c.status === 'running').length);
            })
            .catch((err) => console.error('Error fetching dashboard data: ', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-6">Loading dashboard...</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h2 className="text-gray-600 text-sm uppercase mb-2">Total Users</h2>
                    <p className="text-3xl font-bold text-blue-600">{userCount}</p>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h2 className="text-gray-600 text-sm uppercase mb-2">Total Campaigns</h2>
                    <p className="text-3xl font-bold text-blue-600">{campaignCount}</p>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h2 className="text-gray-600 text-sm uppercase mb-2">Active Campaigns</h2>
                    <p className="text-3xl font-bold text-blue-600">{activeCampaigns}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;