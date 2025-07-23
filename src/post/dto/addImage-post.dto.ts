
import {
    IsArray,
    IsNotEmpty,
    IsString,
    ArrayNotEmpty,
    IsOptional,
  } from 'class-validator';
  
  export class PostImageAddDto {

    @IsNotEmpty({ message: 'postId is required' })
    @IsString({ message: 'postId must be a string' })
    postId: string;

  }
  