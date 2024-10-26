import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { embed } from '../src/lib/embed'
import { internal } from './_generated/api'
import { Doc } from "./_generated/dataModel";

//NOTE - fetch videos by ids
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

//NOTE - Mutation to insert video
export const insertVideo = internalMutation({
    args: {
        title: v.string(),
        description: v.string(),
        videoUrl: v.string(),
        thumbnailUrl: v.string(),
        category: v.string(),
        embeddings: v.array(v.float64())
    }, handler(ctx, args) {
        if (!args.title || !args.description || !args.videoUrl || !args.thumbnailUrl || !args.category) {
            throw new Error("All fields are required")
        };

        const video = ctx.db.insert("videos", {
            title: args.title,
            description: args.description,
            videoUrl: args.videoUrl,
            thumbnailUrl: args.thumbnailUrl,
            category: args.category,
            embeddings: args.embeddings
        })

        return video;
    }
})

//NOTE - Add new video
export const addVideo = action({
    args: {
        title: v.string(),
        description: v.string(),
        videoUrl: v.string(),
        thumbnailUrl: v.string(),
        category: v.string(),
    },
    handler: async (ctx, args) => {
        //Checks
        if (!args.title || !args.description || !args.videoUrl || !args.thumbnailUrl || !args.category) {
            throw new Error("All fields are required")
        };
        const combinedText = `${args.title} ${args.description} ${args.category}`;
        const embedding = await embed(combinedText);
        //TODO - Insert embeddings in DB
        await ctx.runMutation(internal.videos.insertVideo, {
            title: args.title,
            description: args.description,
            videoUrl: args.videoUrl,
            thumbnailUrl: args.thumbnailUrl,
            category: args.category,
            embeddings: embedding
        })
        return true;
    }
})

//NOTE - Query to fetch all videos
export const fetchAllVideos = query({
    args: {},
    handler: async (ctx) => {
        const results = await ctx.db.query("videos").collect();
        return results;
    }
})

//NOTE - Fetch video by id
export const fetchVideo = query({
    args: { id: v.id("videos") },
    handler: async (ctx, args) => {
        const doc = await ctx.db.get(args.id);
        return doc;
    }
})