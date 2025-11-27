import { Module } from '@nestjs/common';
import { UserSidRepository } from './infrastructure/repositories/user-sid.repository';
import { SidBinderService } from './application/services/sid-binder.service';
import { UserSidsController } from './presentation/controllers/user-sids.controller';

@Module({
  controllers: [UserSidsController],
  providers: [UserSidRepository, SidBinderService],
  exports: [UserSidRepository, SidBinderService],
})
export class UserSidsModule {}
