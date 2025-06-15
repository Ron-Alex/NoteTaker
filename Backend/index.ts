const express = require('express');
const cors = require('cors')
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
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
const port = 4000;
const mainFilePath = path.resolve(__dirname, "..", "client");
app.use(express.static(mainFilePath));
app.use(express.json());

//GET REQUEST THAT PASSES THE HOMEPAGE
app.get('/', async (req: any, res: any) => {
    res.status(200).sendFile(path.resolve(mainFilePath, "index.html"));
})

//GET REQUEST TO PASS ALL NOTES
app.get('/notes', async (req: any, res: any) => {
    try{
        const notes = await db.select('*').from('notestorage');
        res.status(200).send(notes);
    }
    catch{
        res.status(500).send({ error: "FAILED TO FETCH NOTES"});
    }   
})

//GET REQUEST TO GET ONE INDIVIDUAL NOTE: pass in ID as parameter
app.get("/notes/:curID", async (req: any, res: any) => {
    const {curID} = req.params;
    try {   
        const note = await db('notestorage').where('storedid', curID);
        res.status(200).send(note);
    } catch (error) {
        res.status(500).send({error: "Could not find note"});
    }
})

//POST REQUEST TO ADD A NOTE: pass in ID, content, createdDate and editedDate
app.post('/notes', async (req: any, res: any) => {
    const {storedid, content, createddate, editeddate} = req.body;
    try{
        await db('notestorage').insert({
            storedid: storedid,
            content: JSON.stringify(content),
            createddate: createddate,  
            editeddate: editeddate
        });
        res.status(200).send({message: "NOTE HAS BEEN CREATED!"});
    } catch(err){
        res.status(500).send(err);
    }
})

//DELETE REQUEST TO DELETE A NOTE: pass in ID as parameter and it will be deleted
app.delete('/notes/:curID', async(req: any, res: any) => {
    const { curID } = req.params;
    try{
        await db('notestorage').where('storedid', curID).del();
        res.status(200).send({message: "Note has been deleted"});
    } catch(err){
        res.status(500).send(err);
    }
})


//PUT REQUEST TO EDIT NOTE: pass in ID as parameter, content and editeddate in body.
app.put('/notes/:curID', async(req: any, res: any) => {
    const { curID } = req.params;
    const {content, editeddate } = req.body;
    try {
        await db('notestorage').where('storedid', curID).update({
            content: content,
            editeddate: editeddate
        });
        res.status(200).send({message: "Note has been updated"});
    } catch (error) {
        res.status(500).send({error: "Could not edit note"});
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`));
