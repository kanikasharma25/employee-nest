import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Res
  } from '@nestjs/common';
  import { Response } from 'express';
  import { EmployeesService } from './employees.service';
  import { CreateEmployeeDto } from './dto/create-employee.dto';
  import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {response} from 'src/utils/response';
  
  @Controller('employees')
  export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}
  
    @Post()
    async create(@Body() createEmployeeDto: CreateEmployeeDto, @Res() res: Response) {
        try {
            const {success,data,statusCode,msg} = await this.employeesService.create(createEmployeeDto);
            if(!success){
                return response.badRequest(res, msg, data,statusCode)
            }
            return response.success(res, msg, data,statusCode)
          } catch (err) {
            console.error(err);
            return response.serverError(res, 'Something went wrong');
          }
    }
  
    @Get()
    async findAll(@Res() res: Response) {
        try {
            const {msg,statusCode,success,data} = await this.employeesService.findAll();
            return response.success(res,msg,data)
          } catch (err) {
            console.error(err);
            return response.serverError(res, 'Something went wrong');
          }
      
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
      try {
        const data = await this.employeesService.findOne(id);
        return response.success(res, "Employee data loaded", data)
      } catch (err) {
        console.error(err);
        return response.serverError(res, 'Something went wrong');
      }
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateEmployeeDto: UpdateEmployeeDto,
      @Res() res: Response
    ) {
      try {
        const data = await this.employeesService.update(id, updateEmployeeDto);
        return response.success(res, "Employee data updated", data)
      } catch (err) {
        console.error(err);
        return response.serverError(res, 'Something went wrong');
      }
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
      try {
        const data = await this.employeesService.remove(id);
        return response.success(res, "Employee deleted successfully", {})
      } catch (err) {
        console.error(err);
        return response.serverError(res, 'Something went wrong');
      }
    }
  }
  
