exports.up = function(knex) {
  return knex.schema.createTable('vpn_usage', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('key_id').references('id').inTable('vpn_keys').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.bigInteger('bytes_uploaded').defaultTo(0);
    table.bigInteger('bytes_downloaded').defaultTo(0);
    table.date('date').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['key_id']);
    table.index(['user_id']);
    table.index(['date']);
    table.unique(['key_id', 'date']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('vpn_usage');
};
