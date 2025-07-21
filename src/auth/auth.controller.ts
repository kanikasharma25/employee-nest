
import { Body, Controller, Post, Res, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { response } from 'src/utils/response';
import { Request, Response } from 'express';
import { MESSAGES } from 'src/constants/const';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/constants/interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  // @UseGuards(JwtAuthGuard)
  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    try {
      const { success, data, statusCode, msg } = await this.authService.signup(signupDto);
      if (!success) {
        return response.badRequest(res, msg, data, statusCode)
      }
      return response.success(res, msg, data, statusCode)
    } catch (err) {
      console.error(err);
      return response.serverError(res, MESSAGES.SOMETHING_WENT_WRONG, err.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      let u = req.user as JwtPayload
      const {success,data,msg,statusCode} = await this.authService.getProfile(u.userId)
      if (!success) {
        return response.badRequest(res, msg, data, statusCode)
      }
      return response.success(res, msg, data, statusCode)
    } catch (err) {
      console.error(err);
      return response.serverError(res, MESSAGES.SOMETHING_WENT_WRONG, err.message);
    }
  }

  

}
