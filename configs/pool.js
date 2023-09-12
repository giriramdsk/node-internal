const { Pool } = require('pg');

const pool = new Pool({
  host: '172.20.6.22', // Replace with your PostgreSQL host
  user: 'postgres', // Replace with your PostgreSQL username
  password: 'Kggroup@123', // Replace with your PostgreSQL password
  database: 'node_internal', // Replace with your PostgreSQL database name
  max: 5, // Adjust the pool size as needed
});

pool.on('error', (err, client) => {
  console.error('Error:', err);
  process.exit(-1);
});

module.exports = pool;
 