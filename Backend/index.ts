import { readFileSync } from "fs";

const express = require('express');
const {readFile} = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

const mainFilePath = path.resolve(__dirname, "..", "client", "index.html");
console.log(mainFilePath);

// app.use(express.static(path.resolve(mainFilePath, "..", "services")));

// app.get('/', async (req: any, res: any) => {
//     try{
//         const mainFile = await readFile(mainFilePath, 'utf8');
//         res.setHeader("Content-Type", "text/html");
//         res.status(200).send(mainFile);
//     }
//     catch{
//         console.warn("NAHH");
//         res.status(500).send("ERROR");
//     }
// })

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
