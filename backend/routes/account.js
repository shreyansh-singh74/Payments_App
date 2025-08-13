const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');



router.get('/balance',authMiddleware,async(req,res)=>{
    const userId = req.userId;
    
    const accountBalance = await Account.findOne({
        userId: userId
    });


    return res.status(200).json({
        message : "Balance Retrived Successfully",
        balance : accountBalance 
    });
});

router.post('/transfer',authMiddleware,async(req,res)=>{
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    const { amount,to } = req.body;

    const acc = await Account.findOne({
        userId:req.userId
    }).session(session);

    if(!acc || acc.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message : "Insufficient Balance"
        });
    }

    const toAcc = await Account.findOne({
        userId : to
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
        userId : to
    },{
        $inc:{
            balance : amount
        }
    }).session(session);

    //Commit Transacation
    await session.commitTransaction();

    return res.status(200).json({
        message : "Transfer successful" 
    });
});


// Export the router
module.exports = router