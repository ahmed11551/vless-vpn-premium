exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.bigInteger('telegram_id').unique();
    table.enum('role', ['user', 'admin']).defaultTo('user');
    table.boolean('subscription_active').defaultTo(false);
    table.timestamp('subscription_expires_at');
    table.string('referral_code', 8).unique();
    table.uuid('referred_by').references('id').inTable('users');
    table.decimal('referral_earnings', 10, 2).defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['email']);
    table.index(['telegram_id']);
    table.index(['referral_code']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
