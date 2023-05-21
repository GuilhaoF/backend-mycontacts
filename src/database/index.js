/* eslint-disable import/no-extraneous-dependencies */
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'mycontacts',
});

exports.query = async (query, values) => {
  const { rows } = await client.query(query, values);
  return rows;
};

client.connect();
