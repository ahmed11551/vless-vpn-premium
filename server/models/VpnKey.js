const { db } = require('../config/database');

class VpnKey {
  static async create(keyData) {
    const [key] = await db('vpn_keys').insert(keyData).returning('*');
    return key;
  }

  static async findByUserId(userId) {
    const keys = await db('vpn_keys')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
    return keys;
  }

  static async findByKey(key) {
    const vpnKey = await db('vpn_keys').where({ key }).first();
    return vpnKey;
  }

  static async findById(id) {
    const vpnKey = await db('vpn_keys').where({ id }).first();
    return vpnKey;
  }

  static async update(id, updateData) {
    const [vpnKey] = await db('vpn_keys').where({ id }).update(updateData).returning('*');
    return vpnKey;
  }

  static async delete(id) {
    return await db('vpn_keys').where({ id }).del();
  }

  static async getAll(limit = 50, offset = 0) {
    const keys = await db('vpn_keys')
      .select('vpn_keys.*', 'users.email', 'users.telegram_id')
      .leftJoin('users', 'vpn_keys.user_id', 'users.id')
      .limit(limit)
      .offset(offset)
      .orderBy('vpn_keys.created_at', 'desc');
    
    const total = await db('vpn_keys').count('* as count').first();
    
    return { keys, total: parseInt(total.count) };
  }

  static async getActiveKeys() {
    const keys = await db('vpn_keys')
      .where({ active: true })
      .select('*');
    return keys;
  }

  static async getStats() {
    const stats = await db('vpn_keys')
      .select(
        db.raw('COUNT(*) as total_keys'),
        db.raw('COUNT(CASE WHEN active = true THEN 1 END) as active_keys'),
        db.raw('COUNT(CASE WHEN created_at >= NOW() - INTERVAL \'30 days\' THEN 1 END) as new_keys_30d')
      )
      .first();
    
    return stats;
  }

  static async getUsageStats(keyId, startDate, endDate) {
    const stats = await db('vpn_usage')
      .where({ key_id: keyId })
      .whereBetween('date', [startDate, endDate])
      .select(
        'date',
        db.raw('SUM(bytes_uploaded) as upload'),
        db.raw('SUM(bytes_downloaded) as download'),
        db.raw('SUM(bytes_uploaded + bytes_downloaded) as total')
      )
      .groupBy('date')
      .orderBy('date');
    
    return stats;
  }
}

module.exports = VpnKey;
