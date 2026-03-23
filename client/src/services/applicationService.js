import axiosInstance from "./apiService.js";

/* =========================================
   APPLY TO JOB
   POST /api/applications
   Sends multipart/form-data with optional resume file
========================================= */
export const applyToJob = async ({ jobId, resumeFile, existingResumeUrl, coverLetter = "" }) => {
  const formData = new FormData();
  formData.append("jobId", jobId);
  if (coverLetter) formData.append("coverLetter", coverLetter);

  if (resumeFile) {
    // Brand new file selected by the user
    formData.append("resume", resumeFile);
  } else if (existingResumeUrl) {
    // Using resume already on their profile
    formData.append("existingResumeUrl", existingResumeUrl);
  }

  const res = await axiosInstance.post("/applications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* =========================================
   GET MY APPLICATIONS
   GET /api/applications/me
========================================= */
export const getMyApplications = async () => {
  const res = await axiosInstance.get("/applications/me");
  return res.data;
};

/* =========================================
   GET MY APPLICATIONS (new endpoint)
   GET /api/applications/my
   Returns: { success, applications }
========================================= */
export const getMyApplicationsV2 = async () => {
  const res = await axiosInstance.get("/applications/my");
  return res.data;
};

/* =========================================
   RECRUITER: GET ALL RECEIVED APPLICATIONS
   GET /api/applications/recruiter
========================================= */
export const getRecruiterApplications = async () => {
  const res = await axiosInstance.get("/applications/recruiter");
  return res.data;
};

/* =========================================
   RECRUITER: UPDATE APPLICATION STATUS
   PUT /api/applications/:id/status
========================================= */
export const updateApplicationStatus = async ({ id, status }) => {
  const res = await axiosInstance.put(`/applications/${id}/status`, { status });
  return res.data;
};

/* =========================================
   RECRUITER: REMOVE APPLICATION
   DELETE /api/applications/:id
========================================= */
export const removeRecruiterApplication = async (id) => {
  const res = await axiosInstance.delete(`/applications/${id}`);
  return res.data;
};
