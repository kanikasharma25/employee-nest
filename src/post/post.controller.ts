import { Body, Controller, Delete, Get, Param, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { response } from 'src/utils/response';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MESSAGES } from 'src/constants/const';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FilesInterceptor('images', 5, {
            storage: diskStorage({
                destination: './uploads/postImages',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    async create(@UploadedFiles() files: Express.Multer.File[], @Body() createPostDto: CreatePostDto, @Res() res: Response, @Req() req: any) {
        try {
            let userId = req.user.userId
            const imageObjects = files.map(file => ({
                url: file.path,
            }));

            let { data, msg, success, statusCode } = await this.postService.createPost(createPostDto, userId, imageObjects)
            return response.success(res, msg, data, statusCode)
        } catch (error) {
            return response.serverError(res, MESSAGES.SOMETHING_WENT_WRONG, error.message);
        }
    }

    @UseGuards()
    @Get('/:userId')
    async userPostsGet(@Param('userId') userId: string, @Res() res: Response) {
        try {
            const { msg, statusCode, data, success } = await this.postService.userAllPost(userId);
            if (!success) {
                return response.badRequest(res, msg, data, statusCode)
            }
            return response.success(res, msg, data, statusCode)
        } catch (error) {
            console.error(error);
            return response.serverError(res, MESSAGES.SOMETHING_WENT_WRONG, error.message);
        }
    }

    // @UseGuards()
    // @Delete('/:postId')
    // async postDelete(@Param('postId') postId: string, @Res() res: Response){
    //     try {
    //         const { msg, statusCode, data, success } = await this.postService.postDelete(postId);
    //         if (!success) {
    //             return response.badRequest(res, msg, data, statusCode)
    //         }
    //         return response.success(res, msg, data, statusCode)
    //     } catch (error) {
    //         console.error(error);
    //         return response.serverError(res, MESSAGES.SOMETHING_WENT_WRONG, error.message);
    //     }
    // }

    @UseGuards()
    @Delete('/imgDelete/:imgId/:postId')
    async postImageDelete(@Param('postId') postId: string,
    @Param('imgId') imgId: string,
    @Res() res: Response) {
        try {

            const { msg, statusCode, data, success } = await this.postService.postImgDelete(postId, imgId);
            if (!success) {
                return response.badRequest(res, msg, data, statusCode)
            }
            return response.success(res, msg, data, statusCode)
        } catch (error) {
            console.error(error);
            return response.serverError(res, MESSAGES.SOMETHING_WENT_WRONG, error.message);
        }
    }


}
