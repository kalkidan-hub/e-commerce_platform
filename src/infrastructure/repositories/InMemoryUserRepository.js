const UserRepository = require('../../domain/repositories/UserRepository');

class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.users = new Map();
  }

  async create(user) {
    this.users.set(user.id, user);
    return user;
  }

  async findById(id) {
    return this.users.get(id) || null;
  }

  async findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }
}

module.exports = InMemoryUserRepository;

