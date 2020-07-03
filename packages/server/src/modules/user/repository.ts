import { MyContext } from 'src/types/Context';
import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../../entity/User';

// create custom Repository class
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async getUser(userId?: string | null): Promise<User> {
    if (!userId) {
      throw new Error('User not found');
    }
    return this.findOneOrFail({
      where: { id: userId },
      relations: ['bookedLessons', 'bookedLessons.teacher'],
    });
  }
}
