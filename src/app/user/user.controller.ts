import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { RpcBody, RpcParam, RpcQuery, RpcUserId } from 'src/common/decorators';
import { UserQueryBuilderDirector, UserQueryPayload } from './query/user-query';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.get-by-id')
  getUserById(@RpcParam('id') id: string) {
    return this.userService.getUserById(id);
  }

  @MessagePattern('user.get-all')
  getUsers(@RpcQuery() payload: UserQueryPayload) {
    const query = new UserQueryBuilderDirector(payload).build();
    return this.userService.getUsers(query);
  }

  @MessagePattern('user.ban')
  ban(@RpcParam('id') id, @RpcBody() data: { banUntil: Date; reason: string }) {
    return this.userService.ban(id, data.banUntil, data.reason);
  }

  @MessagePattern('user.unban')
  unban(@RpcParam('id') id) {
    return this.userService.unban(id);
  }

  @MessagePattern('user.update')
  update(@RpcUserId() id, @RpcBody() data: UpdateUserDto) {
    return this.userService.updateUser(id, data);
  }

  @MessagePattern('user.me')
  me(@RpcUserId() id) {
    return this.userService.getUserById(id);
  }

  @MessagePattern('user.verify')
  verify(@Payload() payload: { userId: string }) {
    return this.userService.markUserAsVerified(payload.userId);
  }
}
