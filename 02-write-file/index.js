const fs = require("fs");
const path = require('path');
const readline = require('node:readline/promises');
const {
    stdin: input,
    stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });
let writeableStream = fs.createWriteStream(path.join(__dirname,'text.txt'));

rl.setPrompt("Hello! Please enter a message(to exit write 'exit' or press Ctrl+C):\n");
rl.prompt();
rl.on('line', (msg) => {
    if (msg.toString().match(/^exit?$/i)) { 
        rl.pause(); 
        writeableStream.end();
        console.log('\nThanks for entering! Bay!');
    } else {
        writeableStream.write(msg+'\n');
    }
});
rl.on('SIGINT', () => {
    rl.pause(); 
    writeableStream.end();
    console.log('\nThanks for entering! Bay!');
});
 