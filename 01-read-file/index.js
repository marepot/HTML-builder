const fs = require('fs');  
function read() {
    const readableStream = fs.createReadStream('text.txt');

    readableStream.on('error', function (error) {
        console.log(`error: ${error.message}`);
    })

    readableStream.on('data', (chunk) => {
        console.log(chunk);
    })
}
read();
