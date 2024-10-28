var mysql = require("mysql");
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database: 'webdb2024'
});

connection.connect();

connection.query("select * from topic", (error, results, fields)=>{
    if(error){
        console.log(error);
    }
    console.log(results[0]);
})

connection.end();