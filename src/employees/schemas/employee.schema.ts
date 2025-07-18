import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EmployeeRole } from 'src/constants/enum';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: EmployeeRole })
  role: EmployeeRole;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  salary: number;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
