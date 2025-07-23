import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostDocument } from "./schemas/post.schema";
import mongoose, { Model } from "mongoose";
import { CreatePostDto } from "./dto/create-post.dto";
import { MESSAGES, STATUS_CODES } from "src/constants/const";
import { PostImageAddDto } from "./dto/addImage-post.dto";

@Injectable()
export class PostService {

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) { }

  async postImgAdd(postImageAddDto: PostImageAddDto, imageObjects: { url: string }[]): Promise<any> {

    const { postId } = postImageAddDto;

    const existsPost = await this.postModel.findById(postId);
    if (!existsPost) {
      return {
        success: false,
        statusCode: STATUS_CODES.NOT_FOUND,
        data: {},
        msg: MESSAGES.POST_NOT_FOUND,
      };
    }

    await this.postModel.updateOne(
      { _id: postId },
      {
        $push: {
          images: {
            $each: imageObjects,
          },
        },
      },
    );

    const updatedPost = await this.postModel.findById(postId);

    return {
      success: true,
      statusCode: STATUS_CODES.OK,
      data: updatedPost,
      msg: MESSAGES.POST_NEW_IMAGE_ADD,
    };
    
  }

  async postImgDelete(postId: string, imgId: string): Promise<any> {
     let existsPost = await this.postModel.findOne({_id: postId})
     if(!existsPost){
      return{
        success: false,
        statusCode: STATUS_CODES.NOT_FOUND,
        data: {},
        msg: MESSAGES.POST_NOT_FOUND
      }
     }

     const result = await this.postModel.updateOne(
      { _id: postId, "images._id": imgId },
      { $set: { "images.$.isDeleted": true } }
    );
  
    if (result.modifiedCount === 0) {
      return {
        success: false,
        statusCode: STATUS_CODES.NOT_FOUND,
        data: {},
        msg: MESSAGES.POST_IMG_DELETE_ERR,
      };
    }
  
    return {
      success: true,
      statusCode: STATUS_CODES.OK,
      msg: MESSAGES.POST_IMG_MARKED_DELETED,
      data: {},
    };
     
  }

  async createPost(createPostDto: CreatePostDto, userId: string, imageObjects: { url: string }[]): Promise<any> {

    const newPost = new this.postModel({
      userId: userId,
      title: createPostDto.title,
      description: createPostDto.description,
      images: imageObjects,
    });
    await newPost.save()

    return {
      success: true,
      statusCode: STATUS_CODES.CREATED,
      msg: MESSAGES.POST_CREATED,
      data: newPost
    }
  }

  async userAllPost(userId: string): Promise<any> {
    // let posts = await this.postModel.find({ userId }).sort({ createdAt: -1 })

    let posts = await this.postModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'auths',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetail'
        }
      },
      {
        $unwind: '$userDetail'
      },
      {
        $project: {
          "_id": 1,
          "title": 1,
          "description": 1,
          "createdAt": "2025-07-23T04:23:02.131Z",
          "userDetail": 1,
          images: {
            $filter: {
              input: "$images",
              as: "image",
              cond: { $eq: ["$$image.isDeleted",false] }
            }
          }
        }
      }
    ])
    return {
      success: true,
      msg: MESSAGES.USER_POST_LOADED,
      statusCode: STATUS_CODES.OK,
      data: posts
    }
  }

}


