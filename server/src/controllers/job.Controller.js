import Job from "../models/Job.js";

/* =============================================
@desc Create a new job posting 
@route Post /api/jobs
@access Private (recruiter only) 
==============================================*/

const createJob = async (req, res) => {
    try {
        const {
            jobTitle, company, location, jobType, salaryMin,
            salaryMax, description, responsibilities, skills,
            experience, education
        } = req.body

        if (
            !jobTitle ||
            !company ||
            !location ||
            !jobType ||
            !description ||
            !responsibilities ||
            !skills ||
            !Array.isArray(skills) ||
            skills.length === 0 ||
            !experience
        ) {
            return res.status(400).json({
                success: false,
                message: "Please Provide all required fields"
            });
        }

        if (salaryMin && salaryMax && salaryMin > salaryMax) {
            return res.status(400).json({
                success: false,
                message: "Minimum salary cannot be greater than maximum salary"
            });
        }

        const job = await Job.create({
            recruiter: req.user.id,
            jobTitle, company, location, jobType, salaryMin, salaryMax, description, responsibilities, skills, experience, education
        });

        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            job
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

/* =============================================
@desc Get all active Jobs  
@route GET /api/jobs
@access Public 
==============================================*/

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAllJobs = async (req, res) => {
    try {
        const { search, location, jobType,
            page = 1, limit = 10 } = req.query

        const query = { status: "active" };

        if (search) {
            query.$text = { $search: search };
        }
        if (location) {
            query.location = { $regex: escapeRegex(location), $options: "i" };
        }
        if (jobType) {
            query.jobType = jobType;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const jobs = await Job.find(query)
            .populate("recruiter", "fullName email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        const total = await Job.countDocuments(query);

        res.status(200).json({
            success: true,
            results: jobs.length,
            total,
            pages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            jobs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

/* =============================================
@desc Get all active Jobs (with optional filters) 
@route GET /api/jobs/:id
@access Public 
==============================================*/

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("recruiter", "fullName email avatar")
            .lean();

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({ success: true, job });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/* =============================================
@desc Get jobs posted by logged-in recruiter 
@route GET /api/jobs/my-jobs
@access Private 
==============================================*/
const getMyJobs = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const jobs = await Job.find({ recruiter: recruiterId })
            .sort({ createdAt: -1 })
            .lean();

        const data = jobs.map((job) => ({
            ...job,
            applicationsCount: Array.isArray(job.applicants) ? job.applicants.length : 0,
        }));

        res.status(200).json({
            success: true,
            data
        });


    } catch (error) {
        console.error("Get My Jobs Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

/* =============================================
@desc Update a job posting  
@route put /api/jobs/:id
@access Private 
==============================================*/
const updateJob = async (req, res) => {
    try {

        delete req.body.recruiter;
        delete req.body.applicants;

        if (req.body.status) {
            req.body.status = req.body.status.toLowerCase();
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        if (job.recruiter.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to edit this job"
            });
        }
        const updated = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

/* =============================================
@desc Delete a job posting
@route DELETE /api/jobs/:id
@access Private 
==============================================*/

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        if (job.recruiter.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this job"
            });
        }
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
export {
    createJob, getAllJobs, getJobById,
    getMyJobs, updateJob, deleteJob
};