const mysql = require('mysql');

class MySQL {

    conexion() {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'node_mysql',
            port: 3306
        });
        connection.connect(function (error) {
            if (error) {
                throw error;
            } else {
                console.log('Conexion correcta.');
            }
        });
        connection.end();
        module.exports = {
            "conexion": conexion
        }
    }

//https://fernando-gaitan.com.ar/introduccion-a-node-js-parte-14-conectar-node-js-con-mysql/
    insert_data(dato1, dato2, dato3, dato4, dato5) {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'node_mysql',
            port: 3306
        });
        var query = connection.query('INSERT INTO bloque_notas(blockId, fecha, datos, previousHash, thishash)'
            + ' VALUES(?, ?, ?, ?, ?)',
            [dato1, dato2, dato3, dato4, dato5], function (error, result) {
                if (error) {
                    console.log('error', error.message, error.stack);
                } else {
                    console.log(result);
                }
            }
        );
        connection.end();
        module.exports = {
            "insert_data": this.insert_data
        }

    }

    load_data(valor) {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'node_mysql',
            port: 3306
        });
        var query = connection.query('SELECT nombre, apellido, biografia FROM personaje WHERE personaje_id = ?', [valor], function (error, result) {
            if (error) {
                console.log('error', error.message, error.stack);
            } else {
                var resultado = result;
                if (resultado.length > 0) {
                    console.log(resultado[0].nombre + ' ' + resultado[0].apellido + ' / ' + resultado[0].biografia);
                } else {
                    console.log('Registro no encontrado');
                }
            }
        }
        );
        connection.end();
        module.exports = {
            "load_data": this.load_data
        }
    }


}

