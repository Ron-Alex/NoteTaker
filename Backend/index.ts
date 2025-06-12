const express = require('express');
const {readFile} = require('fs').promises;
const path = require('path');

const app = express();
const port = 4000;

const mainFilePath = path.resolve(__dirname, "..", "client");

app.use(express.static(mainFilePath));

app.get('/', async (req: any, res: any) => {
        res.status(200).sendFile(path.resolve(mainFilePath, "index.html"));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
