import React from 'react'

function MessageContainer() {
    return (
        <>
            MessageContainer
            <div className="w-full h-screen">
                <div className="max-w-xs bg-blue-600 ms-12 text-white px-4 py-2 rounded-xl shadow-md">
                    <div className="text-sm">
                        Hello, how are you?
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className=" opacity-75 text-sm">Suryajith</span>
                        <span className="text-xs opacity-70">12:30 PM</span>
                    </div>

                </div>

            </div>
        </>
    )
}

export default MessageContainer