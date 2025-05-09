// // prisma/update_audio_urls.ts
// import { PrismaClient } from '@prisma/client';
// import dotenv from 'dotenv';

// // Load .env variables if needed (especially for DATABASE_URL)
// dotenv.config();

// const prisma = new PrismaClient();

// // !!! IMPORTANT: Replace with YOUR actual base URL !!!
// const SUPABASE_AUDIO_BASE_URL = "https://glndmsxbzokrqxxfzwof.supabase.co/storage/v1/object/public/word-audio/";
// const AUDIO_FILE_EXTENSION = ".mp3"; // Change if you used a different format like .ogg

// async function updateUrls() {
//   console.log("Fetching all words from DB...");
//   const words = await prisma.word.findMany({
//     select: { id: true }, // Only fetch IDs
//   });
//   console.log(`Found ${words.length} words. Starting update...`);

//   let updatedCount = 0;
//   let errorCount = 0;

//   for (const word of words) {
//     const expectedFileName = `${word.id}${AUDIO_FILE_EXTENSION}`;
//     const publicUrl = `${SUPABASE_AUDIO_BASE_URL}${expectedFileName}`;

//     try {
//       await prisma.word.update({
//         where: { id: word.id },
//         data: { audio_url: publicUrl },
//       });
//       updatedCount++;
//       if (updatedCount % 100 === 0) {
//         console.log(`Updated ${updatedCount} URLs...`);
//       }
//     } catch (error) {
//       console.error(`Failed to update URL for word ID ${word.id}:`, error);
//       errorCount++;
//     }
//   }

//   console.log("\n--- Update Summary ---");
//   console.log(`Successfully updated: ${updatedCount}`);
//   console.log(`Failed updates: ${errorCount}`);
//   console.log("--------------------");
// }

// updateUrls()
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });