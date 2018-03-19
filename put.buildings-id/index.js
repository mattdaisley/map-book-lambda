var mysql  = require("mysql")

var connection = mysql.createConnection({
	host     : "mapbookdbinstance.cdyn2egnt6h9.us-west-1.rds.amazonaws.com",
	port     : 3306,
	user     : "mapBookDBMaster",
	password : "QN9DH[GRa^4D=aUe",
	database : "mapBookDB"
})

// connection.connect()

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  const checkForBuilding = `
    SELECT id FROM \`buildings\`
    WHERE id = ${connection.escape(event.buildingId)}
  `
  connection.query(checkForBuilding, function (error, building, fields) {
    if (error) {
      connection.destroy();
      throw error;
    } else {
      if ( building.length === 0 ) {
        const insertBuilding = `
          INSERT INTO \`buildings\` 
            (
              \`addressId\`, 
              \`title\`, 
              \`latitude\`, 
              \`longitude\`
            )
          VALUES
            (
              ${connection.escape(event.addressId)}, 
              ${connection.escape(event.building.title)}, 
              ${connection.escape(event.building.latitude)},
              ${connection.escape(event.building.longitude)}
            );
        `
        console.log('insert building to address', insertBuilding)
        
        // callback(null, insertBuilding + insertPolygon + insertPolygonPoints)
        connection.query(insertBuilding, function (error, building, fields) {
          if (error) {
            connection.destroy();
            throw error;
          } else {
            const insertPolygon = `
              INSERT INTO \`polygons\`
                (\`objectId\`, \`objectType\`)
              VALUES
                (${building.insertId}, 'BUILDING');
            `
            console.log('insert polygon to building', building.insertId)
            connection.query(insertPolygon, function (error, polygon, fields) {
              if (error) {
                connection.destroy();
                throw error;
              } else {

                let insertPolygonPoints = `
                  INSERT INTO \`polygonPoints\`
                    (\`polygonId\`, \`latitude\`, \`longitude\`)
                  VALUES
                `
                console.log('insert polygon points to polygon', polygon.insertId)
                event.building.polygon.map( (point,i) => {
                  insertPolygonPoints += `(${polygon.insertId}, ${point.latitude}, ${point.longitude})${(i !== event.building.polygon.length - 1) ? ',' : ';'}\n`
                })

                connection.query(insertPolygonPoints, function (error, results, fields) {
                  if (error) {
                    connection.destroy();
                    throw error;
                  } else {
                    let finalResult = event.building
                    finalResult.id = building.insertId
                    callback(error, finalResult);
                  }
                });
              }
            });
          }
        });
      } else {
        const updateBuilding = `
          UPDATE \`buildings\` 
          SET 
            \`title\` = ${connection.escape(event.building.title)}, 
            \`latitude\` = ${connection.escape(event.building.latitude)},
            \`longitude\` = ${connection.escape(event.building.longitude)}
          WHERE id = ${connection.escape(event.buildingId)};
        `
        console.log('update building', updateBuilding)
        
        // callback(null, insertBuilding + insertPolygon + insertPolygonPoints)
        connection.query(updateBuilding, function (error, building, fields) {
          if (error) {
            connection.destroy();
            throw error;
          } else {
            const checkForPolygon = `
              SELECT id FROM \`polygons\`
              WHERE \`objectType\` = 'BUILDING'
              AND \`objectId\` = ${event.buildingId};
            `
            console.log('check for polygon', checkForPolygon)

            connection.query(checkForPolygon, function (error, polygon, fields) {
              if (error) {
                connection.destroy();
                throw error;
              } else {

                let deletePolygonPoints = `
                  DELETE FROM \`polygonPoints\`
                  WHERE \`polygonId\` = ${polygon[0].id};
                `
                console.log('delete points to polygon', deletePolygonPoints)

                connection.query(deletePolygonPoints, function (error, results, fields) {
                  if (error) {
                    connection.destroy();
                    throw error;
                  } else {
                    let insertPolygonPoints = `
                      INSERT INTO \`polygonPoints\`
                        (\`polygonId\`, \`latitude\`, \`longitude\`)
                      VALUES
                    `
                    event.building.polygon.map( (point,i) => {
                      insertPolygonPoints += `(${polygon[0].id}, ${point.latitude}, ${point.longitude})${(i !== event.building.polygon.length - 1) ? ',' : ';'}\n`
                    })
                    console.log('insert polygon points to polygon', insertPolygonPoints)

                    connection.query(insertPolygonPoints, function (error, results, fields) {
                      if (error) {
                        connection.destroy();
                        throw error;
                      } else {
                        let finalResult = event.building
                        finalResult.id = event.buildingId
                        callback(error, finalResult);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
    

  })
        
};