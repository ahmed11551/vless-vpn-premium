exports.up = function(knex) {
  return knex.schema.createTable('payments', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('payment_intent_id').unique();
    table.string('stripe_payment_id');
    table.enum('status', ['pending', 'succeeded', 'failed', 'canceled']).defaultTo('pending');
    table.enum('plan', ['basic', 'premium', 'pro']);
    table.decimal('amount', 10, 2).notNullable();
    table.string('currency', 3).defaultTo('RUB');
    table.integer('duration_days').notNullable();
    table.json('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['user_id']);
    table.index(['payment_intent_id']);
    table.index(['status']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('payments');
};
