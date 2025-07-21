import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { MESSAGES, STATUS_CODES } from 'src/constants/const';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>, private jwtService: JwtService,
  ) { }

  async signup(signupDto: SignupDto): Promise<any> {
    const { name, email, password } = signupDto;

    const existingUser = await this.authModel.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        msg: MESSAGES.EMAIL_EXISTS,
        statusCode: STATUS_CODES.BAD_REQUEST,
        data: {}
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let rndm = Math.random().toString();
    const newUser = new this.authModel({
      name,
      email,
      password: hashedPassword,
      tokenTracker: rndm
    });

    const savedUser = await newUser.save();

    const payload = { sub: savedUser._id, email: savedUser.email, tokenTracker: savedUser.tokenTracker };

    const token = this.jwtService.sign(payload);
    let user = {
      ...savedUser.toObject(),
      token: token
    }

    return {
      msg: MESSAGES.SIGNUP_DONE,
      success: true,
      statusCode: STATUS_CODES.CREATED,
      data: user,
    };

  }

  async login(loginDto: LoginDto): Promise<any>{

    let {email, password} = loginDto
    let exists = await this.authModel.findOne({email})

    if(!exists) {
      return {
        success: false,
        data: {},
        msg: MESSAGES.WRONG_CREDENTIALS,
        statusCode: 401
      }
    }

    let isPassMatch = await bcrypt.compare(loginDto.password, exists.password)
    if(!isPassMatch){
      return {
        success: false,
        data: {},
        msg: MESSAGES.WRONG_CREDENTIALS,
        statusCode: 401
      }
    }
    let rndm = Math.random().toString();
    exists.tokenTracker = rndm;
    await exists.save() 
    const payload = { sub: exists._id, email: exists.email, tokenTracker: rndm };

    const token = this.jwtService.sign(payload);
    let user = {
      ...exists.toObject(),
      token: token
    }

    return {
      success: true,
      data: user,
      msg: MESSAGES.LOGIN_DONE,
      statusCode: 200
    }

  }

  async getProfile(userId:string): Promise<any> {
    const userData = await this.authModel.findOne({ _id: userId });
    if (!userData) {
      return {
        success: false,
        msg: MESSAGES.NOT_FOUND,
        statusCode: STATUS_CODES.BAD_REQUEST,
        data: {}
      }
    }

    return {
      msg: MESSAGES.USER_DATA_LOADED,
      success: true,
      statusCode: STATUS_CODES.OK,
      data: userData,
    };

  }

}
