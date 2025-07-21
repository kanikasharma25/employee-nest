import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'; import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(
        err: any,
        user: any,
        info: Error | undefined,
    ): any {
        if (err || !user) {
            throw new UnauthorizedException({
                success: false,
                statusCode: 401,
                msg: 'Token missing or invalid',
            });
        }
        return user;
    }
}


