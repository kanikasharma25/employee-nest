import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesModule } from './employees/employees.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // enables use of .env
    MongooseModule.forRoot(process.env.MONGODB_URI as string), // use your env variable here
    EmployeesModule,
  ],
})
export class AppModule {}
