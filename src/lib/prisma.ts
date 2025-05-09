// src/lib/prisma.ts
import { PrismaClient, Word, ExampleSentence } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// --- ADD HELPER FUNCTION ---
// Type definition for the word including its examples
export type WordWithExamples = Word & {
    exampleSentences: ExampleSentence[];
};

export async function getRandomWord(): Promise<WordWithExamples | null> {
    try {
        const wordCount = await prisma.word.count();
        if (wordCount === 0) {
            return null; // No words in the database
        }
        const skip = Math.floor(Math.random() * wordCount);
        const randomWords = await prisma.word.findMany({
            take: 1,
            skip: skip,
            include: {
                exampleSentences: true, // Include related example sentences
            },
        });
        return randomWords[0];
    } catch (error) {
        console.error("Error fetching random word:", error);
        // Depending on your error handling strategy, you might want to:
        // - return null
        // - throw the error
        // - return a default/error state object
        return null; // Keep it simple for now
    }
}
// --- END HELPER FUNCTION ---


export default prisma; // Export the default instance as well