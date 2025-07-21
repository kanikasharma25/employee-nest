import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from '../schemas/auth.schema';
import { MESSAGES } from 'src/constants/const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,

    @InjectModel(Auth.name)
    private readonly authModel: Model<AuthDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    const user = await this.authModel.findById(payload.sub);
    if (!user) {
      
      throw new UnauthorizedException({
        success: false,
        statusCode: 401,
        msg: MESSAGES.NOT_FOUND,
      });
    }

    if (user.tokenTracker !== payload.tokenTracker) {
      
      throw new UnauthorizedException({
        success: false,
        statusCode: 401,
        msg: MESSAGES.TOKEN_EXPIRED,
      });
    }

    return {
      userId: user._id,
      email: user.email,
      tokenTracker: payload.tokenTracker,
      dbTokenTracker: user.tokenTracker,
    };

  }
}
