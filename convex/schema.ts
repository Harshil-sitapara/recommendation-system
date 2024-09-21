import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
    videos: defineTable({
        title: v.string(),
        description: v.string(),
        videoUrl: v.string(),
        thumbnailUrl: v.string(),
        category: v.string(),
        embeddings: v.array(v.float64())
    }).vectorIndex("by_search", {
        vectorField: "embeddings",
        dimensions: 1024,
        filterFields: ["category"]
    })
});

export default schema;