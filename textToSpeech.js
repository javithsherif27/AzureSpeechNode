// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// <code>

// pull in the required packages.
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you save the synthesized audio.
var subscriptionKey = "1ed476c40baf49dda893a3e4442dae94";
var serviceRegion = "eastus"; // e.g., "westus"
var filename = "YourAudioFilej.wav";

// we are done with the setup

// now create the audio-config pointing to our stream and
// the speech config specifying the language.
var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

// create the speech synthesizer.
var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);


  // start the synthesizer and wait for a result.
  synthesizer.speakTextAsync('Happy New Year',
      function (result) {
    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
      console.log("synthesis finished.");
    } else {
      console.error("Speech synthesis canceled, " + result.errorDetails +
          "\nDid you update the subscription info?");
    }
    synthesizer.close();
    synthesizer = undefined;
  },
      function (err) {
    console.trace("err - " + err);
    synthesizer.close();
    synthesizer = undefined;
  });
// </code>