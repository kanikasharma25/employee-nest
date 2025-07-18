

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { MESSAGES, STATUS_CODES } from 'src/constants/const';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<any> {
    // let emailExists = await this.employeeModel
    const newEmployee = new this.employeeModel(createEmployeeDto);
    let newEmp = await newEmployee.save()
    return {
        success: true,
        statusCode: STATUS_CODES.CREATED,
        msg: MESSAGES.EMPLOYEE_CREATED,
        data: newEmp
    }
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }

  async findOne(id: string): Promise<Employee | null> {
    return this.employeeModel.findById(id).exec();
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee | null> {
    return this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Employee | null> {
    return this.employeeModel.findByIdAndDelete(id).exec();
  }
}

