import { Body, Controller, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { response } from 'src/utils/response';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FilesInterceptor('images',5, {
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
    async create(@UploadedFiles() files: Express.Multer.File[],@Body() createPostDto: CreatePostDto, @Res() res: Response, @Req() req: any) {
        try {
            let userId = req.user.userId
            const imagePaths = files.map(file => file.path);

            let { data, msg, success, statusCode } = await this.postService.createPost(createPostDto, userId, imagePaths)
            return response.success(res, msg, data, statusCode)
        } catch (error) {
            return response.serverError(res,error.message)
        }
    }


}
