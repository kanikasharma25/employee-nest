import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
  ) {}

  async signup(signupDto: SignupDto): Promise<any> {
    const { name, email, password } = signupDto;

    // check if email already exists
    const existingUser = await this.authModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.authModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return {
      message: 'Signup successful',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    };
  }
}
