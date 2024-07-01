import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', isAdmin: false });
    const [editUser, setEditUser] = useState(null); 

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:3000/getUsers')
            .then(response => setUsers(response.data))
            .catch(error => console.log(error));
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/post', newUser)
            .then(response => {
                setUsers([...users, response.data]);
                setNewUser({ username: '', email: '', password: '', isAdmin: false });
            })
            .catch(error => console.error(error));
    };

    const handleDeleteUser = (id) => {
        axios.delete(`http://localhost:3000/users/${id}`)
            .then(response => {
                setUsers(users.filter(user => user._id !== id));
                if (editUser && editUser._id === id) {
                    setEditUser(null); 
                }
            })
            .catch(error => console.error(error));
    };

    const handleUpdateUser = (id) => {
        const updatedUser = users.find(user => user._id === id);
        setEditUser(updatedUser);
        setNewUser({
            username: updatedUser.username,
            email: updatedUser.email,
            password: '', 
            isAdmin: updatedUser.isAdmin,
        });
    };

    const handleSaveUpdate = () => {
        axios.put(`http://localhost:3000/users/${editUser._id}`, {
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        }).then(response => {
            const updatedUsers = users.map(user =>
                user._id === editUser._id ? { ...user, username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin } : user
            );
            setUsers(updatedUsers);
            setEditUser(null); 
        }).catch(error => console.error(error));
    };

    const handleLogout = () => {
      window.localStorage.clear();
      window.location.href = "./adminlogin"
    };

    return (
        <div className="admin-container">
        <button onClick={handleLogout}>Logout</button>
            <h2>User Management</h2>
            <form onSubmit={editUser ? handleSaveUpdate : handleAddUser}>
                <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
                <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                {editUser ? null : (
                    <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                )}
                <label>
                    Admin:
                    <input type="checkbox" checked={newUser.isAdmin} onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })} />
                </label>
                <button type="submit">{editUser ? 'Save Changes' : 'Add User'}</button>
                <br />
               
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => handleUpdateUser(user._id)}>Edit</button>
                                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;
