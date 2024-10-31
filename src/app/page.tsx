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
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">
        Empower Your Decisions with Trusted Data
      </h1>
      
      <p className="text-lg mb-8 text-gray-600">
        Access accurate, real-time information about any business in Kenya
      </p>
      
      <div className="max-w-xl">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search for registered companies..."
        />
      </div>
    </main>
  );
}
