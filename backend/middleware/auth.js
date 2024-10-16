import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';

export const authMiddleWare=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const authString=req.headers.authorization.split(" ")[0];

        if(authString!=='Bearer'){
            return res.status(403).json({
                message:'Not Authorized!'
            });
        }

        const isAuth=jwt.verify(token,JWT_SECRET);

        if(!isAuth.success){
            throw new Error('');
        }

        req.userId=isAuth.data.userId;

        next();
    } catch(err){
        return res.status(403).json({
            message:'Not Authorized!'
        });
    }
}