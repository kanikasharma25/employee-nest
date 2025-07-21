
import { Body, Controller, Post, Res, UseGuards, Get, Req, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { response } from 'src/utils/response';
import { Request, Response } from 'express';
import { MESSAGES } from 'src/constants/const';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/constants/interface';
import { LoginDto } from './dto/login.dto';
import { updateDto } from './dto/update.dto';

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

  @Post('Login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { success, data, msg, statusCode } = await this.authService.login(loginDto)
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
      const { success, data, msg, statusCode } = await this.authService.getProfile(u.userId)
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
  @Patch('updateProfile')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profileImages',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDto: updateDto,
    @Req() req: any,
    @Res() res: Response
  ) {
    try {
      const userId = req.user.userId;

    if (file) {
      updateDto.profileImage = file.filename;
    }

    const {data, msg,statusCode,success} = await this.authService.updateProfile(userId, updateDto);
    if(!success) {
      return response.badRequest(res,msg,data,statusCode)
    }
    return response.success(res,msg,data,statusCode)
    } catch (error) {
      return  response.serverError(res,error.message)
    }
  }


}
