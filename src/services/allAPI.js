import commonAPI from "./commonAPI"
import serverURL from "./serverURL"

// ---------------common----------------
export const getFreelancerAPI = async (reqHeader) => {
    return await commonAPI("POST", `${serverURL}/getFreelancer`, {}, reqHeader)
}


//register
export const registerAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/register`, reqBody)
}
export const loginAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/login`, reqBody)
}
export const editUserAPI = async (reqBody, reqHeader) => {
    return await commonAPI("PUT", `${serverURL}/edit-client`, reqBody, reqHeader)
}
export const sendCodeAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/sendCode`, reqBody)
}
export const verifyCodeAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/verifyCode`, reqBody)
}
export const resetPasswordAPI = async (reqBody) => {
    return await commonAPI("PUT", `${serverURL}/resetPassword`, reqBody)
}

export const getClientProjectsAPI = async (reqHeader) => {
    return await commonAPI('GET', `${serverURL}/getProjects`, {}, reqHeader)
}

// -------------------- Freelancer --------------------

//Get All Projects
export const getAllProjectsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/allProjects`, {}, reqHeader)
}
export const deleteFreelancerProjectAPI = async (projectId) => {
    return await commonAPI("DELETE", `${serverURL}/deleteFreelancerProject/${projectId}`);
};
export const deleteFreelancerClientAPI = async (clientId) => {
    return await commonAPI("DELETE", `${serverURL}/deleteFreelancerClient/${clientId}`);
};

export const allFreelancerPaymentsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/allFreelancerPayments`, {}, reqHeader)
}
export const updateFreelancerAPI = async (reqBody, reqHeader) => {
    return await commonAPI("PUT", `${serverURL}/updateFreelancer`, reqBody, reqHeader)
}
//Get All Clients
export const getAllClientsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/allclients`, {}, reqHeader)
}
export const addClientAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/addClient`, reqBody, reqHeader)
}
export const addProjectAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/add-Project`, reqBody, reqHeader)
}
export const addClientProjectAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/addProject`, reqBody, reqHeader)
}
export const updateFreelancerProjectAPI = async (projectId, reqBody, reqHeader) => {
    return await commonAPI("PUT", `${serverURL}/updateProject/${projectId}`, reqBody, reqHeader)
}



//-------------------- Stripe Payment --------------------
export const getClientPaymentsAPI = async (reqHeader) => {
    return await commonAPI('GET', `${serverURL}/getPayments`, {}, reqHeader);
};
export const makePaymentAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/make-payemnt`, reqBody, reqHeader)
}
export const updatePaymentStatusAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/updatePaymentStatus`, reqBody)
}
export const updateTransactionIdAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/updateTransactionId`, reqBody)
}




//-------------------- Stripe Payment --------------------
export const adminGetAllFreelancersAPI = async (reqHeader) => {
    return await commonAPI('GET', `${serverURL}/admin/allFreelancers`, {}, reqHeader)
}
export const editAdminAPI = async (reqBody, reqHeader) => {
    return await commonAPI('PUT', `${serverURL}/admin/editAdmin`, reqBody, reqHeader)
}
export const deleteFreelancerAPI = async (freelancerId, reqHeader) => {
    return await commonAPI('PUT', `${serverURL}/admin/deleteFreelancer/${freelancerId}`, {}, reqHeader)
}
export const adminGetAllPaymentsAPI = async (reqHeader) => {
    return await commonAPI('GET', `${serverURL}/admin/allPayments`, {}, reqHeader)
}
export const deletePaymentAPI = async (freelancerId, reqHeader) => {
    return await commonAPI('PUT', `${serverURL}/admin/deleteFreelancer/${freelancerId}`, {}, reqHeader)
}
