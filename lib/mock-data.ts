// Centralized mock data for the admin panel.

export const stats = {
  totalBlogs: 148,
  publishedBlogs: 112,
  contactLeads: 342,
  newsletter: 5820,
  totalUsers: 27,
};

export const visitorSeries = [
  { m: "Jan", visitors: 4200, views: 12800 },
  { m: "Feb", visitors: 4800, views: 14200 },
  { m: "Mar", visitors: 5600, views: 16900 },
  { m: "Apr", visitors: 6100, views: 18400 },
  { m: "May", visitors: 7200, views: 22100 },
  { m: "Jun", visitors: 8400, views: 25600 },
  { m: "Jul", visitors: 9100, views: 28200 },
  { m: "Aug", visitors: 9800, views: 30100 },
  { m: "Sep", visitors: 10600, views: 32800 },
  { m: "Oct", visitors: 11800, views: 35400 },
  { m: "Nov", visitors: 12400, views: 38900 },
  { m: "Dec", visitors: 13800, views: 42100 },
];

export const leadSeries = [
  { d: "Mon", leads: 18, qualified: 9 },
  { d: "Tue", leads: 24, qualified: 14 },
  { d: "Wed", leads: 31, qualified: 18 },
  { d: "Thu", leads: 22, qualified: 12 },
  { d: "Fri", leads: 36, qualified: 22 },
  { d: "Sat", leads: 14, qualified: 6 },
  { d: "Sun", leads: 11, qualified: 4 },
];

export const trafficSources = [
  { name: "Organic", value: 48 },
  { name: "Direct", value: 22 },
  { name: "Referral", value: 16 },
  { name: "Social", value: 14 },
];

export type BlogRow = {
  id: string;
  title: string;
  author: string;
  category: string;
  status: "Published" | "Draft" | "Scheduled";
  views: number;
  updated: string;
  featured?: boolean;
};

export const blogs: BlogRow[] = [
  { id: "b_01", title: "Building Scalable AI Products with Custom LLM Pipelines", author: "Aarav Shah", category: "AI/ML", status: "Published", views: 4820, updated: "2h ago", featured: true },
  { id: "b_02", title: "Why Enterprises Are Moving to Modular Monorepos", author: "Priya Nair", category: "Engineering", status: "Published", views: 3210, updated: "1d ago" },
  { id: "b_03", title: "Design Systems That Actually Ship", author: "Kabir Mehta", category: "Design", status: "Draft", views: 0, updated: "3d ago" },
  { id: "b_04", title: "The State of Mobile Performance in 2026", author: "Rhea Kapoor", category: "Mobile", status: "Scheduled", views: 0, updated: "5d ago" },
  { id: "b_05", title: "Postgres at Scale: Lessons from 100+ Tenants", author: "Ishaan Verma", category: "Databases", status: "Published", views: 6120, updated: "6d ago", featured: true },
  { id: "b_06", title: "GEO vs SEO vs AEO — A Practical Framework", author: "Meera Iyer", category: "SEO", status: "Published", views: 8890, updated: "1w ago" },
  { id: "b_07", title: "How We Cut CI Time by 74%", author: "Yash Malhotra", category: "DevOps", status: "Draft", views: 0, updated: "1w ago" },
  { id: "b_08", title: "Realtime UX Patterns for Dashboards", author: "Anaya Bose", category: "Design", status: "Published", views: 2740, updated: "2w ago" },
];

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  status: "New" | "Contacted" | "Qualified" | "Won" | "Lost";
  createdAt: string;
};

export const leads: Lead[] = [
  { id: "l_01", name: "Rohan Desai", company: "Northwind Labs", email: "rohan@northwind.io", phone: "+91 98230 12345", service: "Web App", status: "New", createdAt: "12 min ago" },
  { id: "l_02", name: "Ananya Rao", company: "Kestrel Health", email: "ananya@kestrel.co", phone: "+1 415 555 0132", service: "AI/ML", status: "Contacted", createdAt: "1h ago" },
  { id: "l_03", name: "Marcus Klein", company: "Volta Retail", email: "marcus@volta.de", phone: "+49 30 998 22", service: "Mobile", status: "Qualified", createdAt: "3h ago" },
  { id: "l_04", name: "Sana Qureshi", company: "Fig & Fern", email: "sana@figfern.com", phone: "+971 55 210 3390", service: "E-commerce", status: "Won", createdAt: "1d ago" },
  { id: "l_05", name: "Diego Alvarez", company: "Puerto Data", email: "diego@puertodata.mx", phone: "+52 55 8899 0022", service: "Data Platform", status: "New", createdAt: "1d ago" },
  { id: "l_06", name: "Lena Ostrowski", company: "Blume UX", email: "lena@blume.studio", phone: "+48 22 300 1140", service: "Design Sprint", status: "Contacted", createdAt: "2d ago" },
  { id: "l_07", name: "Tomás Ribeiro", company: "Onda Digital", email: "tomas@ondadigital.br", phone: "+55 21 8811 4090", service: "Web App", status: "Lost", createdAt: "3d ago" },
  { id: "l_08", name: "Yui Nakamura", company: "Kairo Robotics", email: "yui@kairo.jp", phone: "+81 3 6273 4400", service: "AI/ML", status: "Qualified", createdAt: "4d ago" },
];

export type Subscriber = {
  id: string;
  email: string;
  source: string;
  status: "Active" | "Unsubscribed";
  joined: string;
};

export const subscribers: Subscriber[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `s_${i + 1}`,
  email: `subscriber${i + 1}@${["gmail.com", "outlook.com", "acme.co", "hey.com"][i % 4]}`,
  source: ["Blog", "Footer", "Popup", "Landing"][i % 4],
  status: i % 9 === 0 ? "Unsubscribed" : "Active",
  joined: `${(i % 30) + 1}d ago`,
}));

export type User = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited" | "Suspended";
  lastActive: string;
};

export const users: User[] = [
  { id: "u_01", name: "Ravi Ramesh", email: "ravi@ramesttechnolabs.com", role: "Owner", status: "Active", lastActive: "now" },
  { id: "u_02", name: "Priya Nair", email: "priya@ramesttechnolabs.com", role: "Admin", status: "Active", lastActive: "12m ago" },
  { id: "u_03", name: "Aarav Shah", email: "aarav@ramesttechnolabs.com", role: "Editor", status: "Active", lastActive: "1h ago" },
  { id: "u_04", name: "Meera Iyer", email: "meera@ramesttechnolabs.com", role: "Editor", status: "Active", lastActive: "3h ago" },
  { id: "u_05", name: "Yash Malhotra", email: "yash@ramesttechnolabs.com", role: "Viewer", status: "Invited", lastActive: "—" },
  { id: "u_06", name: "Anaya Bose", email: "anaya@ramesttechnolabs.com", role: "Editor", status: "Suspended", lastActive: "6d ago" },
];

export const activityLogs = [
  { id: "a1", user: "Priya Nair", action: "published blog", target: "Building Scalable AI Products", at: "12m ago" },
  { id: "a2", user: "Aarav Shah", action: "replied to lead", target: "Rohan Desai", at: "1h ago" },
  { id: "a3", user: "Ravi Ramesh", action: "updated role", target: "Yash Malhotra → Viewer", at: "3h ago" },
  { id: "a4", user: "Meera Iyer", action: "uploaded media", target: "hero-ai-pipeline.jpg", at: "5h ago" },
  { id: "a5", user: "System", action: "cron completed", target: "SEO crawl (2,412 URLs)", at: "8h ago" },
  { id: "a6", user: "Anaya Bose", action: "created draft", target: "Realtime UX Patterns", at: "1d ago" },
];

export const notifications = [
  { id: "n1", title: "New lead from Kestrel Health", body: "Ananya Rao asked about AI/ML services.", at: "8m ago", unread: true },
  { id: "n2", title: "Blog scheduled", body: "The State of Mobile Performance in 2026 will publish Friday.", at: "2h ago", unread: true },
  { id: "n3", title: "SEO alert", body: "3 pages dropped below Core Web Vitals threshold.", at: "6h ago", unread: false },
  { id: "n4", title: "New subscriber", body: "42 new newsletter signups today.", at: "1d ago", unread: false },
];

export const seoScores = { seo: 92, geo: 78, aeo: 84, perf: 96 };

export const keywordSeries = [
  { m: "Jan", top3: 42, top10: 128 },
  { m: "Feb", top3: 48, top10: 142 },
  { m: "Mar", top3: 55, top10: 158 },
  { m: "Apr", top3: 61, top10: 172 },
  { m: "May", top3: 68, top10: 190 },
  { m: "Jun", top3: 74, top10: 208 },
];

export const mediaItems = Array.from({ length: 18 }).map((_, i) => ({
  id: `m_${i + 1}`,
  name: [
    "hero-ai-pipeline", "product-shot-01", "team-offsite", "case-study-cover",
    "brand-mark", "og-banner", "diagram-architecture", "podcast-thumb",
    "founders", "office-lobby", "conf-keynote", "workflow-graph",
    "avatar-priya", "avatar-aarav", "wallpaper-gradient", "icon-ai",
    "screenshot-dashboard", "screenshot-editor",
  ][i] + ".jpg",
  size: `${(Math.random() * 3 + 0.2).toFixed(2)} MB`,
  type: i % 6 === 0 ? "PNG" : "JPG",
  uploaded: `${(i % 20) + 1}d ago`,
}));
