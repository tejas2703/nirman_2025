import mongoose from "mongoose"
import { Schema } from "mongoose"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,    
    },
    phone: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
}) 

//mongoose middleware hooks
userSchema.pre( //pre middleware-event to write a function before saving the document -plugins
    "save",  //type of document middleware , querry middleware - findOne etc.
    async function(next){
        if(this.isModified("password")){
            try{
                this.password = await bcrypt.hash(this.password, 10);
                next();
            }
            catch(err){
                console.log(err);
                next(err);
            }
        } else {
                next();
            }
    }
);

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({   //payload
        _id: this._id,
        email: this.email,
        // username: this.username,
        // fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
)
}

export const User = mongoose.model("User", userSchema)
