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

router.post('/transfer',authMiddleware,async(req,res)=>{
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        const { amount, to } = req.body;
        console.log('Transfer request - amount:', amount, 'to:', to, 'from userId:', req.userId);

        const acc = await Account.findOne({
            userId: req.userId
        }).session(session);

        if(!acc || acc.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message : "Insufficient Balance"
            });
        }

        // Fix: 'to' should be a userId (ObjectId), not username/email
        // If 'to' is a username, first find the user to get their ObjectId
        const toUser = await User.findOne({ username: to });
        if (!toUser) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "User not found"
            });
        }

        const toAcc = await Account.findOne({
            userId: toUser._id  // Use the ObjectId, not the username
        }).session(session);

        if(!toAcc){
            await session.abortTransaction();
            return res.status(400).json({
                message : "Invalid Account"
            });
        }

        // Perform The Transfer
        // Decreasing value
        await Account.updateOne({
            userId : req.userId
        },{
            $inc : {
                balance : -amount
            }
        }).session(session);

        // Increasing Value
        await Account.updateOne({
            userId : toUser._id  // Use the ObjectId
        },{
            $inc:{
                balance : amount
            }
        }).session(session);

        //Commit Transaction
        await session.commitTransaction();
        
        return res.status(200).json({
            message: "Transfer successful"
        });
    } catch (error) {
        console.error('Transfer error:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

// Export the router
module.exports = router;