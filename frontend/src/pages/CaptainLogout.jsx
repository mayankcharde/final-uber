import React, { useEffect } from 'react'
import axiosInstance from '../utils/axios'
import { useNavigate } from 'react-router-dom'

export const CaptainLogout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                // Get the captain token
                const token = localStorage.getItem('captain-token')
                
                // Only try to call the API if we have a token
                if (token) {
                    const response = await axiosInstance.get('/api/captains/logout')
                    
                    if (response.status === 200) {
                        localStorage.removeItem('captain-token')
                        navigate('/captain-login')
                    }
                } else {
                    // No token found, just redirect
                    navigate('/captain-login')
                }
            } catch (error) {
                console.error('Captain logout error:', error)
                // If there's an error, still clear local storage and redirect
                localStorage.removeItem('captain-token')
                navigate('/captain-login')
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

export default CaptainLogout