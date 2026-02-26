import UserRegister from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


    const signUp = async (req,res)=>{
        try{
            const {usernamebox,emailbox,passbox} = req.body; 
            const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailpattern.test(emailbox)){
                return res.status(400).json({
                    success:false,
                    message:"Invalid Email Format"
                })
            }
            const existingemail = await UserRegister.findOne({emailbox})
            if(existingemail){
                return res.status(400).json({
                    success:false,
                    message:"Email already registered"
                })
            }
            
            const passpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
            if(!passpattern.test(passbox)){
                return res.status(400).json({
                    success:false,
                    message:"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
                })
            }
            
            // const salt = await bcrypt.genSalt(10);
            // const hashedpassbox = await bcrypt.hash(passbox,salt);

            const user = await UserRegister.create({usernamebox,emailbox,passbox,role:"user"});
            const token = jwt.sign({id:user._id,role:user.role},process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_IN});
            console.log(token);

            res.status(201).json({
                success:true,
                message:"User registered successfully",
                token,
                user:{
                    id:user._id,
                    usernamebox:user.usernamebox,
                    emailbox:user.emailbox,
                    role:user.role
                }
            })
        }
             catch(err){
                console.error(err);
                res.status(500).json({
                    success:false,
                    message:"Server Error"
                });
             }
            };
    
    const Login = async(req,res)=>{
        try{
            const {emailbox,passbox} = req.body;
            const finduser = await UserRegister.findOne({emailbox})
            if(!finduser)
                return res.status(400).json({
                    success:false,
                    message:"User doesn't exist"
                });

            const isMatch = await finduser.comparePassword(passbox);
            if(!isMatch)
                return res.status(400).json({
                    success:false,
                message:"Invalid Credentials"
            });

            if (finduser.isUserBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Please contact admin."
      });
    }

    if (finduser.role === "seller" && finduser.isSellerBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your seller account is blocked."
      });
    }
            const token = jwt.sign({id:finduser._id,role:finduser.role},process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_IN});

            res.status(200).json({
            success:true,
            message:"Login Successful",
            token,
            user:{
                id:finduser._id,
                usernamebox:finduser.usernamebox,
                emailbox:finduser.emailbox,
                role:finduser.role
                }
             })
        }catch(err){
            console.error(err);
            console.log(err);
            res.status(500).json({
                success:false,
                message:"Server Error"
            });
        }
    };

    const home= (req,res)=>{
        res.send("Welcome to User Controller Home Page");
    };


    // const applyseller = async (req,res)=>{
    //     try{
    //         const userId = req.user.id;
    //         const user = await UserRegister.findById(userId);
    //         if(!user){
    //             return res.status(404).json({
    //                 success:false,
    //                 message:"User not found"
    //             })
    //         }
            
    //         if(user.role=== "seller"){
    //             return res.status(400).json({
    //                 success:false,
    //                 message:"User is already a seller"
    //             });
    //         }

    //         user.isSellerRequested = true;
    //         await user.save();
    //         res.json({
    //             success:true,
    //             message:"Seller request submitted"
    //         });
    //     }
    //     catch(error){
    //         res.status(500).json({
    //             success:false,
    //             message:"Server Error"
    //         });
    //     }
    // };
export default {signUp,Login,home};