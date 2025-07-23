
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({timestamps: true})
export class Post{

 @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Auth',default: null})
 userId: mongoose.Schema.Types.ObjectId;  

 @Prop({default: ''})
 title: string;

 @Prop({default: ''})
 description: string;

@Prop({
    type: [
      {
        url: { type: String, required: true },
        isDeleted: {type: Boolean,default: false }
      },
    ],
    default: [],
  })
  images: { url: string, isDeleted: Boolean }[];

}

export type PostDocument = Post & Document

export const PostSchema = SchemaFactory.createForClass(Post)
