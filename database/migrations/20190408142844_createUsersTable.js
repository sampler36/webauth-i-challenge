
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(tbl){
      tbl.increments('id');
      tbl
        .string('username', 128)
        .notNullable()
        .unique();
        tbl
        .string('password', 128)
        .notNullable()
        
      tbl.timestamps(true,true)
  
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
  };