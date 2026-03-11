import { Component, Palette, Briefcase, Video, DollarSign, Heart, Database, Code } from 'lucide-react';
import { Image } from "../image_paths";

export const categories = [
    { id: 1, name: "Design", count: 253, icon: Palette, color: "bg-purple-100 text-purple-600" },
    { id: 2, name: "Programming", count: 864, icon: Code, color: "bg-blue-100 text-blue-600" },
    { id: 3, name: "Marketing", count: 412, icon: Briefcase, color: "bg-orange-100 text-orange-600" },
    { id: 4, name: "Video", count: 120, icon: Video, color: "bg-red-100 text-red-600" },
    { id: 5, name: "Finance", count: 320, icon: DollarSign, color: "bg-green-100 text-green-600" },
    { id: 6, name: "Health", count: 180, icon: Heart, color: "bg-pink-100 text-pink-600" },
    { id: 7, name: "Data Science", count: 245, icon: Database, color: "bg-cyan-100 text-cyan-600" },
];

export const stats = [
    { id: 1, label: "Live Jobs", value: "25k+" },
    { id: 2, label: "Companies", value: "854" },
    { id: 3, label: "Candidates", value: "5M+" },
    { id: 4, label: "New Jobs", value: "1,200" }
];

export const companies = [
    { id: 1, name: "Google", location: "USA", openPositions: 12, logo: Image.googleLogo },
    { id: 2, name: "Microsoft", location: "USA", openPositions: 8, logo: Image.microsoftLogo },
    { id: 3, name: "Spotify", location: "Sweden", openPositions: 5, logo: Image.spotifyLogo },
    { id: 4, name: "Airbnb", location: "USA", openPositions: 4, logo: Image.airbnbLogo },
];

export const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Product Designer",
        feedback: "I found my dream job within 3 days. The resume upload feature is fantastic and saved me so much time.",
        image: Image.user1,
        rating: 5
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Software Engineer",
        feedback: "The quality of job listings here is unmatched. I highly recommend this platform to any tech professional.",
        image: Image.user2,
        rating: 4.5
    },
    {
        id: 3,
        name: "Emily Davis",
        role: "Marketing Director",
        feedback: "Great user experience and very responsive support. It helped us find the right talent quickly.",
        image: Image.user3,
        rating: 5
    }
];
