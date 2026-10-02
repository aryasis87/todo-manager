import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmsans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans", display: "swap" });

const __jsonld = {"@context":"https://schema.org","@type":"WebApplication","name":"Tuntas","description":"Pengelola tugas lengkap: prioritas, tenggat dengan label relatif, label yang bisa diganti nama sekaligus, kalender bulanan, dan saringan cepat untuk tugas hari ini atau yang terlambat.","url":"https://todo-manager-ivory-seven.vercel.app","applicationCategory":"ProductivityApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"IDR"}};

export const metadata = {
  metadataBase: new URL("https://todo-manager-ivory-seven.vercel.app"),
  title: { default: "Tuntas — Pengelola tugas dengan kalender", template: "%s — Tuntas" },
  description: "Pengelola tugas lengkap: prioritas, tenggat dengan label relatif, label yang bisa diganti nama sekaligus, kalender bulanan, dan saringan cepat untuk tugas hari ini atau yang terlambat.",
  applicationName: "Tuntas",
  keywords: ["task manager", "manajemen tugas", "produktivitas", "to-do", "pengelola tugas"],
  authors: [{ name: "Tuntas" }],
  creator: "Tuntas",
  publisher: "Tuntas",
  alternates: { canonical: "https://todo-manager-ivory-seven.vercel.app" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://todo-manager-ivory-seven.vercel.app",
    siteName: "Tuntas",
    title: "Tuntas — Pengelola tugas dengan kalender",
    description: "Pengelola tugas lengkap: prioritas, tenggat dengan label relatif, label yang bisa diganti nama sekaligus, kalender bulanan, dan saringan cepat untuk tugas hari ini atau yang terlambat.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Tuntas — Pengelola tugas dengan kalender" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tuntas — Pengelola tugas dengan kalender",
    description: "Pengelola tugas lengkap: prioritas, tenggat dengan label relatif, label yang bisa diganti nama sekaligus, kalender bulanan, dan saringan cepat untuk tugas hari ini atau yang terlambat.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport = { themeColor: "#4f46e5" };

const themeScript = `
(function(){try{var t=localStorage.getItem('tuntas.tema');var d=t? t==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={dmsans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__jsonld) }} />
        </body>
    </html>
  );
}
