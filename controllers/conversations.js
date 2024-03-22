const express= require('express');
const mongoose= require('mongoose');

const Conversation= require('../models/conversationData.js');

const router= express.Router();

const getConversations = async (req, res) => {
    try {
        const conversation= await Conversation.find();
        
        res.status(200).json(conversation);
    } catch(error) {
        res.status(404).json({message: error.message});
    }
}

const getspecConversation = async (req,res) => {
    const id = req.params.id;

    try {
        const stud = await Conversation.findOne({id: id});

        res.status(200).json(stud);
    } catch(error) {
        res.status(404).json({ message: error.message});
    }
}

const createconversation =  async (req, res) => {
    console.log(req.body);
    const newconversation = new Conversation({
        id:req.body.id,
        data:req.body.data
    })
    try {
        await newconversation.save();

        res.status(201).json(newconversation);

    } catch(error) {
        res.status(400).json({ message : error.message});
    }

}

const updateconversation = async (req, res) => {
    const id= req.params.id;
    try{
        await Conversation.findOneAndUpdate({
            id: id,
        },
        {   
            id:req.body.id,
            data:req.body.data
        }
        )
        res.status(202).json({id: id});

    } catch (error) {
        res.status(401).json({message: error.message});
    }
    
}

const deleteconversation = async (req, res) => {
    const id= req.params.id;

    try {
        await Conversation.findOneAndRemove({id: id});
        res.status(203).json({id:id});

    }catch(error) {
        res.status(402).json({message: error.message});
    }
}

module.exports.getConversations= getConversations;
module.exports.createconversation= createconversation;
module.exports.getspecConversation= getspecConversation;
module.exports.updateconversation= updateconversation;
module.exports.deleteconversation= deleteconversation;