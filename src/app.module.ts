import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesModule } from './employees/employees.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // enables use of .env
    MongooseModule.forRoot(process.env.MONGODB_URI as string), // use your env variable here
    EmployeesModule, AuthModule,
  ],
})
export class AppModule {}
