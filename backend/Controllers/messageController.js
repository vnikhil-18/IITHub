const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const generateToken = require('../config/generateToken');
const Message = require('../Models/messageModel');
const Chat = require('../Models/chatModel');
const fileUpload = require('express-fileupload');
const binary = require('mongodb').Binary;
const fs = require('fs');
const path = require('path');
const sendMessage = asyncHandler(async (req, res) => {
    if (req.files !== undefined) {
        if (req.files.file.size > 1024 * 1024 * 16) {
            res.status(400);
            throw new Error("File too large");
        }
        const { chatId } = req.body;
        const fileData = req.files.file.data;
        const binaryData = Buffer.from(fileData, 'base64');
        var newMessage = {
            sender: req.user._id,
            content: req.files.file.name,
            chat: chatId,
            file: new binary(binaryData),
        }
        try {
            var message = await Message.create(newMessage);
            message = await message.populate("sender", "name pic");
            message = await message.populate("chat");
            message = await User.populate(message, {
                path: "chat.users",
                select: "name pic email"
            });
            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
            res.json(message);
        } catch (error) {
            res.status(400);
            throw new Error(error);
        }
    }
    else {
        const { content, chatId } = req.body;
        if (!content || !chatId) {
            res.status(400);
            throw new Error("Invalid data");
        }
        var newMessage = {
            sender: req.user._id,
            content,
            chat: chatId
        }
        try {
            var message = await Message.create(newMessage);
            message = await message.populate("sender", "name pic");
            message = await message.populate("chat");
            message = await User.populate(message, {
                path: "chat.users",
                select: "name pic email"
            });
            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
            res.json(message);

        } catch (error) {
            res.status(400);
            throw new Error(error);
        }
    }
});
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email collegeName branch userType").populate("chat");
        res.json(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
const downloadFile = asyncHandler(async (req, res) => {
    try {
        const messageId = req.params.messageId;
        console.log(messageId)
        const msg = await Message.findById(messageId);
        let buffer = msg.file;
        let name = Date.now() + msg.content;
        fs.writeFileSync(path.join(__dirname, '../../frontend/public', name), buffer);

        res.json({ status: name }).status(200);
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
const deleteMessage = asyncHandler(async (req, res) => {
    const id = req.params.msgid;
    console.log(id)
    try {
        const result = await Message.findByIdAndDelete(id);
        console.log(result);

        if (result === null) {
            res.status(404).send("Message not found");
        }
        else {
            res.status(200).send("Message deleted");
            console.log(result);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
})
module.exports = { sendMessage, allMessages, downloadFile, deleteMessage };