import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostDocument } from "./schemas/post.schema";
import { Model } from "mongoose";
import { CreatePostDto } from "./dto/create-post.dto";
import { STATUS_CODES } from "http";
import { MESSAGES } from "src/constants/const";

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
    ) { }

    async createPost(createPostDto: CreatePostDto, userId: string, imagePaths: string[]): Promise<any> {
        
        const newPost = new this.postModel({
          userId: userId,
          title: createPostDto.title,
          description: createPostDto.description,
          images: imagePaths,
        });
        await newPost.save()

            return {
          success: true,
          statusCode: STATUS_CODES.CREATED,
          msg: MESSAGES.POST_CREATED,
          data: newPost
        }
      }
}


