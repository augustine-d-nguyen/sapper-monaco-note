import type { Request, Response } from 'express';
import { database } from '../_firebase';

export async function post(req: Request, res: Response, next: () => void) {
    const { pid, pwd } = req.body;

    const noteRef = database.collection('notes').doc(pid);
    const note = await noteRef.get();

    res.setHeader('Content-Type', 'application/json');
    if (!note.exists) {
        res.end(JSON.stringify({}));
        return;
    }
    
    const data = note.data();
    if (data.privacy === 'Private') {
        // console.log(`${pwd} = ${data.pwd}`);
        if (pwd === data.pwd) {
            res.end(JSON.stringify({ ndata: data.ndata }));
        } else {
            res.status(403).end(JSON.stringify({ message: 'Wrong credentials!' }))
        }
    } else {
        res.end(JSON.stringify({ ndata: data.ndata }));
    }
}

export async function put(req: Request, res: Response, next: () => void) {
    const { pid, ndata, privacy, pwd } = req.body;
    // console.log(req.body);

    const noteRef = database.collection('notes').doc(pid);
    const note = await noteRef.get();

    res.setHeader('Content-Type', 'application/json');
    if (!note.exists) {
        await noteRef.set({
            ndata: ndata,
            privacy: privacy,
            pwd: pwd
        });
        res.end(JSON.stringify({ message: 'Saved!' }));
        return;
    }

    const oldData = note.data();
    if (oldData.privacy === 'Public' || oldData.pwd === pwd) {
        await noteRef.set({
            ndata: ndata,
            privacy: privacy,
            pwd: pwd
        });
        res.end(JSON.stringify({ message: 'Saved!' }));
    } else {
        res.status(403).end(JSON.stringify({ message: 'Wrong credentials!' }));
    }
}