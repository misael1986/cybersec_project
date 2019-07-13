const SHA256 = require('crypto-js/sha256')
const GUARDAR = require("mysql")

class Block {
    constructor(index, idAlum, IdAsig, PA, NF, NMA, previousHash = '') {
        this.index = index;//indice del bloque
        this.date = new Date();//fecha actual de creación del bloque
        this.data = new Array(idAlum, IdAsig, PA, NF, NMA);//ID del Alumno, ID de la Asignatura, Periodo Academico, Nota Final, Nota mínima aprobatoria
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
        GUARDAR.insert_data(newblock.index,newblock.date,newblock.data,newblock.previousHash,newblock.hash);
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

//block = new Block (0, 'prueba');
//console.log(JSON.stringify(block,null,2));

let naniCoin = new BlockChain('informacion inicial genesis');
//console.log(JSON.stringify(naniCoin,null,2));
naniCoin.addBlock('561203212', '2028141', '2006', '4.2', '3.0');//ID del Alumno, ID de la Asignatura, Periodo Academico, Nota Final, Nota mínima aprobatoria
naniCoin.addBlock('561203212', '2026001', '2006', '3.9', '3.5');//ID del Alumno, ID de la Asignatura, Periodo Academico, Nota Final, Nota mínima aprobatoria (Ingles 3.5)
console.log(JSON.stringify(naniCoin,null,2));
console.log(naniCoin.isValid());