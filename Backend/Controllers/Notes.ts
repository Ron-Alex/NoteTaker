import { Request, Response } from "express";

interface reqObject extends Request{
    user: {
        user_id: string
    }
}

const get_all_notes = async (req: reqObject, res: Response, db: any) => {
    try{
        const notes = await db('notestorage').where({user_id: req.user.user_id}).orderBy('createddate', 'asc');
        res.status(200).send(notes);
    }
    catch{
        res.status(500).send({ error: "FAILED TO FETCH NOTES"});
    }
}

const get_indiv_note = async (req: reqObject, res: Response, db: any) => {
    const {curID} = req.params;
    try {   
        const note = await db('notestorage').where('storedid', curID).andWhere({user_id: req.user.user_id});
        res.status(200).send(note);
    } catch (error) {
        res.status(500).send({error: "Could not find note"});
    }
}

const make_note = async (req: reqObject, res: Response, db: any) => {
    const {storedid, content, createddate, editeddate} = req.body;
    try{
        await db('notestorage').insert({
            storedid: storedid,
            content: JSON.stringify(content),
            createddate: createddate,
            editeddate: editeddate,
            user_id: req.user.user_id
        });
        res.status(200).send({message: "NOTE HAS BEEN CREATED!"});
    } catch(err){
        res.status(500).send(err);
    }
}

const delete_note = async (req: reqObject, res: Response, db: any) => {
    const {curID} = req.params;
    try{
        await db('notestorage').where('storedid', curID).andWhere({user_id: req.user.user_id}).del();
        res.status(200).send({message: "Note has been deleted"});
    } catch(err){
        res.status(500).send(err);
    }
}

const edit_note = async (req: reqObject, res: Response, db: any) => {
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
}

module.exports = {
    get_all_notes: get_all_notes,
    get_indiv_note: get_indiv_note,
    delete_note: delete_note,
    make_note: make_note,
    edit_note: edit_note
};  