import { Repository } from "typeorm";

export class BaseRepository<T> {
  constructor(private readonly entityRepo: Repository<T>) {
  }

  getRepo(): Repository<T> { return this.entityRepo; }

  // save(entity: T): Promise<T> { return this.entityRepo.save(entity); }
}