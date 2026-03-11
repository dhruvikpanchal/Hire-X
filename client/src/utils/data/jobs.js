import { Image } from "../image_paths";

export const jobs = [
  {
    id: 1,
    title: "Senior UX Designer",
    company: "Google",
    location: "Mountain View, CA",
    type: "Full Time",
    salary: "$120k - $150k",
    logo: Image.googleLogo,
    posted: "2 days ago",
    featured: true
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Airbnb",
    location: "Remote",
    type: "Full Time",
    salary: "$100k - $130k",
    logo: Image.airbnbLogo,
    posted: "5 days ago",
    featured: false
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Spotify",
    location: "New York, NY",
    type: "Contract",
    salary: "$90k - $110k",
    logo: Image.spotifyLogo,
    posted: "1 week ago",
    featured: false
  },
  {
    id: 4,
    title: "Marketing Specialist",
    company: "Slack",
    location: "San Francisco, CA",
    type: "Part Time",
    salary: "$60k - $80k",
    logo: Image.slackLogo,
    posted: "3 days ago",
    featured: false
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "Microsoft",
    location: "Seattle, WA",
    type: "Full Time",
    salary: "$130k - $160k",
    logo: Image.microsoftLogo,
    posted: "1 day ago",
    featured: false
  }
];

export const popularVacancies = [
  { role: "Software Engineer", open: 450 },
  { role: "Product Designer", open: 210 },
  { role: "Marketing Manager", open: 156 },
  { role: "Data Analyst", open: 124 },
  { role: "HR Specialist", open: 98 },
  { role: "Project Manager", open: 180 },
  { role: "Sales Executive", open: 140 },
  { role: "Content Writer", open: 85 }
];
