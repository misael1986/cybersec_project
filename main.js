const SHA256 = require('crypto-js/sha256')
const mysql = require('mysql');

//------------------------------------------------------------------------------------

class MySQL {

    constructor() {

    }

    conexion() {
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'rootnode',
            password: 'root',
            database: 'node_mysql',
            port: 3306
        });
        connection.connect(function(error) {
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
            user: 'rootnode',
            password: 'root',
            database: 'node_mysql',
            port: 3306
        });
        var query = connection.query('INSERT INTO bloques_notas(blockId, fecha, datos, previosHash, thishash)' +
            ' VALUES(?, ?, ?, ?, ?)', [dato1, dato2, JSON.stringify(dato3), dato4, dato5],
            function(error, result) {
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
            user: 'rootnode',
            password: 'root',
            database: 'node_mysql',
            port: 3306
        });
        var query = connection.query('SELECT blockId, fecha, datos, previosHash, thishash FROM bloques_notas WHERE id = ?', [valor], function(error, result) {
            if (error) {
                console.log('error', error.message, error.stack);
            } else {
                var resultado = result;
                if (resultado.length > 0) {
                    console.log(resultado[0].blockId + ' ' + resultado[0].fecha + '  ' + resultado[0].previosHash + '  ' + resultado[0].thishash + '   ' + resultado[0].datos);
                } else {
                    console.log('Registro no encontrado');
                }
            }
        });
        connection.end();
        module.exports = {
            "load_data": this.load_data
        }
    }
}


//------------------------------------------------------------------------------------

class Block {
    constructor(index, idAlum, IdAsig, PA, NF, NMA, previousHash = '') {
        this.index = index; //indice del bloque
        this.date = new Date(); //fecha actual de creación del bloque
        this.data = new Array(idAlum, IdAsig, PA, NF, NMA); //ID del Alumno, ID de la Asignatura, Periodo Academico, Nota Final, Nota mínima aprobatoria
        this.previousHash = previousHash;
        this.hash = this.createHash();
        this.nonce = 0;
    }

    createHash() {
        return SHA256(this.index + this.date + this.data + this.nonce).toString();
    }

    miner(difficulty) {
        while (!this.hash.startsWith(difficulty)) {
            this.nonce++;
            this.hash = this.createHash();
        }
    }
}

//--------------------------------------------------------------------------------

class BlockChain {
    constructor(genesis, difficulty = '0000') {
        this.chain = [this.createFirstBlock(genesis)];
        this.difficulty = difficulty;
    }
    createFirstBlock(genesis) {
        return new Block(0, genesis);
    }
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(idAlum, IdAsig, PA, NF, NMA) {
        let prevBlock = this.getLastBlock();
        let newblock = new Block(prevBlock.index + 1, idAlum, IdAsig, PA, NF, NMA, prevBlock.hash);
        newblock.miner(this.difficulty);
        console.log('Minado! ' + newblock.hash + ' con nonce ' + newblock.nonce);
        this.chain.push(newblock);
        let guarda = new MySQL();
        guarda.insert_data(newblock.index, newblock.date, newblock.data, newblock.previousHash, newblock.hash);
    }

    showData(data) {
        let carga = new MySQL();
        carga.load_data(data);

    }

    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            let prevBlock = this.chain[i - 1];
            let actualBlock = this.chain[i];
            if (actualBlock.previousHash != prevBlock.hash) {
                return false;
            }
            if (actualBlock.createHash() == actualBlock.hash) {
                return false;
            }
            return true;
        }

    }

}



module.exports = {
    registro: function(cStudent, period, cSubject, nMin, nMax, observation) {
        //block = new Block (0, 'prueba');
        //console.log(JSON.stringify(block,null,2));

        let naniCoin = new BlockChain('informacion inicial genesis');
        //console.log(JSON.stringify(naniCoin,null,2));
        naniCoin.addBlock(cSubject, cSubject, period, nMax, nMin, observation);
        //ID del Alumno, ID de la Asignatura, Periodo Academico, Nota Final, Nota mínima aprobatoria
        console.log(JSON.stringify(naniCoin, null, 2));
        //naniCoin.showData(2);
        //console.log(naniCoin.isValid());clear
        return "ok";
    }
};