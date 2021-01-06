import { database } from './_firebase';
import type { Request, Response } from 'express';

export async function post(req: Request, res: Response, next: () => void) {
    const { pid } = req.body;
    // console.log(pid);

    const noteRef = database.collection('notes').doc(pid);
    const note = await noteRef.get();

    res.setHeader('Content-Type', 'application/json');
    if (note.exists) {
        res.end(JSON.stringify(note.data()));
    } else {
        res.end(JSON.stringify({}));
    }
}

export async function put(req: Request, res: Response, next: () => void) {
    const { pid, ndata } = req.body;
    // console.log(pid);

    const notes = database.collection('notes');
    await notes.doc(pid).set({
        ndata: ndata
    });

    res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({ success: true }));
}