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
	
  const query = `
    select b.*, p.id as polygonId from buildings b 
    left join polygons p on p.objectId = b.id 
    where b.id = ${connection.escape(event.buildingId)} 
    limit 1
  `

  connection.query(query, function (error, buildings, fields) {
    if (error) {
      connection.destroy();
      throw error;
    } else {

      if ( !!buildings && buildings.length > 0 ) {
        const building = buildings[0]
      
        if ( !!building.polygonId ) {
          const query2 = `
            select pp.latitude, pp.longitude from polygonPoints pp 
            left join polygons p on p.id = pp.polygonId
            where p.objectId = ${connection.escape(building.polygonId)}
          `
    
          connection.query(query2, function (error, polygonPoints, fields) {
            if (error) {
              connection.destroy();
              throw error;
            } else {
              const buildingWithPolygon = Object.assign( {}, building, {
                polygon: polygonPoints
              } )
              callback(error, [ buildingWithPolygon ]);
            }
          });

        } else {
          callback(error, [ building ]);
        }
      } else {
        callback(error, buildings)
      }

    }
  });
        
};