import axiosInstance from "./apiService.js";

/* =========================================
   [01] GET ALL JOB SEEKERS
========================================= */
export const getAllJobSeekers = async () => {
    const res = await axiosInstance.get("/jobseekers");
    return res.data;
};


/* =========================================
   [02] GET JOB SEEKER BY ID
========================================= */
export const getJobSeekerById = async (id) => {
    const res = await axiosInstance.get(`/jobseekers/${id}`);
    return res.data;
};


/* =========================================
   [03] GET LOGGED IN PROFILE
========================================= */
export const getMyJobSeekerProfile = async () => {
    const res = await axiosInstance.get("/jobseekers/me/profile");
    return res.data;
};


/* =========================================
   [04] UPDATE PROFILE (🔥 FIXED)
========================================= */
export const updateJobSeekerProfile = async (data) => {
    const formData = new FormData();

    // basic fields
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("location", data.location);
    formData.append("jobTitle", data.jobTitle);
    formData.append("bio", data.bio);
    formData.append("linkedin", data.linkedin);
    formData.append("portfolio", data.portfolio);

    // 🔥 skills (array → string)
    formData.append("skills", JSON.stringify(data.skills));

    // 🔥 avatar file (optional)
    if (data.avatar) {
        formData.append("avatar", data.avatar);
    }

    const res = await axiosInstance.put(
        "/jobseekers/profile",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};


/* =========================================
   [05] UPLOAD RESUME
========================================= */
export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await axiosInstance.post(
        "/jobseekers/resume",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};


/* =========================================
   [06] UPLOAD AVATAR (OPTIONAL)
========================================= */
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axiosInstance.post(
        "/jobseekers/avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};


/* =========================================
   CAREER: EXPERIENCE
========================================= */
export const getExperience = async () => {
    const res = await axiosInstance.get("/jobseekers/me/experience");
    return res.data;
};

export const addExperience = async (data) => {
    const res = await axiosInstance.post("/jobseekers/me/experience", data);
    return res.data;
};

export const updateExperience = async (id, data) => {
    const res = await axiosInstance.put(`/jobseekers/me/experience/${id}`, data);
    return res.data;
};

export const deleteExperience = async (id) => {
    const res = await axiosInstance.delete(`/jobseekers/me/experience/${id}`);
    return res.data;
};


/* =========================================
   CAREER: EDUCATION
========================================= */
export const getEducation = async () => {
    const res = await axiosInstance.get("/jobseekers/me/education");
    return res.data;
};

export const addEducation = async (data) => {
    const res = await axiosInstance.post("/jobseekers/me/education", data);
    return res.data;
};

export const updateEducation = async (id, data) => {
    const res = await axiosInstance.put(`/jobseekers/me/education/${id}`, data);
    return res.data;
};

export const deleteEducation = async (id) => {
    const res = await axiosInstance.delete(`/jobseekers/me/education/${id}`);
    return res.data;
};

/* =========================================
   DASHBOARD SUMMARY
========================================= */
export const getJobSeekerDashboard = async () => {
    const res = await axiosInstance.get("/jobseekers/me/dashboard");
    return res.data;
};

/* =========================================
   SAVED JOBS
========================================= */
export const getMySavedJobs = async () => {
    const res = await axiosInstance.get("/jobseekers/me/saved-jobs");
    return res.data;
};

export const saveJobForSeeker = async (jobId) => {
    const res = await axiosInstance.post("/jobseekers/me/saved-jobs", { jobId });
    return res.data;
};

export const unsaveJobForSeeker = async (jobId) => {
    const res = await axiosInstance.delete(`/jobseekers/me/saved-jobs/${jobId}`);
    return res.data;
};