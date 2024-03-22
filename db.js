
const mongoose = require('mongoose');
let marhabaDB;
let Transactions;
async function initDB() {
    const url = "mongodb://0.0.0.0:27017/MarhabaDB";
    mongoose.connect(url, { useNewUrlParser: true });
    marhabaDB = mongoose.connection;
    console.log("DB Connected Successfully");
    // User model 
    Transactions = mongoose.model('Transactions', {
        transactionId: { type: String, unique: true, required: true },
        recognizedTexts: { type: Array },
        intents: { type: Array },
        action: { type: Object },
        intentType: { type: String },
        language: { type: String },
        device: { type: String }
    });

}

function findTransaction(transactionId) {
    // return Transactions;?
    console.log('findTransaction  ' + transactionId);
    return Transactions.findOne({ transactionId: transactionId })

}

function saveRecoginitions(obj) {
    // return Transactions;?
    console.log('saveTransaction  ');
    console.log(obj);
    // var transactions = new Transactions(obj)
    Transactions.findOneAndUpdate({ transactionId: obj.transactionId }, { $push: { recognizedTexts: obj.recognizedTexts } }, { upsert: true }, function (err, doc) {
        if (err) {
            console.log('err updating DV');
        } else {
            console.log(doc);
            console.log('Updated DB successfully');
        }
    });
}

function saveIntents(obj) {
    // return Transactions;?
    console.log('saveIntents  ');
    console.log(obj);
    // var transactions = new Transactions(obj)
    Transactions.findOneAndUpdate({ transactionId: obj.transactionId }, { intentType: obj.intentType, $set: { intents: obj.intents } }, { upsert: false }, function (err, doc) {
        if (err) {
            console.log('err updating DV');
        } else {
            console.log(doc);
            console.log('Updated DB successfully');
        }
    });
}

function saveAction(obj) {
    // return Transactions;?
    console.log('saveAction  ');
    console.log(obj);
    // var transactions = new Transactions(obj)
    Transactions.findOneAndUpdate({ transactionId: obj.transactionId }, {action: obj.action  }, { upsert: false }, function (err, doc) {
        if (err) {
            console.log('err updating Action DB');
            console.log(err);
        } else {
            console.log(doc);
            console.log('Updated Action successfully');
        }
    });
}

initDB().catch((err) => {
    console.error("Mongo DB Init error:", err);
});

module.exports = { initDB, saveRecoginitions, saveIntents, findTransaction, saveAction };
