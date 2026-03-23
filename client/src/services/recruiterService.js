import axiosInstance from "./apiService.js";

/* =========================================
   Recruiter API Routes
========================================= */

const API = {
    PROFILE_ME: "/recruiters/profile/me",
    PROFILE: "/recruiters/profile",
    DASHBOARD: "/recruiters/me/dashboard",
    CANDIDATES: "/recruiters/candidates",
    FEED_POSTS: "/recruiters/feed/posts",
    FEED_POST: (id) => `/recruiters/feed/posts/${id}`,
    CONNECTIONS: "/recruiters/connections",
    CONNECTION_REQUEST: "/recruiters/connections/request",
    CONNECTION_ACCEPT: "/recruiters/connections/accept",
    CONNECTION_USER: (userId) => `/recruiters/connections/${userId}`,
    ALL_RECRUITERS: "/recruiters",
    RECRUITER_BY_ID: (id) => `/recruiters/${id}`,
    RECRUITER_JOBS: (id) => `/recruiters/${id}/jobs`,
    PROFILE_IMAGE: "/recruiters/profile-image",
    COMPANY_LOGO: "/recruiters/company-logo",
};


/* =========================================
   [01] Get Logged-in Recruiter Profile
========================================= */

export const getMyRecruiterProfile = async () => {
    try {
        const res = await axiosInstance.get(API.PROFILE_ME);
        return res.data;
    } catch (error) {
        console.error("Get recruiter profile error:", error);
        throw error?.response?.data || { message: "Failed to fetch recruiter profile" };
    }
};


/* =========================================
   [02] Get Recruiter by ID
========================================= */

export const getRecruiterById = async (id) => {
    try {
        const res = await axiosInstance.get(API.RECRUITER_BY_ID(id));
        return res.data;
    } catch (error) {
        console.error("Get recruiter by ID error:", error);
        throw error?.response?.data || { message: "Failed to fetch recruiter" };
    }
};

/* =========================================
   [02b] Get Recruiter with Active Jobs
========================================= */
export const getRecruiterWithJobs = async (id) => {
    try {
        const res = await axiosInstance.get(API.RECRUITER_JOBS(id));
        return res.data;
    } catch (error) {
        console.error("Get recruiter jobs error:", error);
        throw error?.response?.data || { message: "Failed to fetch company jobs" };
    }
};


/* =========================================
   [03] Get All Recruiters
========================================= */

export const getAllRecruiters = async () => {
    try {
        const res = await axiosInstance.get(API.ALL_RECRUITERS);
        return res.data;
    } catch (error) {
        console.error("Get all recruiters error:", error);
        throw error?.response?.data || { message: "Failed to fetch recruiters" };
    }
};


/* =========================================
   [04] Update Recruiter Profile
========================================= */

export const updateRecruiterProfile = async (profileData) => {
    try {
        const res = await axiosInstance.put(API.PROFILE, profileData);
        return res.data;
    } catch (error) {
        console.error("Update recruiter profile error:", error);
        throw error?.response?.data || { message: "Failed to update profile" };
    }
};


/* =========================================
   [05] Upload Recruiter Profile Image
========================================= */

export const uploadRecruiterImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append("profileImage", file);

        const res = await axiosInstance.post(
            API.PROFILE_IMAGE,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res.data;

    } catch (error) {
        console.error("Upload recruiter image error:", error);
        throw error?.response?.data || { message: "Failed to upload profile image" };
    }
};


/* =========================================
   [06] Upload Company Logo
========================================= */

export const uploadCompanyLogo = async (file) => {
    try {
        const formData = new FormData();
        formData.append("companyLogo", file);

        const res = await axiosInstance.post(
            API.COMPANY_LOGO,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res.data;

    } catch (error) {
        console.error("Upload company logo error:", error);
        throw error?.response?.data || { message: "Failed to upload logo" };
    }
};


/* =========================================
   [07] Delete Recruiter Profile
========================================= */

export const deleteRecruiterProfile = async () => {
    try {
        const res = await axiosInstance.delete(API.PROFILE);
        return res.data;
    } catch (error) {
        console.error("Delete recruiter profile error:", error);
        throw error?.response?.data || { message: "Failed to delete profile" };
    }
};

/* =========================================
   Recruiter Dashboard Summary
========================================= */
export const getRecruiterDashboard = async () => {
    try {
        const res = await axiosInstance.get(API.DASHBOARD);
        return res.data;
    } catch (error) {
        console.error("Get recruiter dashboard error:", error);
        throw error?.response?.data || { message: "Failed to fetch recruiter dashboard" };
    }
};

/* =========================================
   Search / list job seekers (recruiter only)
   Query: q, location, jobTitle, skills (comma-separated)
========================================= */
export const getCandidatesForRecruiter = async (params = {}) => {
    try {
        const res = await axiosInstance.get(API.CANDIDATES, { params });
        return res.data;
    } catch (error) {
        console.error("Get candidates error:", error);
        throw error?.response?.data || { message: "Failed to fetch candidates" };
    }
};

/* =========================================
   Recruiter feed & recruiter connections
========================================= */

export const getRecruiterFeedPosts = async () => {
    try {
        const res = await axiosInstance.get(API.FEED_POSTS);
        return res.data;
    } catch (error) {
        console.error("Get recruiter feed error:", error);
        throw error?.response?.data || { message: "Failed to load feed" };
    }
};

export const createRecruiterFeedPost = async (content) => {
    try {
        const res = await axiosInstance.post(API.FEED_POSTS, { content });
        return res.data;
    } catch (error) {
        console.error("Create recruiter post error:", error);
        throw error?.response?.data || { message: "Failed to publish post" };
    }
};

export const updateRecruiterFeedPost = async (postId, content) => {
    try {
        const res = await axiosInstance.patch(API.FEED_POST(postId), { content });
        return res.data;
    } catch (error) {
        console.error("Update recruiter post error:", error);
        throw error?.response?.data || { message: "Failed to update post" };
    }
};

export const getRecruiterConnections = async () => {
    try {
        const res = await axiosInstance.get(API.CONNECTIONS);
        return res.data;
    } catch (error) {
        console.error("Get recruiter connections error:", error);
        throw error?.response?.data || { message: "Failed to load connections" };
    }
};

export const sendRecruiterConnectionRequest = async (recruiterId) => {
    try {
        const res = await axiosInstance.post(API.CONNECTION_REQUEST, { recruiterId });
        return res.data;
    } catch (error) {
        console.error("Send recruiter connection error:", error);
        throw error?.response?.data || { message: "Could not send request" };
    }
};

export const acceptRecruiterConnectionRequest = async (requestId) => {
    try {
        const res = await axiosInstance.post(API.CONNECTION_ACCEPT, { requestId });
        return res.data;
    } catch (error) {
        console.error("Accept recruiter connection error:", error);
        throw error?.response?.data || { message: "Could not accept request" };
    }
};

export const removeRecruiterConnection = async (otherUserId) => {
    try {
        const res = await axiosInstance.delete(API.CONNECTION_USER(otherUserId));
        return res.data;
    } catch (error) {
        console.error("Remove recruiter connection error:", error);
        throw error?.response?.data || { message: "Could not remove connection" };
    }
};