import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../utils/axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const submitHander = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await axiosInstance.get('/api/rides/start-ride', {
                params: {
                    rideId: props.ride._id,
                    otp: otp
                }
            })

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: props.ride } })
            }
        } catch (error) {
            console.error('Error starting ride:', error);
            setError(error.response?.data?.message || 'Failed to start ride. Please try again.');
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex flex-col min-h-[60vh]">
            <div className="flex-1">
                <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                    props.setRidePopupPanel(false)
                }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
                <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>
                <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4'>
                    <div className='flex items-center gap-3 '>
                        <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                        <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                    </div>
                    <h5 className='text-lg font-semibold'>2.2 KM</h5>
                </div>
                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="ri-map-pin-user-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 pt-5 pb-3 mt-auto bg-white">
                <form onSubmit={submitHander}>
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    <input 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        type="text" 
                        className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mb-3' 
                        placeholder='Enter OTP'
                        disabled={loading}
                    />

                    <button 
                        type="submit"
                        disabled={loading}
                        className='w-full text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Starting Ride...' : 'Confirm'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => {
                            props.setConfirmRidePopupPanel(false)
                            props.setRidePopupPanel(false)
                        }} 
                        className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp