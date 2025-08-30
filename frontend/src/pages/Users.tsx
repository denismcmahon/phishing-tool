import { useEffect, useState } from 'react';
import { api } from "../services/api";

interface User {
    _id: string;
    name: string;
    email: string;
    department: string;
}

function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("API instance:", api);
        api.get<User[]>('/users')
            .then((res) => setUsers(res.data))
            .catch((err) => console.error('Error fetching users: ', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-6">Loading users...</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Users</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Department</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, idx) => (
                    <tr
                        key={u._id}
                        className={`text-gray-800 ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50 transition`}
                    >
                        <td className="px-6 py-4 font-medium">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">{u.department}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
    );
}

export default Users;