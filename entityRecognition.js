// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Uses the entity recognition endpoint to detect entities in a document using
 * Named Entity Recognition (NER) and prints them along with their recognized
 * entity type.
 *
 * @summary detects entities in a piece of text
 */

const { TextAnalysisClient, AzureKeyCredential } = require("@azure/ai-language-text");

// // Load the .env file if it exists
// require("dotenv").config();

// You will need to set these environment variables or edit the following values
const endpoint = "https://languageaimarhaba.cognitiveservices.azure.com/";
const apiKey = "454ed67d8f1341cfaa610a793b0617e2";

const documents = [
  "Transfer 500 AED to my Wife's account",
  "Buy 200 shares of Apple INC"
];

async function main() {
  console.log("== Recognize Entities Sample ==");

  const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

  const results = await client.analyze("EntityRecognition", documents);

  for (const result of results) {
    console.log(`- Document ${result.id}`);
    if (!result.error) {
      console.log("\tRecognized Entities:");
      for (const entity of result.entities) {
        console.log(`\t- Entity ${entity.text} of type ${entity.category}`);
      }
    } else console.error("\tError:", result.error);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };
