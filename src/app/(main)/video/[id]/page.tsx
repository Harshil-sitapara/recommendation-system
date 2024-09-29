"use client";
import Video from "@/components/single-video";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function Page() {
    const { id }: { id: Id<"videos"> } = useParams();
    return <Video id={id} />
}
