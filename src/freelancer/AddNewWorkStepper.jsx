import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { addClientProjectAPI, sendCodeAPI } from '../services/allAPI';
import { toast } from "react-toastify"

function AddNewWorkStepper({ setShowModal }) {
    const [stepCount, setStepCount] = useState(0);

    const [clientData, setClientData] = useState({
        freelancerMail: "",
        clientName: "",
        clientMail: "",
        clientPhone: "",
        projectName: "",
        projectStatus: "",
        projectDeadline: "",
        projectAmount: "",
        projectDescription: ""
    });


    const handleNextStep = () => {
        if (stepCount === 0 && (!clientData.clientMail || !clientData.clientPhone || !clientData.clientName)) {
            alert("Please fill all client details!");
            return;
        }
        if (stepCount === 1 && (!clientData.projectName || !clientData.projectStatus || !clientData.projectDeadline || !clientData.projectAmount)) {
            alert("Please fill all project details!");
            return;
        }
        stepCount < 2 && setStepCount(stepCount + 1);
    };

    const handlePrevStep = () => {
        stepCount > 0 && setStepCount(stepCount - 1);
    };

    const loggedUser = sessionStorage.getItem('loggedUserDetails')
    const userToken = sessionStorage.getItem("token");
    const reqHeader = { Authorization: `Bearer ${userToken}` };

    const handleSubmit = async () => {
        try {
            if (loggedUser && userToken) {
                const result = await addClientProjectAPI(clientData, reqHeader)
                console.log(result.status)
                if (result.status == 200) {
                    const res = await sendCodeAPI({ email: clientData.clientMail })
                    console.log(res.data);
                    if (res.status == 200) {
                        toast.success('Client Registered Successfully and Verification Code has been Send');
                        setShowModal(false)

                    }

                } else if (result.status == 404) {
                    toast.warn('Client Already Exist. Add Project from Project Panel');
                    setShowModal(false)
                } else if (result.status == 500) {
                    toast.warn('An Error Occoured from Our End. Try Again After Sometime');
                    setShowModal(false)
                }
            }
        } catch (error) {
            toast.warn('An Error Occoured from Our End. Try Again After Sometime');
            setShowModal(false)
        }
    };

    return (
        <>
            {/* Step Indicator */}
            <div className="flex justify-center items-center mb-4 gap-3">
                {[0, 1, 2].map((step) => (
                    <div key={step}
                        className={`p-2 flex items-center justify-center rounded-full 
                        ${step === stepCount ?
                                "bg-blue-600 text-white text-3xl w-10 h-10"
                                : "bg-gray-300 w-7 h-7"}`}>
                        {step + 1}
                    </div>
                ))}
            </div>

            <form className="grid grid-cols-1 gap-4 overflow-hidden">

                <AnimatePresence mode="wait">
                    {stepCount === 0 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="p-2 flex flex-col gap-3"
                        >
                            <input type="text" value={clientData.clientName} onChange={(e) => setClientData({ ...clientData, clientName: e.target.value })} placeholder="Client Name" className="p-2 text-black placeholder-gray-700/75 border border-gray-400 rounded-xl" />
                            <input type="clientMail" value={clientData.clientMail} onChange={(e) => setClientData({ ...clientData, clientMail: e.target.value })} placeholder="Client clientMail" className="p-2 text-black placeholder-gray-700/75 border border-gray-400 rounded-xl" />
                            <input type="text" value={clientData.clientPhone} onChange={(e) => setClientData({ ...clientData, clientPhone: e.target.value })} placeholder="Contact Number" className="p-2 text-black placeholder-gray-700/75 border border-gray-400 rounded-xl" />
                        </motion.div>
                    )}

                    {stepCount === 1 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="p-2 flex flex-col gap-3"
                        >
                            <input type="text" value={clientData.projectName} onChange={(e) => setClientData({ ...clientData, projectName: e.target.value })} placeholder="Project Name" className="p-2 text-black placeholder-gray-700/75 border border-gray-400 rounded-xl" />
                            <select value={clientData.projectStatus} onChange={(e) => (setClientData({ ...clientData, projectStatus: e.target.value }), console.log(clientData))} name="S" id="" className="p-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400">
                                <option value="" disabled className="text-gray-500">
                                    Select Project Status
                                </option>
                                <option value="Planning / Starting Soon" className="text-gray-700">
                                    Planning / Starting Soon
                                </option>
                                <option value="Active / Project Started" className="text-gray-700">
                                    Active / Project Started
                                </option>
                                <option value="In Development" className="text-gray-700">
                                    In Development
                                </option>
                                <option value="Under Review" className="text-gray-700">
                                    Under Review
                                </option>
                                <option value="Completed" className="text-gray-700">
                                    Completed
                                </option>
                                <option value="On Hold" className="text-gray-700">
                                    On Hold
                                </option>
                                <option value="Cancelled" className="text-gray-700">
                                    Cancelled
                                </option>
                            </select>
                            <input type="date" value={clientData.projectDeadline} onChange={(e) => setClientData({ ...clientData, projectDeadline: e.target.value })} className="p-2 text-black placeholder-gray-700/75 border border-gray-400 rounded-xl" />
                            <input type="number" value={clientData.projectAmount} onChange={(e) => setClientData({ ...clientData, projectAmount: e.target.value })} placeholder="Project Amount" className="p-2 text-black placeholder-gray-700/75 border border-gray-400 rounded-xl" />
                        </motion.div>
                    )}

                    {stepCount === 2 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="p-2"
                        >
                            <textarea rows={8} value={clientData.projectDescription}
                                onChange={(e) => setClientData({ ...clientData, projectDescription: e.target.value })}
                                placeholder="Project Description"
                                className="p-2 text-black placeholder-gray-700/75 border border-gray-400 rounded-xl w-full resize-none"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Buttons */}
                <div className='flex justify-center mt-12'>
                    <div className="flex justify-between mt-4 bottom-5 px-5 absolute w-full">
                        <button type="button" onClick={handlePrevStep} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg" disabled={stepCount === 0}>
                            Previous
                        </button>

                        {stepCount < 2 ? (
                            <button type="button" onClick={handleNextStep} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                Next
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                Submit
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
}

export default AddNewWorkStepper;
