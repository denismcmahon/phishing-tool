import { useEffect, useState } from 'react';
import { api } from '../services/api';

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

    const handleAddCampaign = (e: React.FormEvent) => {
        e.preventDefault();
        api
            .post<Campaign>('/campaigns', {
                name,
                type,
                users: selectedUsers
            })
            .then((res) => {
                setCampaigns([...campaigns, res.data]);
                setName('');
                setType('invoice')
                setSelectedUsers([]);
            })
            .catch((err) => console.error('Error adding campaign: ', err));
    };

    const handleDeleteCampaign = (id: string) => {
        api
            .delete(`/campaigns/${id}`)
            .then(() => {
                setCampaigns(campaigns.filter((c) => c._id !== id));
            })
            .catch((err) => console.error('Error deleting campaign: ', err));
    }

    if (loading) return <p className="p-6">Loading campaigns...</p>
    
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Campaigns</h1>

            <form
                onSubmit={handleAddCampaign}
                className="mb-6 p-4 bg-white shadow-md rounded-lg flex flex-wrap gap-4 items-end"
            >
                <div>
                    <label className="block text-sm text-gray-600">Name</label>
                    <input 
                        className="border p-2 rounded w-48"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600">Type</label>
                    <select
                        className="border p-2 w-40"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="invoice">Invoice Scam</option>
                        <option value="password-reset">Password Reset</option>
                        <option value="hr-alert">HR Alert</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Users</label>
                    <div className="border p-2 rounded w-64 max-h-32 overflow-y-auto bg-white">
                        {users.map((u) => (
                        <label key={u._id} className="flex items-center space-x-2 mb-1">
                            <input
                            type="checkbox"
                            value={u._id}
                            checked={selectedUsers.includes(u._id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, u._id]);
                                } else {
                                setSelectedUsers(selectedUsers.filter((id) => id !== u._id));
                                }
                            }}
                            className="form-checkbox text-blue-600"
                            />
                            <span>{u.name}</span>
                        </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Campaign
                </button>
            </form>

            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Created</th>
                            <th className="px-6 py-3">Users</th>
                            <th className="px-6 py-3"></th>
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
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDeleteCampaign(c._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
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