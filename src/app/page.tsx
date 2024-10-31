'use client';

import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';

export default function Home() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="max-w-3xl mx-auto w-full pt-32 sm:pt-40">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 text-center leading-tight">
            Empower Your Decisions<br />
            with Trusted Data.
          </h1>
          
          <p className="text-xl text-gray-600 text-center">
          Access accurate, real-time information about businesses across Africa.
          </p>

          <div className="w-full max-w-2xl">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for registered companies..."
            />
          </div>
        </div>
      </div>
    </main>
  );
}
