// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This sample uses the key-phrase extraction endpoint to determine which
 * words or phrases in a document are of particular importance.
 *
 * @summary extracts key phrases from a piece of text
 */

const { TextAnalysisClient, AzureKeyCredential } = require("@azure/ai-language-text");

const endpoint = "https://languageaimarhaba.cognitiveservices.azure.com/";
const apiKey = "454ed67d8f1341cfaa610a793b0617e2";

const documents = [
  "Redmond is a city in King County, Washington, United States, located 15 miles east of Seattle.",
  "I need to take my cat to the veterinarian.",
  "I will travel to South America in the summer.",
  "Transfer 500 AED to my Wife's account",
  "Buy 200 shares of Apple INC"
];

async function main() {
  console.log("== Extract Key Phrases Sample ==");

  const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

  const results = await client.analyze("KeyPhraseExtraction", documents);

  for (const result of results) {
    console.log(`- Document ${result.id}`);
    if (!result.error) {
      console.log("\tKey phrases:");
      for (const phrase of result.keyPhrases) {
        console.log(`\t- ${phrase}`);
      }
    } else {
      console.error("  Error:", result.error);
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };