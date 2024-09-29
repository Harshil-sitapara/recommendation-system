import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

const embeddings = new VoyageEmbeddings({
    apiKey: process.env.VOYAGEAI_API_KEY!,
    inputType: "query",
});

export const embed = async (text: string) => {
    try {
        const embedding = await embeddings.embedQuery(text);
        return embedding;
    } catch (error) {
        console.error("Error in embedding query: ", error);
        throw new Error("Embedding API call failed");
    }
};