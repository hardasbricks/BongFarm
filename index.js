const fs = require('fs');
const http = require('http');
const url = require('url');
///////////////// FILE SYSTEMS /////////////////////////

//blocking 
// const txt = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(txt); 

// const txtOut = `This is what we know about the avocado: ${txt} \nCreated on ${Date.now()}`;
//  fs.writeFileSync('./txt/output.txt', txtOut);
//  console.log("File written..");

 //non blocking
//  fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     if(err){
//         return console.error("ERROR:... 🌫");
//     }

//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}` ,'utf-8', (err => {
//                 console.log("Files have been written 🤨🤨🤨🤨"); 
//             }))
//          }); 
//      }); 
//  }); 
//  console.log("will read file..");



//////////////////// SERVERS ///////////////////

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if(!product.organic) { output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');}

    return output;
}


//html teplates
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

//json data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); 
const productJson = JSON.parse(data);

 const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true); 

    //Overview Page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type': 'text/html'});

        //replace the placeholders for the cards
        const cardsHtml = productJson.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace(/%PRODUCT_CARDS%/g, cardsHtml);

        res.end(output);
    }

    //Product Page
    else if(pathname === '/product'){
        res.writeHead(200,{'Content-type': 'text/html'});
        const product = productJson[query.id];
        const output = replaceTemplate(tempProduct, product);
        
        res.end(output);
    }

    //api
    else if(pathname === '/api'){
        res.writeHead(200,{'Content-type': 'application/json'});
        res.end(data);
    }

    //Not Found
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-header': 'fuck-you'
        });
        res.end('<h1>Page NOT FOUND!</h1>');
    }
 });

 server.listen(8000, '127.0.0.1', () =>{
    console.log("Listening to localhost:8000");
 });

