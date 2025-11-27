import { Module } from '@nestjs/common';
import { UserService } from './application/services/user.service';
import { UserRepository } from './infrastructure/repositories/user.repository';

@Module({
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
