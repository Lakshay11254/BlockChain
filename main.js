//including library sso we can use SHA256

const SHA256 = require("crypto-js/sha256");

//global variable to hold block index
var counter = 0;

//define the shape of block
//when used in an object method, 'this' refers to the object.
class Block {
  constructor(data, previousHash, timestamp, index, currentHash, nonce) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = new Date().getTime();
    this.data = data;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  //use the SHA256 algo to generate a hash of the information contained in the block, concatenated together

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
    //generate the blcok hash based on the difficulty / calculate the nonce
  }
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Mined Block" + this.index + "---> Hash Value: ", this.hash);
    return this.hash;
  }
}

class Blockchain {
  //construct the blockchain
  //first, crette thhe gesis block and set the mining difficulty, which
  //refers to the difficulty of finding a nonce that has a particular number
  //of zeroes at the beggining of hash.
  //difficulty =  3 , example , means that the hash must start with 3 zeroes
  // The greater the difficulty, the more time it generally takes to mine the block.

  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 4;
  }
  createGenesis() {
    return new Block("Genesis Block", 0, "01/01/2024", 0, 0);
  }
  //Calculate the index of the latest block
  latestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // add a block to the chain
  addBlock(newBlock) {
    //increment the block index
    newBlock.index = Number(this.latestBlock().index) + 1;
    //create the link between the blocks by setting the new block's previousHash
    //to the preceeding block's hash value.
    newBlock.previousHash = this.latestBlock().hash;
    //set the new block's hash value in calculateHash fn
    newBlock.hash = newBlock.mineBlock(this.difficulty);
    //pushing the newBlock to the end of an array
    this.chain.push(newBlock);
  }
  checkValid() {
    for (let i = 1; i < this.chain.length; i++) {
      //get the current block and the previous block and check that the hashess are valid
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.hash != currentBlock.calculateHash()) {
        console.log("Hash is invalid.");
        return false;
      }
      if (currentBlock.hash != previousBlock.hash) {
        console.log("Hash of previous block is invalid.");
        return false;
      }
      return true;
    }
  }
}
//Test our blockchain
let jsChain = new Blockchain();
jsChain.addBlock(new Block('tx data 1'));
jsChain.addBlock(new Block('tx data 2'));
jsChain.addBlock(new Block('tx data 3'));
jsChain.addBlock(new Block('tx data 4'));
jsChain.addBlock(new Block('tx data 5'));

console.log(JSON.stringify(jsChain, null, 4));
console.log('Is the blockchain still valid? ' + jsChain.checkValid());