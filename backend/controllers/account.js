import { startSession } from "mongoose";
import Account from "../models/account";

export const getBalance=async (req,res,next)=>{
    try{
        const userId=req.userId;

        const userAccount=await Account.findOne({userId:userId});

        return res.status(200).json({
            balance:userAccount.balance
        });
    } catch(err){
        return res.status(500).json({
            message:'Internal server error.'
        });
    }
};

export const updateBalance=async (req,res,next)=>{
    const senderId=req.userId;
    const receiverId=req.body.to;
    const amount=req.body.amount;
    try{
        const session=await startSession();

        await session.withTransaction(async ()=>{
            try{
                const senderAccount=await Account.findOne({userId:senderId}).session(session);
                const receiverAccount=await Account.findOne({userId:receiverId}).session(session);

                if(senderAccount.balance<amount){
                    const err={
                        message:'Insufficient funds!'
                    };
                    throw new Error(err);
                }

                if(!receiverAccount){
                    const err={
                        message:'Invalid account!'
                    };
                    throw new Error(err);
                }

                senderAccount.balance-=amount;
                receiverAccount.balance+=amount;

                await senderAccount.save({session:session}).session(session);

                await receiverAccount.save({session:session}).session(session);

                await session.commitTransaction();

                return res.status(200).json({
                    message:'Transfer successful!'
                });
            } catch(err){
                await session.abortTransaction();

                throw err;
            } finally{
                await session.endSession();
            }
        });
    } catch(err){
        return res.status(400).json({
            message:err.message
        });
    }
}