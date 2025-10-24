exports.up = function(knex) {
  return knex.schema.createTable('vpn_keys', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('key').unique().notNullable();
    table.string('server_location').notNullable();
    table.enum('plan', ['basic', 'premium', 'pro']).defaultTo('premium');
    table.boolean('active').defaultTo(true);
    table.timestamp('expires_at');
    table.timestamp('last_used');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['user_id']);
    table.index(['key']);
    table.index(['active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('vpn_keys');
};
