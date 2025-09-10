import { Users } from 'lucide-react'
import React, { useState, useMemo } from 'react'

const AdminPage2 = () => {
    const [searchQuery, setSearchQuery] = useState(''); // Initial state should be an empty string to avoid errors
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [editingUser, setEditingUser] = useState(null);

    const [users, setUsers] = useState([
        {
            id: 1,
            email: 'aayush@gmail.com',
            role: 'moderator',
            skills: ['javascript', 'nextjs', 'react'],
            status: 'active'
        },
        {
            id: 2,
            email: 'aayush@gmail.com',
            role: 'moderator',
            skills: [],
            status: 'inactive'
        },
        {
            id: 3,
            email: 'aayush@gmail.com',
            role: 'moderator',
            skills: ['python', 'pytorch', 'django', 'numpy'],
            status: 'active'
        }
    ]);

    const filterUsers = useMemo(() => {
        const filter = users.filter(user => {
            const search = searchQuery.toLowerCase();
            const matchedUser = user.email.toLowerCase().includes(search) || user.skills.some(skill => skill.toLowerCase().includes(search))
            const matchedRole = filterRole === "all" || user.role === filterRole
            const matchedStatus = filterStatus === "all" || user.status === filterStatus

            return matchedUser && matchedRole && matchedStatus
        })
        return filter;
    }, [users, searchQuery, filterRole, filterStatus,]);

    const handleEditUser = (user) => {
        setEditingUser(
            {
                ...user,
                skillsText: user.skills.join(', ')
            }
        )
    };

    const handleSaveUser = () => {
        const updatedUser = users.map(user => user.id === editingUser.id ? {
            ...editingUser,
            skills: editingUser.skillsText.split(',')
                .map(skill => skill.trim.filter(skill => skill))
        } : user);
        setUsers(updatedUser);
        setEditingUser(null);
    };

    const handleDeleteUser = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const toogle

    return (
        <div>AdminPage2</div>
    )
}

export default AdminPage2