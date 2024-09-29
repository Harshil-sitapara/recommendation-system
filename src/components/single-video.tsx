import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { ArrowLeft, LoaderCircle } from 'lucide-react'
import { useAction, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'
import { Video as VideoType } from '@/app/types/video-types'

export default function Video({ id }: { id: Id<"videos"> }): JSX.Element {
    const videoData = useQuery(api.videos.fetchVideo, { id })
    const [similarVideosData, setSimilarVideosData] = useState<Array<VideoType>>();
    const [loading, setLoading] = useState<boolean>(false);
    const similarVideos = useAction(api.videos.similarVideos)
    const router = useRouter();
    useEffect(() => {
        async function fetchSimilarVideos() {
            if (videoData) {
                try {
                    setLoading(true);
                    const data = await similarVideos({ query: videoData.category || '' });
                    setSimilarVideosData(data.slice(1, 3));
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchSimilarVideos();
    }, [videoData, id]);

    if (videoData === undefined) {
        return <LoaderCircle className='animate-spin' size={30} />
    }

    if (videoData === null) {
        return <div>No data found</div>;
    }

    function isYoutubeURL(): boolean {
        if (videoData?.videoUrl) {
            const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            if (videoData?.videoUrl.match(regExp)) {
                return true;
            }
        }
        return false;
    }

    return (
        <div className="container mx-auto px-4 py-4">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
            >
                <ArrowLeft /> Back
            </Button>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <Card className="overflow-hidden mb-4">
                        <div className="relative aspect-video">
                            {isYoutubeURL() ? <iframe
                                src={`https://www.youtube.com/embed/${videoData.videoUrl.split("watch?v=")[1]}`}
                                title={videoData.title}
                                className="absolute inset-0 w-full h-full"
                                allowFullScreen
                            ></iframe> :
                                <video
                                    src={videoData.videoUrl}
                                    title={videoData.title}
                                    className="absolute inset-0 w-full h-full"
                                    autoPlay
                                    controls
                                ></video>}
                        </div>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h1 className="text-2xl font-bold">{videoData.title}</h1>
                                <Badge className="text-sm">{videoData.category}</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">{videoData.description}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:w-1/3">
                    <h2 className="text-2xl font-bold mb-4">Similar Videos</h2>
                    <div className="space-y-4">
                        {loading ? <div className="space-y-4" aria-label="Loading video list">
                            {Array(3).fill(null).map((_, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <div className="flex">
                                        <div className="relative w-1/3 aspect-video">
                                            <Skeleton className="absolute inset-0" />
                                        </div>
                                        <CardContent className="w-2/3 p-4">
                                            <Skeleton className="h-5 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-4 w-5/6" />
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div> : (similarVideosData?.length == 1 || similarVideosData?.length == 0 || !similarVideosData) ? <div>No videos</div> : similarVideosData?.map((video) => (
                            <Card key={video._id} className="overflow-hidden cursor-pointer" onClick={() => router.push(`/video/${video._id}`)}>
                                <div className="flex">
                                    <div className="relative w-1/3 aspect-video">
                                        <Image
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <CardContent className="w-2/3 p-4">
                                        <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                                        <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{video.description}</p>
                                        {/* <Badge className="text-xs">{video.category}</Badge> */}
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}