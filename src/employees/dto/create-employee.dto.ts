import { IsNotEmpty, IsString, IsOptional, IsEmail, IsNumber, IsEnum } from 'class-validator';
import { EmployeeRole } from 'src/constants/enum';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EmployeeRole)
  role: string;

  //   @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  password?: string;

  //   @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  salary?: number;
}
