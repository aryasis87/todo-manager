export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://todo-manager-ivory-seven.vercel.app/sitemap.xml",
    host: "https://todo-manager-ivory-seven.vercel.app",
  };
}
