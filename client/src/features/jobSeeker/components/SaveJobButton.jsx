import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { getMySavedJobs, saveJobForSeeker, unsaveJobForSeeker } from "../../../services/jobSeekerService";
import "./SaveJobButton.css";

/**
 * Toggle save for a job. Shares React Query cache for ["savedJobs"] across the app.
 */
export default function SaveJobButton({ jobId, className = "", label = false }) {
  const queryClient = useQueryClient();
  const id = jobId != null ? String(jobId) : "";

  const { data, isLoading } = useQuery({
    queryKey: ["savedJobs"],
    queryFn: getMySavedJobs,
    staleTime: 60 * 1000,
  });

  const savedIds = useMemo(() => {
    const list = data?.savedJobs || [];
    const set = new Set();
    list.forEach((row) => {
      const jid = row?.job?._id || row?.job;
      if (jid) set.add(String(jid));
    });
    return set;
  }, [data]);

  const isSaved = id && savedIds.has(id);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Missing job");
      const snapshot = queryClient.getQueryData(["savedJobs"]);
      const list = snapshot?.savedJobs || [];
      const set = new Set();
      list.forEach((row) => {
        const jid = row?.job?._id || row?.job;
        if (jid) set.add(String(jid));
      });
      const on = set.has(id);
      if (on) return unsaveJobForSeeker(id);
      return saveJobForSeeker(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobSeekerDashboard"] });
    },
  });

  if (!id) return null;

  const busy = mutation.isPending || isLoading;

  return (
    <button
      type="button"
      className={`save-job-btn ${isSaved ? "save-job-btn--saved" : ""} ${className}`.trim()}
      onClick={() => mutation.mutate()}
      disabled={busy}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
      title={isSaved ? "Remove from saved" : "Save job"}
    >
      <Bookmark size={label ? 16 : 18} className="save-job-btn__icon" fill={isSaved ? "currentColor" : "none"} />
      {label ? <span>{isSaved ? "Saved" : "Save"}</span> : null}
    </button>
  );
}
