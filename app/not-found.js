import Link from 'next/link';
import TopBar from '@/components/TopBar';

export const metadata = { title: 'Halaman tidak ditemukan' };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-3xl font-bold text-on-surface">Halaman ini belum tuntas</h1>
        <p className="mt-3 text-on-surface-variant">Halaman yang kamu cari tidak ditemukan.</p>
        <Link href="/" className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary">Kembali ke daftar tugas</Link>
      </main>
    </div>
  );
}
