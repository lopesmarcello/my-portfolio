const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const TOKEN_COOKIE = "admin_token";

// ---------------------------------------------------------------------------
// Cookie-based auth utilities (client-side)
// ---------------------------------------------------------------------------

export function setAuthToken(token: string): void {
    const maxAge = 86400; // 24 hours, matches backend JWT expiration
    document.cookie = `${TOKEN_COOKIE}=${token}; Path=/; SameSite=Strict; Max-Age=${maxAge}`;
}

export function getAuthToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${TOKEN_COOKIE}=`));
    return match ? match.split("=")[1] : null;
}

export function clearAuthToken(): void {
    document.cookie = `${TOKEN_COOKIE}=; Path=/; SameSite=Strict; Max-Age=0`;
}

export function isAuthenticated(): boolean {
    return getAuthToken() !== null;
}

// ---------------------------------------------------------------------------
// Authenticated fetch helper
// ---------------------------------------------------------------------------

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }
    return fetch(url, { ...options, headers });
}

// ---------------------------------------------------------------------------
// Types for admin request payloads
// ---------------------------------------------------------------------------

export interface LoginRequest {
    username: string;
    password: string;
}

export interface UpdateAboutRequest {
    name: string;
    title: string;
    description: string;
    aboutText: string;
    technologies: { name: string; imageUrl: string }[];
    links: { label: string; url: string }[];
}

export interface TechnologyRequest {
    name: string;
    imageUrl: string;
}

export interface LinkRequest {
    label: string;
    url: string;
}

export interface UpdateResumeRequest {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    about: string;
    links: LinkRequest[];
}

export interface AddExperienceRequest {
    companyName: string;
    description: string;
    startDate: string;
    endDate: string | null;
    displayOrder: number | null;
}

export interface UpdateExperienceRequest {
    companyName: string;
    description: string;
    startDate: string;
    endDate: string | null;
    displayOrder: number | null;
}

export interface ReorderExperienceItem {
    id: number;
    displayOrder: number;
}

export interface CreatePostRequest {
    title: string;
    content: string;
    headerImageUrl?: string;
}

export interface UpdatePostRequest {
    title?: string;
    content?: string;
    headerImageUrl?: string;
}

// ---------------------------------------------------------------------------
// Auth error types
// ---------------------------------------------------------------------------

export class InvalidCredentialsError extends Error {
    constructor() {
        super("Invalid username or password.");
        this.name = "InvalidCredentialsError";
    }
}

export class ServerError extends Error {
    constructor() {
        super("Could not reach the server. Please try again.");
        this.name = "ServerError";
    }
}

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------

export async function adminLogin(username: string, password: string): Promise<void> {
    let response: Response;
    try {
        response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
    } catch {
        throw new ServerError();
    }
    if (response.status === 401) throw new InvalidCredentialsError();
    if (!response.ok) throw new ServerError();
    const data: { token: string } = await response.json();
    setAuthToken(data.token);
}

export function adminLogout(): void {
    clearAuthToken();
}

// ---------------------------------------------------------------------------
// About admin endpoints
// ---------------------------------------------------------------------------

export async function adminCreateAbout(dto: UpdateAboutRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/about/`, {
        method: "POST",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to create about");
}

export async function adminUpdateAbout(dto: UpdateAboutRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/about/`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to update about");
}

export async function adminAddTechnology(dto: TechnologyRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/about/technologies`, {
        method: "POST",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to add technology");
}

export async function adminUpdateTechnology(index: number, dto: TechnologyRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/about/technologies/${index}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to update technology");
}

export async function adminRemoveTechnology(index: number): Promise<void> {
    const response = await authFetch(`${API_URL}/about/technologies/${index}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to remove technology");
}

export async function adminAddAboutLink(dto: LinkRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/about/links`, {
        method: "POST",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to add about link");
}

export async function adminUpdateAboutLink(index: number, dto: LinkRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/about/links/${index}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to update about link");
}

export async function adminRemoveAboutLink(index: number): Promise<void> {
    const response = await authFetch(`${API_URL}/about/links/${index}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to remove about link");
}

// ---------------------------------------------------------------------------
// Resume admin endpoints
// ---------------------------------------------------------------------------

export async function adminCreateResume(dto: UpdateResumeRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/resume/`, {
        method: "POST",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to create resume");
}

export async function adminUpdateResume(dto: UpdateResumeRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/resume/`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to update resume");
}

export async function adminAddExperience(dto: AddExperienceRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/resume/experiences`, {
        method: "POST",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to add experience");
}

export async function adminUpdateExperience(id: number, dto: UpdateExperienceRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/resume/experiences/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to update experience");
}

export async function adminRemoveExperience(id: number): Promise<void> {
    const response = await authFetch(`${API_URL}/resume/experiences/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to remove experience");
}

export async function adminReorderExperiences(items: ReorderExperienceItem[]): Promise<void> {
    const response = await authFetch(`${API_URL}/resume/experiences/reorder`, {
        method: "PATCH",
        body: JSON.stringify(items),
    });
    if (!response.ok) throw new Error("Failed to reorder experiences");
}

export async function adminUpdateResumeLink(index: number, dto: LinkRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/resume/links/${index}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to update resume link");
}

// ---------------------------------------------------------------------------
// Posts admin endpoints
// ---------------------------------------------------------------------------

export async function adminCreatePost(dto: CreatePostRequest): Promise<{ id: number }> {
    const response = await authFetch(`${API_URL}/posts/`, {
        method: "POST",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to create post");
    const data = await response.json();
    return { id: data.id };
}

export async function adminDeletePost(id: number): Promise<void> {
    const response = await authFetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete post");
}

export async function adminUpdatePost(id: number, dto: UpdatePostRequest): Promise<void> {
    const response = await authFetch(`${API_URL}/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to update post");
}

export async function adminUploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    const response = await authFetch(`${API_URL}/posts/images`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload image");
    const data: { url: string } = await response.json();
    return data.url;
}
