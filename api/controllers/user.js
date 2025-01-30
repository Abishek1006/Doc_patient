import Users from '../models/Users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error.js';
import logger from '../utils/logger.js';
import { validateEmail, validatePassword } from '../utils/validation.js';

export const register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      if (!validateEmail(email)) {
        throw new AppError(400, 'Invalid email format');
      }

      if (!validatePassword(password)) {
        throw new AppError(400, 'Password must be at least 8 characters long and contain numbers and letters');
      }

      const existingUser = await Users.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
        throw new AppError(409, 'User already exists');
      }

      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);

      const user = await Users.create({
        username,
        email,
        password: hash,
        isAdmin: req.body.isAdmin || false,
        isDoctor: req.body.isDoctor || false
      });

      logger.info(`New user registered: ${email}`);
    
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      next(err);
    }
};export const login = async(req, res, next) =>{

    try{
        const user = await Users.findOne({email: req.body.email});
        if(!user){
            return next(createError(404, 'User not Found'));
        } 

        const isPassword = await bcrypt.compare(req.body.password, user.password);
        if(!isPassword) {
            return next(createError(404, 'Password is not matched!'));
        }

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin, isDoctor: user.isDoctor}, process.env.JWT);
        const {password, ...others} = user._doc;
        res.cookie('access_token', token, {
            httpOnly: true
        })
        .status(200)
        .json({details: {...others}});
    }
    catch(err){
        next(err)
    }
}
export const viewUser = async (req, res, next) =>{
    try{
        const user = await Users.find();
        const {password, ...others} = user;
        res.status(200).json(user);
    }
    catch(err){
        next(err)
    }
}