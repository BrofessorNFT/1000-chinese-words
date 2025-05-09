// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync'; // Use synchronous parser for simplicity in scripts

const prisma = new PrismaClient();

// Define the structure matching CSV headers
interface CsvRow {
  hanzi: string;
  pinyin: string;
  translation_eng: string;
  example_sentence_1_hanzi: string;
  example_sentence_1_pinyin: string; // Keep for potential future use
  example_sentence_1_eng: string;
  example_sentence_2_hanzi: string;
  example_sentence_2_pinyin: string; // Keep for potential future use
  example_sentence_2_eng: string;
}

async function main() {
  console.log(`Start seeding ...`);
  const csvFilePath = path.join(__dirname, 'data.csv');

  if (!fs.existsSync(csvFilePath)) {
    console.error(`Error: CSV file not found at ${csvFilePath}`);
    process.exit(1);
  }

  // Read file content (ensure UTF-8)
  const csvFileContent = fs.readFileSync(csvFilePath, { encoding: 'utf8' });

  let records: CsvRow[];
  try {
    // Parse the CSV content using csv-parse
    records = parse(csvFileContent, {
      columns: true,           // Use the header row to determine object keys
      skip_empty_lines: true,  // Skip lines that are empty
      trim: true,              // Trim whitespace from headers and fields
      relax_column_count: false, // Be strict about the number of columns initially
      // relax_quotes: true,   // Consider enabling if quote issues persist, but try without first
      // escape: '\\',         // Default escape is usually fine ('"')
    });
    console.log(`Successfully parsed ${records.length} records from CSV.`);
  } catch (error: any) {
    console.error('Error parsing CSV:', error.message);
    // Attempt parsing with relaxed column count for better debugging info
    try {
      console.log("Attempting parse with relaxed column count for debugging...")
      const relaxedRecords = parse(csvFileContent, {
         columns: true, skip_empty_lines: true, trim: true, relax_column_count: true
      });
      // Log the record that likely caused the issue (often the last one processed before error)
      if (error.code === 'CSV_INCONSISTENT_RECORD_LENGTH' && error.record) {
           console.error("Problematic row (relaxed parsing):", error.record)
      }
    } catch (relaxedError) {
       console.error("Could not re-parse with relaxed settings.")
    }
    process.exit(1);
  }


  console.log("Starting database seeding...");
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const row of records) {
    // Basic validation
    if (!row.hanzi || !row.pinyin || !row.translation_eng) {
      console.warn(`Skipping row due to missing core data: ${JSON.stringify(row)}`);
      skippedCount++;
      continue;
    }

    try {
      // --- FULL UPSERT LOGIC ---
      await prisma.word.upsert({
        where: {
          hanzi_pinyin: { // Compound unique key
            hanzi: row.hanzi,
            pinyin: row.pinyin,
          },
        },
        // === UPDATE block (if word exists) ===
        update: {
          translation_en: row.translation_eng,
          exampleSentences: {
            // Delete existing examples for this word first
            deleteMany: {},
            // Create new examples from the current row data
            create: [
              // Example 1 (only if hanzi and eng exist)
              ...(row.example_sentence_1_hanzi && row.example_sentence_1_eng
                ? [{
                    sentence_hanzi: row.example_sentence_1_hanzi,
                    // Add pinyin/translation if available and needed in model:
                    // sentence_pinyin: row.example_sentence_1_pinyin,
                    // sentence_translation_en: row.example_sentence_1_eng,
                  }]
                : []),
              // Example 2 (only if hanzi and eng exist)
              ...(row.example_sentence_2_hanzi && row.example_sentence_2_eng
                ? [{
                    sentence_hanzi: row.example_sentence_2_hanzi,
                    // sentence_pinyin: row.example_sentence_2_pinyin,
                    // sentence_translation_en: row.example_sentence_2_eng,
                  }]
                : []),
            ].filter(Boolean), // Filter out any null/undefined entries
          },
        },
        // === CREATE block (if word doesn't exist) ===
        create: {
          hanzi: row.hanzi,
          pinyin: row.pinyin,
          translation_en: row.translation_eng,
          audio_url: null, // No audio yet
          exampleSentences: {
            create: [
              // Example 1
              ...(row.example_sentence_1_hanzi && row.example_sentence_1_eng
                ? [{
                    sentence_hanzi: row.example_sentence_1_hanzi,
                    // sentence_pinyin: row.example_sentence_1_pinyin,
                    // sentence_translation_en: row.example_sentence_1_eng,
                   }]
                : []),
              // Example 2
              ...(row.example_sentence_2_hanzi && row.example_sentence_2_eng
                ? [{
                    sentence_hanzi: row.example_sentence_2_hanzi,
                    // sentence_pinyin: row.example_sentence_2_pinyin,
                    // sentence_translation_en: row.example_sentence_2_eng,
                  }]
                : []),
            ].filter(Boolean), // Filter out any null/undefined entries
          },
        },
      });
      processedCount++;
      // Optional: Add a log every N records to show progress
      if (processedCount % 100 === 0) {
          console.log(`Processed ${processedCount} records...`);
      }

    } catch (error) {
      console.error(`\n--- Error processing DB operation for row: ${JSON.stringify(row)} ---`);
      console.error(error);
      errorCount++;
      // Decide if you want to stop on the first DB error or continue
      // For now, we'll log and continue
    }
  } // End for loop

  console.log(`\n--- Seeding Summary ---`);
  console.log(`Successfully processed (upserted): ${processedCount}`);
  console.log(`Skipped due to missing core data: ${skippedCount}`);
  console.log(`Encountered database errors: ${errorCount}`);
  console.log(`-----------------------`);

  if (errorCount > 0) {
      console.warn("Seeding completed, but some database operations failed. Check logs above.");
  } else {
      console.log("Seeding finished successfully.");
  }
} // End main function

main()
  .catch(async (e) => {
    console.error('\nAn unexpected error occurred during seeding execution:');
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });