import jwt from 'jsonwebtoken';
import { zod } from 'zod';

import User from '../models/user';

import { JWT_SECRET } from '../config';

const usernameSchema=zod.email();
const nameSchema=zod.string().min(3);
const passwordSchema=zod.string().min(6);

export const signup=async (req,res,next)=>{
    const username=req.body.username;
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const password=req.body.password;
    try{
        const usernameRes=usernameSchema.safeParse(username);
        const firstNameRes=nameSchema.safeParse(firstName);
        const lastNameRes=nameSchema.safeParse(lastName);
        const passwordRes=passwordSchema.safeParse(password);

        if(!(usernameRes.success===true && firstNameRes.success===true && lastNameRes.success===true && passwordRes.success===true)){
            throw new Error("Email already taken / Incorrect inputs");
        }

        const user=await User.fineOne({username:username});
        if(user){
            throw new Error("Email already taken / Incorrect inputs");
        } 

        const newUser=new User({
            username:username,
            firstName:firstName,
            lastName:lastName,
            password:password
        });

        const savedUser=await newUser.save();

        const token=jwt.sign({
            userId:savedUser._id
        },JWT_SECRET);

        return res.status(200).json({
            token:token,
            message:'User successfully created!'
        });
    } catch(err){
        const message=err.msg;
        return res.status(411).json({
            message:message
        });
    }
}

export const signin=async (req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;
    try{
        const user=await User.findOne({username:username});
        if(!user || user.password!==password){
            throw new Error('');
        }

        const token=jwt.sign({
            userId:user._id
        },JWT_SECRET);

        return res.status(200).json({
            token:token
        });
    } catch(err){
        return res.status(411).json({
            message:'Error while logging in'
        });
    }
}

export const updateUser=async (req,res,next)=>{
    const password=req.body.password;
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    try{
        const user=await User.findOne({_id:req.userId});

        if(password && password!==''){
            const passwordRes=passwordSchema.safeParse(password);
            if(passwordRes.success){
                user.password=password;
            } else{
                return res.status(411).json({
                    message:'Error while updating information'
                });
            }
        }

        if(firstName && firstName!==''){
            const firstNameRes=nameSchema.safeParse(firstName);
            if(firstNameRes.success){
                user.firstName=firstName;
            } else{
                return res.status(411).json({
                    message:'Error while updating information'
                });
            }
        }

        if(lastName && lastName!==''){
            const lastNameRes=nameSchema.safeParse(lastName);
            if(lastNameRes.success){
                user.lastName=lastName;
            } else{
                return res.status(411).json({
                    message:'Error while updating information'
                });
            }
        }

        await user.save();

    } catch(err){
        return res.status(411).json({
            message:'Error while updating information'
        });
    }
}

export const filterUsers=async (req,res,next)=>{
    const filter=req.query.filter;
    try{
        const users=await User.find({
            $or:[
                {firstName:{
                    "$regex":filter,
                    "$options":'i'
                }},
                {lastName:{
                    "$regex":filter,
                    "$options":'i'
                }}
            ]
        },'firstName lastName');

        return res.status(200).json({
            users:users
        });
    } catch(err){
        return res.status(500).json({
            message:'Something went wrong!'
        });
    }
}