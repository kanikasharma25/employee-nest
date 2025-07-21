
import { IsOptional, IsString } from 'class-validator';

export class updateDto {

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

}
