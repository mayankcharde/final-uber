import React, { useEffect } from 'react'
import axiosInstance from '../utils/axios'
import { useNavigate } from 'react-router-dom'

export const UserLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await axiosInstance.get('/api/users/logout')
                
                if (response.status === 200) {
                    localStorage.removeItem('token')
                    navigate('/login')
                }
            } catch (error) {
                console.error('Logout error:', error)
                // If there's an error, still clear local storage and redirect
                localStorage.removeItem('token')
                navigate('/login')
            }
        }
        
        logout()
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Logging out...</p>
            </div>
        </div>
    )
}

export default UserLogout