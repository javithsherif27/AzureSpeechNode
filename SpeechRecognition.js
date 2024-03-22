const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const { findIntents } = require("./CLUprocessor");
const {saveRecoginitions} = require("./db");
// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
// const speechConfig = sdk.SpeechConfig.fromSubscription('0d7c9e9d2645464a97329c565f9fd706', 'eastus');
const speechConfig = sdk.SpeechConfig.fromSubscription('1ed476c40baf49dda893a3e4442dae94', 'eastus');
speechConfig.speechRecognitionLanguage = "ar-AE";


module.exports = {

    convertAudio :async function(message,io) {
        let audioConfig = sdk.AudioConfig.fromWavFileInput(message.file);
        // let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        var autoDetectSourceLanguageConfig = sdk.AutoDetectSourceLanguageConfig.fromLanguages(["en-US" /*, "ta-IN","ru-RU","hi-IN" */]);
        var speechRecognizer = sdk.SpeechRecognizer.FromConfig(speechConfig, autoDetectSourceLanguageConfig, audioConfig);
     
    
        // speechRecognizer.recognizeOnceAsync((result) => {
             
        // },
        // {});
       await speechRecognizer.recognizeOnceAsync(result => {
       // console.log(result);
            switch (result.reason) {
                case sdk.ResultReason.RecognizedSpeech:
                    console.log(`RECOGNIZED: Text=${result.text}`);
                    
                    saveRecoginitions({transactionId : message.transactionId, recognizedTexts :result.text });


                    findIntents([result.text],io,message.transactionId)
                    io.emit('userInput', result.text);
                    console.log('EMittedd');
                    break;
                case sdk.ResultReason.NoMatch:
                    console.log("NOMATCH: Speech could not be recognized.");
                    io.emit('message', "NOMATCH: Speech could not be recognized.");
                    break ;
                case sdk.ResultReason.Canceled:
                    const cancellation = sdk.CancellationDetails.fromResult(result);
                    console.log(`CANCELED: Reason=${cancellation.reason}`);
    
                    if (cancellation.reason == sdk.CancellationReason.Error) {
                        console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                        console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                        console.log("CANCELED: Did you set the speech resource key and region values?");
                    }
                    io.emit('message', `CANCELED: Reason=${cancellation.reason}`);
                    break ;
            }
            speechRecognizer.close();
        });

        
}
}