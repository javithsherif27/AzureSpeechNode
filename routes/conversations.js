const express = require("express");

const  conversation_Act = require("../controllers/conversations"); 

const router = express.Router();

router.get('/', conversation_Act.getConversations);
router.get('/:id', conversation_Act.getspecConversation);
router.post('/', conversation_Act.createconversation);
router.patch('/:id', conversation_Act.updateconversation);
router.delete('/:id', conversation_Act.deleteconversation);

module.exports=router;