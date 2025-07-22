
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Post{

 @Prop({default: ''})
 title: string;

 @Prop({default: ''})
 description: string;

 @Prop({type: [String], default: ''})
 images: string[];

}

export type PostDocument = Post & Document

export const EmployeeSchema = SchemaFactory.createForClass(Post)
