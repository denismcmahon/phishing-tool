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
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Department</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{u.name}</td>
                            <td className="py-2 px-4">{u.email}</td>
                            <td className="py-2 px-4">{u.department}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;