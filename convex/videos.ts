import { action, internalAction, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { embed } from '../src/lib/embed'
import { internal } from './_generated/api'
import { Doc } from "./_generated/dataModel";

export const fetchVideosData = internalQuery({
    args: {
        ids: v.array(v.id("videos"))
    },
    handler: async (ctx, args) => {
        const results = [];
        for (const id of args.ids) {
            const doc = await ctx.db.get(id);
            if (doc) {
                results.push(doc);
            }
        }
        return results;
    }
})

export const similarVideos = action({
    args: {
        query: v.string()
    },
    handler: async (ctx, args) => {
        //NOTE - convert query to embeddings
        const queryEmbeddings = await embed(args.query);

        const result = await ctx.vectorSearch("videos", "by_search", {
            vector: queryEmbeddings,
            limit: 5
        })
        const videoIds = result.map(r => r._id);

        const videos: Array<Doc<'videos'>> = await ctx.runQuery(
            internal.videos.fetchVideosData,
            { ids: videoIds });
        return videos;
    }
})

export const addVideo = action({
    args: {
        title: v.string(),
        description: v.string(),
        videoUrl: v.string(),
        thumbnailUrl: v.string(),
        category: v.string(),
    },
    handler: async (ctx, args) => {
        //checks
        if (!args.title || !args.description || !args.videoUrl || !args.thumbnailUrl || !args.category) {
            throw new Error("All fields are required")
        };
        const embedding = await embed(args.title);
        //TODO - insert this embeddings in DB
    }
})