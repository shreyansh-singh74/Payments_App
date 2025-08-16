const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware');
const { Account, User } = require('../db'); // Add User import
const { default: mongoose } = require('mongoose');



router.get('/balance',authMiddleware,async(req,res)=>{
    try {
        const userId = req.userId;
        console.log('UserId from middleware:', userId);
        console.log('UserId type:', typeof userId);
        
        const accountBalance = await Account.findOne({
            userId: userId
        });

        return res.status(200).json({
            message : "Balance Retrived Successfully",
            balance : accountBalance 
        });
    } catch (error) {
        console.error('Balance route error:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

router.post('/transfer', authMiddleware, async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        
        const { amount, to } = req.body;    
        
        console.log({amount,to}); //debug
        
        // Find the recipient account by user ID or username
        let toAccount;
        
        // Check if 'to' is a valid ObjectId (user ID)
        if (mongoose.Types.ObjectId.isValid(to)) {
            toAccount = await Account.findOne({ userId: to }).session(session);
        } else {
            // Assume it's a username/email, find user first then account
            const toUser = await User.findOne({ username: to }).session(session);
            if (toUser) {
                toAccount = await Account.findOne({ userId: toUser._id }).session(session);
            }
        }

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        // Find sender's account
        const fromAccount = await Account.findOne({ userId: req.userId }).session(session);

        if (!fromAccount || fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: toAccount.userId }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Export the router
module.exports = router;