const axios = require('axios');
const { saveIntents, saveAction } = require("./db");
let data = {
    "kind": "Conversation",
    "analysisInput": {
        "conversationItem": {
            "id": "1",
            "participantId": "1",
            "text": ""
        }
    },
    "parameters": {
        "projectName": "MarhabaIntentCLU",
        "deploymentName": "MarhabaIntentModelDeployment",
        "stringIndexType": "TextElement_V8"
    }
};

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://marhabalangres.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2023-04-01',
    headers: {
        'Ocp-Apim-Subscription-Key': '371efd3c3bb549039a314bfc77433347',
        'Content-Type': 'application/json'
    },
    data: data
};

async function findIntents(documents, io, transactionId) {
    config.data.analysisInput.conversationItem.text = documents[0];
    console.log('CLU PROCESSOR');
    console.log(config);
    console.log(documents);
    axios.request(config)
        .then(async (response) => {
            console.log('Got CLU Response')
            console.log(JSON.stringify(response.data));
            const predictedTopIntent = response.data.result.prediction.topIntent;
            const predictions = response.data.result.prediction;
            const intents = response.data.result.prediction.intents;
            const filteredEntity = intents.find(intent => intent.category === predictedTopIntent);
            console.log('filteredEntity confidenceScore' + filteredEntity.confidenceScore);
            if (predictedTopIntent !== '' && (filteredEntity && filteredEntity.confidenceScore > 0.7)) {

                analyzeEntities(predictedTopIntent, predictions.entities, io,transactionId);


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
             await saveIntents({ transactionId: transactionId, intents:predictions, intentType: predictedTopIntent });
        })
        .catch((error) => {
            console.log(error);
        });

}

function analyzeEntities(predictedTopIntent, entities, io,transactionId) {
    switch (predictedTopIntent) {
        case 'Transfer':
            const transferModel = { Amount: '', TransferFromAccount: '', TransferToAccount: '' };
            checkMissedEntityAndProcessAction(transferModel, entities, io, predictedTopIntent,transactionId);
            break;

        case 'Trade':
            const tradeModel = { TradeStockName: '', TradeQuantity: '', TradeType: '', TradeExchange: '', Amount: '' };
            checkMissedEntityAndProcessAction(tradeModel, entities, io, predictedTopIntent,transactionId);
            break;

            case 'PayBills':
            const payBillModel = { BillVendor: '' };
            checkMissedEntityAndProcessAction(payBillModel, entities, io, predictedTopIntent,transactionId);
            break;

            case 'GT':
            const GTModel = { GTCategory: '',GTPeriod: '' };
            checkMissedEntityAndProcessAction(GTModel, entities, io, predictedTopIntent,transactionId);
            break;

        default:
            break;
    }

}

async function checkMissedEntityAndProcessAction(model, entities, io, predictedTopIntent,transactionId) {
    let missedEntities = '';
    let resultAction = '';
    Object.keys(model).forEach(key => {

        const entity = entities.find(entity => entity.category === key);
        if (entity) {
            model[key] = entity.text;
            resultAction += key + ' -> ' + entity.text + ' ::: \n';
        } else {
            missedEntities += key + ' , ';

        }
    });
    if (missedEntities === '') {

        io.emit('endTransaction', ` ${predictedTopIntent} action completed successfully. \n  ${resultAction}`);
        model.intentType = predictedTopIntent;
        await saveAction({ transactionId: transactionId, action:model });
    } else {
        io.emit('intent-req', ` ${predictedTopIntent} action needs further information. Please provide ${missedEntities}`);
    }
}



module.exports = { findIntents };
