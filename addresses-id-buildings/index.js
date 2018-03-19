var mysql  = require("mysql")

var connection = mysql.createConnection({
	host     : "mapbookdbinstance.cdyn2egnt6h9.us-west-1.rds.amazonaws.com",
	port     : 3306,
	user     : "mapBookDBMaster",
	password : "QN9DH[GRa^4D=aUe",
	database : "mapBookDB"
})

connection.connect()

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
	
	const query = 'select * from buildings where addressId = ' + connection.escape(event.addressId)

  connection.query(query, function (error, results, fields) {
    if (error) {
      connection.destroy();
      throw error;
    } else {
      callback(error, results);
    }
  });
        
};