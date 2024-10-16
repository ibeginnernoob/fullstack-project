import mongoose from 'mongoose';

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    balance:{
        type:Number,
        required:true
    }
});

const Account=mongoose.model('Account',accountSchema);

export default Account;