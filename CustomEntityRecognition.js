// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * This sample program demonstrates how to detect entities using custom models
 * built using Azure Language Studio.
 *
 * @summary detects custom text in a piece of text
 */

const { AzureKeyCredential, TextAnalysisClient } = require("@azure/ai-language-text");
const { saveIntents, findTransaction } = require("./db");
// Load the .env file if it exists

// You will need to set these environment variables or edit the following values
const endpoint = "https://languageaimarhaba.cognitiveservices.azure.com/";
const apiKey = "454ed67d8f1341cfaa610a793b0617e2";
const deploymentName = "MarhabaCNER2Depl";
const projectName = "MarhabaCNER";

// const documents = [
//   "Date 6/28/2019 This is a Loan agreement between the two individuals mentioned below in the parties section of the agreement.I. Parties of agreement- Jennifer Wilkins with a mailing address of 4759 Reel Avenue, City of Las Cruces, State of New Mexico (theBorrower)- Libby Harrison with a mailing address of 3093 Keyser Ridge Road, City of Greensboro, State of North Carolina (the Lender"
// ];

const intentAnalyzer = {

  "Transfer": ["TransferAmount", "TransferFromAccount", "TransferToAccount"],
  "Trade": ["TransferAmount", "TransferFromAccount", "TransferToAccount"],

}

// - Entity "OK," of type TransferAmount
//         - Entity "transfer" of type TransferAction
//         - Entity "500 AED" of type TransferAmount
//         - Entity "my current account" of type TransferFromAccount
//         - Entity "my" of type TransferFromAccount
//         - Entity "wife" of type TransferToAccount

async function findCNER(documents, io, transactionId) {
  console.log("== Custom Entity Recognition");
  const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  const actions = [
    {
      kind: "CustomEntityRecognition",
      deploymentName,
      projectName,
    },
  ];
  const poller = await client.beginAnalyzeBatch(actions, documents, "en");
  const results = await poller.pollUntilDone();

  for await (const actionResult of results) {
    if (actionResult.kind !== "CustomEntityRecognition") {
      throw new Error(`Expected a CustomEntityRecognition results but got: ${actionResult.kind}`);
    }
    if (actionResult.error) {
      const { code, message } = actionResult.error;
      throw new Error(`Unexpected error (${code}): ${message}`);
    }
    for (const result of actionResult.results) {
      console.log(`- Document ${result.id}`);
      if (result.error) {
        const { code, message } = result.error;
        throw new Error(`Unexpected error (${code}): ${message}`);
      }
      console.log("\tRecognized Entities:");

      let intentType = '';
      for (const entity of result.entities) {
        console.log(`\t- Entity "${entity.text}" of type ${entity.category}`);
        if (entity.category === 'TransferAction') {
          intentType = 'Transfer';
        }else if (entity.category === 'TradeAction') {
          intentType = 'Trade';
        }else if (entity.category === 'PaybillAction') {
          intentType = 'Pay Bill';
        }else if (entity.category === 'ShowDetailsAction') {
          intentType = 'Show Details';
        }else if (entity.category === 'GTAction') {
          intentType = 'GT Enquiry';
        }

      }
      await saveIntents({ transactionId: transactionId, intents: result.entities, intentType: intentType });


      if (intentType !== '') {

        io.emit('endTransaction', ` ${intentType} action completed successfully`);
        // findTransaction(transactionId).then((docs) => {
        //   console.log('javiiii');
        //   console.log(docs);
        //   analyseEvent(intentType, docs);


        // })
        //   .catch((err) => {
        //     return err
        //   });;

      } else {
        io.emit('endTransaction', ` Sorry, Unable to understand the command. Please retry`);
      }
    }
  }


  function analyseEvent(intentType, transaction, io) {
    console.log('Inside analyseEvent ' + intentType);
    console.log(transaction);

    if (intentType === 'Transfer') {
      console.log('Insidee Transferrr switch ');
      let transferModel = { TransferAmount: '', TransferFromAccount: '', TransferToAccount: '' }


      transaction.intents.forEach(intent => {

        transferModel[intent.category] = intent.text;

      });
      console.log('done Transferrr switch ');
      console.log(transferModel);
      let missingCategories = '';
      Object.keys(analysedIntent).forEach(key => {
        if (obj[key] == undefined)
          missingCategories += key + ' ';
      })
      console.log(' Missing Categories ' + missingCategories);
      if (missingCategories === '') {
        io.emit('endTransaction', ` ${intentType} action completed successfully`);
      } else {
        io.emit('intent-req', ` ${intentType} action incomplete. Please provide ${missingCategories}`);
      }

    }
    else {

      io.emit('endTransaction', ` ${intentType} action completed successfully`);
    }


  }
}

// findCNER().catch((err) => {
//   console.error("The sample encountered an error:", err);
// });


module.exports = { findCNER };