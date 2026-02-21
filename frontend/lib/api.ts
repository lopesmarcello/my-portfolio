const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface Technology {
    name: string;
    imageUrl: string;
}

export interface Link {
    label: string;
    url: string;
}

export interface AboutData {
    id: number;
    name: string;
    title: string;
    description: string;
    aboutText: string;
    technologies: Technology[];
    links: Link[];
}

export interface ExperienceData {
    id: number;
    companyName: string;
    description: string;
    startDate: string;
    endDate: string | null;
}

export interface ResumeData {
    id: number;
    fullName: string;
    title: string;
    email: string;
    phone: string;
    about: string;
    links: Link[];
    experiences: ExperienceData[];
    version: number;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    headerImageUrl: string;
    createdAt: string;
}

// About Endpoints
export async function getAbout(): Promise<AboutData> {
    const response = await fetch(`${API_URL}/about/`);
    if (!response.ok) throw new Error("Failed to fetch about");
    return response.json();
}

// Resume Endpoints
export async function getResume(): Promise<ResumeData> {
    const response = await fetch(`${API_URL}/resume/`);
    if (!response.ok) throw new Error("Failed to fetch resume");
    return response.json();
}

// Posts Endpoints
export async function getPosts(): Promise<Post[]> {
    const response = await fetch(`${API_URL}/posts/`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
}

export async function getPost(id: number): Promise<Post> {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) throw new Error("Failed to fetch post");
    return response.json();
}
