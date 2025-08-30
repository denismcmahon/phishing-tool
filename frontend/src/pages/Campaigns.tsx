import { useEffect, useState } from 'react';
import { api } from '../services/api';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Campaign[]>('/campaigns')
        .then((res) => setCampaigns(res.data))
        .catch((err) => console.error('Error fetching campaigns: ', err))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-6">Loading campaigns...</p>
    
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Campaigns</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Created</th>
                            <th className="px-6 py-3">Users</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((c, idx) => (
                            <tr
                                key={c._id}
                                className={`text-gray-800 ${
                                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                } hover:bg-blue-50 transition`}
                            >
                                <td className="px-6 py-4 font-medium">{c.name}</td>
                                <td className="px-6 py-4">{c.type}</td>
                                <td className="px-6 py-4">{c.status}</td>
                                <td className="px-6 py-4">
                                    {new Date(c.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {c.users.map((u) => u.name).join(", ")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Campaigns;