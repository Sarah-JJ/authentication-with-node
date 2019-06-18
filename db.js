const mysql = require('mysql');

// http://172.17.0.2:3306/
let connection = mysql.createConnection({
  'host': process.env.DB_HOST,
  'user': process.env.DB_USER,
  'password': process.env.DB_PASSWORD,
  'database': process.env.DB_NAME
});

connection.connect((err) => {
  if (!err)
    console.log("connected");
  else
    console.log(err);

});

// connection.query('SELECT * FROM nodesql.t1', function(error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results);
// });

module.exports = connection;