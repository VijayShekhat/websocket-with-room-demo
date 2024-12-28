import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/repo/entity.repository";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

export class UserRepository extends BaseRepository<User> {

  constructor(
    @InjectRepository(User) private readonly entity: Repository<User>,
  ) { super(entity); }

  async findById(id: number) {
    return await this.entity.findOne({ where: { id: id } });
  }

  async findByUserName(username: string) {
    return await this.entity.findOne({ where: { username: username } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;

    // Create the new user instance
    const user = this.entity.create({
      username,
      password,
      role,
    });

    // Save the user to the database
    return await this.entity.save(user);
  }
}