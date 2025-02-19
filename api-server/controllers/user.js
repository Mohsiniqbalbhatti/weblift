import User from "../models/user.js";
import bcrypt from "bcrypt"
import { sendMail } from "../utils/mailSender.js";
export const signup = async (req,res)=>{
    try{
        const {email, password, name} = req.body;

        if (!email || !password || !name){
            return res.status(400).json({message: "All Fields are Required" });
        }
        
        const userExist = await User.findOne({email});

        if (userExist) return res.status(400).json({message: "User Already Exist! Kindly Login"});


        const hashedPassword = await bcrypt.hash(password, 10);


        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const user = new User({
            name: name,
            email:  email,
            password: hashedPassword,
        })

        await user.save();


        const to = email;
        const subject = `Kindly VErify Your WebLift Account`;
        const body = `<h1>Hey ${name}!</h1> \n <p> Kindly verify your Weblift account here is you verification link ` 
       await  sendMail(to, body, subject);



        return res.status(200).json({message : "Signup Success Kindly Verify your email."})
        


    }
    catch (error){
        console.log("Error Signup", error);
        res.status(500).json({message:"internal Server Error"})
    }
}