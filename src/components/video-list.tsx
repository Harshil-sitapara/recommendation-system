"use client"

import { useState } from 'react'
import Image from "next/image"
import { Input } from "./ui/input"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useAction, useQueries } from 'convex/react'
import { api, internal } from '../../convex/_generated/api'

// Sample data
const videos = [
  {
    title: "Introduction to React",
    description: "Learn the basics of React in this comprehensive tutorial.",
    videoUrl: "https://example.com/react-intro",
    thumbnailUrl: "/assets/placeholder.png",
    category: "Programming"
  },
  {
    title: "Cooking Italian Pasta",
    description: "Master the art of cooking authentic Italian pasta dishes.",
    videoUrl: "https://example.com/italian-pasta",
    thumbnailUrl: "/assets/placeholder.png",
    category: "Cooking"
  },
  {
    title: "Yoga for Beginners",
    description: "Start your yoga journey with these beginner-friendly poses.",
    videoUrl: "https://example.com/yoga-beginners",
    thumbnailUrl: "/assets/placeholder.png",
    category: "Fitness"
  }
]

export function VideoList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <div className='flex mb-8 gap-x-2'>
        <Input
          type="search"
          placeholder="Search videos..."
          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => router.push("/add")} variant="outline" >Add video</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
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
              <Badge>{video.category}</Badge>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4">
              <a
                href={video.videoUrl}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
              >
                Watch Video
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}