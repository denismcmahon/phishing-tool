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

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        api
            .get<User[]>('/users')
            .then((res) => setUsers(res.data))
            .catch((err) => console.error('Error fetching users: ', err))
            .finally(() => setLoading(false));
    }

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
            .catch((err) => console.error('Error adding user: ', err));
    }

    const handleDeleteUser = (id: string) => {
        api
            .delete(`/users/${id}`)
            .then(() => {
                setUsers(users.filter((u) => u._id !== id));
            })
            .catch((err) => console.error('Error deleting user: ', err));
    }

    if (loading) return <p className="p-6">Loading users...</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Users</h1>

            <form
                onSubmit={handleAddUser}
                className="mb-6 p-4 bg-white shadow-md rounded-lg flex space-x-4"
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
                    <label className="block text-sm text-gray-600">Email</label>
                    <input 
                        type="email" 
                        className="border p-2 rounded w-64"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Department</label>
                    <input 
                        className="border p-2 rounded w-40"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add User
                </button>
            </form>

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
                        <td className="px-6 py-4">
                            <button
                                onClick={() => handleDeleteUser(u._id)}
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

export default Users;