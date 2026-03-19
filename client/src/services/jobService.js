import axiosInstance from "./apiService.js";

/* =====================================================
   Create Job
===================================================== */
export const createJob = async (jobData) => {
    try {
        const res = await axiosInstance.post("/jobs", jobData);
        return res.data.data;
    } catch (error) {
        console.error("Create Job Error:", error.response?.data || error.message);
        throw error;
    }
};


/* =====================================================
   Get All Jobs
===================================================== */
export const getAllJobs = async (params = {}) => {
    try {
        const res = await axiosInstance.get("/jobs", { params });
        // backend returns: { success, jobs, ... }
        return res.data?.jobs || [];
    } catch (error) {
        console.error("Get Jobs Error:", error.response?.data || error.message);
        throw error;
    }
};


/* =====================================================
   Get Job By ID
===================================================== */
export const getJobById = async (jobId) => {
    try {
        const res = await axiosInstance.get(`/jobs/${jobId}`);
        console.log("service res :", res.data)
        return res.data;
    } catch (error) {
        console.error("Get Job Error:", error.response?.data || error.message);
        throw error;
    }
};


/* =====================================================
   Get Recruiter Jobs
===================================================== */
export const getMyJobs = async () => {
    try {
        const res = await axiosInstance.get("/jobs/my-jobs");

        // always return an array
        return res.data?.data || [];

    } catch (error) {
        console.error(
            "Get My Jobs Error:",
            error.response?.data || error.message
        );

        return []; // prevent undefined
    }
};


/* =====================================================
   Update Job
===================================================== */
export const updateJob = async (jobId, jobData) => {
    try {
        const res = await axiosInstance.put(`/jobs/${jobId}`, jobData);
        return res.data.data;
    } catch (error) {
        console.error("Update Job Error:", error.response?.data || error.message);
        throw error;
    }
};


/* =====================================================
   Delete Job
===================================================== */
export const deleteJob = async (jobId) => {
    try {
        const res = await axiosInstance.delete(`/jobs/${jobId}`);
        return res.data.data;
    } catch (error) {
        console.error("Delete Job Error:", error.response?.data || error.message);
        throw error;
    }
};

/* =====================================================
   update Job status
===================================================== */
export const updateJobStatus = async (id, status) => {
    try {
        const res = await axiosInstance.put(`/jobs/${id}`, { status });
        return res.data.job;
    } catch (error) {
        console.error("Update Status Error:", error.response?.data || error.message);
        throw error;
    }
};