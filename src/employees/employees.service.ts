
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { MESSAGES, STATUS_CODES } from 'src/constants/const';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<any> {
    let emailExists = await this.employeeModel.findOne({ email: createEmployeeDto.email })
    if (emailExists) {
      return {
        success: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        msg: MESSAGES.EMAIL_EXISTS,
        data: {}
      }
    }
    const { password, ...rest } = createEmployeeDto;

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const newEmployee = new this.employeeModel({
      ...rest,
      password: hashedPassword,
    });
    let newEmp = await newEmployee.save()
    return {
      success: true,
      statusCode: STATUS_CODES.CREATED,
      msg: MESSAGES.EMPLOYEE_CREATED,
      data: newEmp
    }
  }

  async findAll(): Promise<any> {
    let data = await this.employeeModel.find().exec();
    return {
      success: true,
      statusCode: STATUS_CODES.OK,
      msg: MESSAGES.EMPLOYEE_FETCHED_ALL,
      data: data
    }
    
  }

  async findOne(id: string): Promise<any> {
    let data = await this.employeeModel.findById(id).exec();
    if(!data){
      return {
        success: false,
        statusCode: STATUS_CODES.NOT_FOUND,
        msg: MESSAGES.NOT_FOUND,
        data: {}
      }
    }
    return {
      success: true,
      statusCode: STATUS_CODES.OK,
      msg: MESSAGES.EMPLOYEE_FETCHED_ONE,
      data: data
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<any> {
    const { email, password, ...safeUpdates } = updateEmployeeDto;
    let data = await this.employeeModel.findByIdAndUpdate(id, safeUpdates, { new: true }).exec();
    if(!data){
       return {
        success: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        data: {},
        msg: MESSAGES.EMPLOYEE_UPDATE_FAILED
      }
    }
    return {
      success: true,
      statusCode: STATUS_CODES.OK,
      data: data,
      msg: MESSAGES.EMPLOYEE_UPDATE_PASSED
    }
  }

  async remove(id: string): Promise<any> {
    let data= await this.employeeModel.findByIdAndDelete(id).exec();
    if(!data){
      return {
        success: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        data: {},
        msg: MESSAGES.EMPLOYEE_DELETE_FAILED
      }
    }
    return {
      success: true,
      statusCode: STATUS_CODES.OK,
      data: data,
      msg: MESSAGES.EMPLOYEE_DELETE_PASSED
    }
  }
}

