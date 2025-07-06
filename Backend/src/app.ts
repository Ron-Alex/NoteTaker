const express = require('express');
const cors = require('cors')
const {readFile} = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

import { NextFunction, Request, Response } from "express";

const notesContr = require('../Controllers/Notes');

dotenv.config();

// type UUID = string;

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
const mainFilePath = path.resolve(__dirname, "..", "..", "client");
// console.log(__dirname, "------", mainFilePath)
app.use(express.static(mainFilePath));
app.use(express.json());

interface reqWithUser extends Request{
    user: string
}

const makeJWT = (user_id: string) => {
    return jwt.sign({user_id}, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}

function verifyToken(req: reqWithUser, res: Response, next: NextFunction) {   
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).send("No Token");
    try{
        const decoded_id = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded_id;
        next();
    }
    catch{
        res.status(403).send("Invalid Token!");
    }
}

app.get("/money", (req: Request, res: Response) => {
    res.status(200).send("WE RICH");
})

//GET REQUEST THAT PASSES THE HOMEPAGE
app.get('/', async (req: Request, res: Response) => {
    res.status(200).sendFile(path.resolve(mainFilePath, "index.html"));
})

app.get('/verify', verifyToken, async (req: Request, res: Response) => {
    res.status(200).send("JWT verified");
})

//GET REQUEST TO PASS ALL NOTES OF ONE USER
app.get('/notes', verifyToken, async (req: Request, res: Response) => notesContr.get_all_notes(req, res, db));

//GET REQUEST TO GET ONE INDIVIDUAL NOTE: pass in ID as parameter
app.get("/notes/:curID", verifyToken, async (req: Request, res: Response) => notesContr.get_indiv_note(req, res, db));

//POST REQUEST TO ADD A NOTE: pass in ID, content, createdDate and editedDate
app.post('/notes', verifyToken, async (req: Request, res: Response) => notesContr.make_note(req, res, db));

//DELETE REQUEST TO DELETE A NOTE: pass in ID as parameter and it will be deleted
app.delete('/notes/:curID', verifyToken, async (req: Request, res: Response) => notesContr.delete_note(req, res, db));

//PUT REQUEST TO EDIT NOTE: pass in ID as parameter, content and editeddate in body.
app.put('/notes/:curID', async(req: Request, res: Response) => notesContr.edit_note(req, res, db) )

app.post("/register", async (req: Request, res: Response) => {
    const {username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await db.transaction((trx: any) => {
        trx.insert({
            username: username, 
            email: email,
            password: hash,
            user_id: crypto.randomUUID(),
            joined: new Date()
        })
        .into('users')
        .returning(['user_id', 'username'])
        .then((ids: {user_id: string}[]) => {
            const token = makeJWT(ids[0].user_id);
            res.status(201).json({
                username: ids[0].user_id,
                token: token
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })  
    .catch(() => res.status(400).send('Unable to Register'));
})

app.post("/signin", async (req: Request, res: Response) => {
    const { email, password } = req.body;
        db.select("email", "password", "user_id")
        .from("users")
        .where("email", email)
        .then(async (data: Array<{user_id: string, password: string}>) => {
            const PWMatch = await bcrypt.compare(password, data[0].password);
            if(PWMatch){
                res.status(200).json({
                    token: makeJWT(data[0].user_id)
                });
            }
            else{
                res.status(400).send("Wrong Credentials");
            }
        })
        .catch((err: any) => {
            console.error(err);
            res.status(400).send("Wrong credentials");
        });
})

module.exports = app;