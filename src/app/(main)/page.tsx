"use client";

import { Button } from "@/components/ui/button";
import { VideoListSkeleton } from "@/components/video-list-skeleton";
import { useAction, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { SearchInput } from "@/components/ui/search-input";
import { Video } from "../types/video-types";


export default function Home() {
  const router = useRouter();
  const [searching, startSearching] = useTransition();
  const allVideos = useQuery(api.videos.fetchAllVideos);
  const similarVideos = useAction(api.videos.similarVideos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Video[]>(allVideos || []);

  useEffect(() => {
    if (allVideos) {
      setFilteredData(allVideos);
    }
  }, [allVideos]);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredData(allVideos || []);
      return;
    }
    try {
      startSearching(async () => {
        await similarVideos({ query }).then((data) => {
          setFilteredData(data);
        });
      })
      
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const handleClearSearch = () => {
    setSearchTerm("");
    handleSearch("");
  };

  return (
    <div className="container mx-auto p-4">
      <div className='flex mb-8 gap-x-2'>
        <SearchInput
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(searchTerm)
            }
          }}
          type="text"
          value={searchTerm}
          onClear={() => handleClearSearch()}
          placeholder="Search videos..."
          className="transition-all duration-300"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => handleSearch(searchTerm)}
          variant="outline"
          disabled={searching}
        >
          {searching ? 'Searching...' : 'Search'}
        </Button>
        <Button onClick={() => router.push("/add")} variant="outline">Add video</Button>
      </div>

      {allVideos === undefined ? (
        <VideoListSkeleton />
      ) : allVideos === null ? (
        <div>No data found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((video) => (
            <Card
              key={video._id}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/video/${video._id}`)}
            >
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                width={400}
                height={225}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                <p className="text-gray-600 mb-4">{video.description}</p>
                {/* <Badge>{video.category}</Badge> */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
