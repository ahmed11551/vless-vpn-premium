const { db } = require('../config/database');

class User {
  static async create(userData) {
    const [user] = await db('users').insert(userData).returning('*');
    return user;
  }

  static async findByEmail(email) {
    const user = await db('users').where({ email }).first();
    return user;
  }

  static async findByTelegramId(telegramId) {
    const user = await db('users').where({ telegram_id: telegramId }).first();
    return user;
  }

  static async findById(id) {
    const user = await db('users').where({ id }).first();
    return user;
  }

  static async update(id, updateData) {
    const [user] = await db('users').where({ id }).update(updateData).returning('*');
    return user;
  }

  static async delete(id) {
    return await db('users').where({ id }).del();
  }

  static async getAll(limit = 50, offset = 0) {
    const users = await db('users')
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');
    
    const total = await db('users').count('* as count').first();
    
    return { users, total: parseInt(total.count) };
  }

  static async getStats() {
    const stats = await db('users')
      .select(
        db.raw('COUNT(*) as total_users'),
        db.raw('COUNT(CASE WHEN subscription_active = true THEN 1 END) as active_subscriptions'),
        db.raw('COUNT(CASE WHEN created_at >= NOW() - INTERVAL \'30 days\' THEN 1 END) as new_users_30d')
      )
      .first();
    
    return stats;
  }
}

module.exports = User;
