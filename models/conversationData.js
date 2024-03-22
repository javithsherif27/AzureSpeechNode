const mongoose =require('mongoose');

const conversationSchema = mongoose.Schema({
    uploadFile: {
        type: Object
    }

})

var conversationdata=mongoose.model('conversationdata',conversationSchema);
module.exports= conversationdata;