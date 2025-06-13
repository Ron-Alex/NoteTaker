import { error } from "console";

const express = require('express');
const {readFile} = require('fs').promises;
const path = require('path');
const db = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '12345',
        database: 'scribbler'
    },
    ssl: {
        rejectUnauthorized: false
    }
});

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
const port = 4000;
const mainFilePath = path.resolve(__dirname, "..", "client");
app.use(express.static(mainFilePath));
app.use(express.json());

// db.select('*')  
// .from('notestorage')
// .then((data: any) => {
//     console.log(data);
// })
// .catch((err: unknown) => {
//     if(err instanceof Error) console.warn(err);
// });

app.get('/', async (req: any, res: any) => {
    res.status(200).sendFile(path.resolve(mainFilePath, "index.html"));
})

app.get('/notes', async (req: any, res: any) => {
    try{
        const notes = await db.select('*').from('notestorage');
        res.status(200).send(notes);
    }
    catch{
        res.status(500).send({ error: "FAILED TO FETCH NOTES"});
    }   
})

app.post('/notes', async (req: any, res: any) => {
    const {storedID, content, created, edited} = req.body;
    try{
        await db('notestorage').insert({
            storedid: storedID,
            content: JSON.stringify(content),
            createddate: created,
            editeddate: edited
        });
        res.status("201").send({message: "NOTE HAS BEEN CREATED!"});
    }
    catch(err){
        res.status(500).send(err);
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`));
