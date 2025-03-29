import React from 'react'

const LookingForDriver = (props) => {
    return (
        <div className="flex flex-col min-h-[60vh]">
            <div className="flex-1">
                <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                    props.setVehicleFound(false)
                }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
                <h3 className='text-2xl font-semibold mb-5'>Looking for a Driver</h3>

                <div className='flex gap-2 justify-between flex-col items-center'>
                    <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                    <div className='w-full mt-5'>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="ri-map-pin-user-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{props.fare[ props.vehicleType ]} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center mt-8 mb-4">
                    <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-center text-gray-600">Please wait while we find a driver for you...</p>
            </div>
            
            <div className="sticky bottom-0 pt-5 pb-3 mt-auto bg-white">
                <button 
                    onClick={() => {
                        props.setVehicleFound(false);
                    }}
                    className='w-full bg-red-600 text-white font-semibold p-3 rounded-lg text-lg'
                >
                    Cancel Request
                </button>
            </div>
        </div>
    )
}

export default LookingForDriver