import { Id } from "../../../convex/_generated/dataModel";

export interface Video {
    _id: Id<"videos">;
    _creationTime: number;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    category: string;
    embeddings: number[];
  }