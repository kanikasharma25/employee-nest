
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({timestamps: true})
export class Post{

 @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Auth',defaulr: null})
 userId: mongoose.Schema.Types.ObjectId;  

 @Prop({default: ''})
 title: string;

 @Prop({default: ''})
 description: string;

 @Prop({type: [String], default: ''})
 images: string[];

}

export type PostDocument = Post & Document

export const PostSchema = SchemaFactory.createForClass(Post)
