const fs = require('fs');
const readline = require('readline');
    const writableStream = fs.createWriteStream(filePath);

    writableStream.on('error',  (error) => {
        console.log(`An error occured while writing to the file. Error: ${error.message}`);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Enter a sentence: '
    });

    rl.prompt();
      
    rl.on('line', (line) => {
        switch (line.trim()) {
            case 'exit':
                rl.close();
                break;
            default:
                sentence = line + '\n'
                writableStream.write(sentence);
                rl.prompt();
                break;
        }
    }).on('close', () => {
        writableStream.end();
        writableStream.on('finish', () => {
            console.log(`All your sentences have been written to ${filePath}`);
        })
        setTimeout(() => {
            process.exit(0);
        }, 100);
    });
