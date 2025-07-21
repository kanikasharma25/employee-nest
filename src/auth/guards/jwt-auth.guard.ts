
import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MESSAGES } from 'src/constants/const';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        if (err) {
            throw err;
        }

        if (!user) {

            throw new UnauthorizedException({
                success: false,
                statusCode: 401,
                msg: MESSAGES.TOKEN_ERROR,
            });
        }

        return user;
    }
}
