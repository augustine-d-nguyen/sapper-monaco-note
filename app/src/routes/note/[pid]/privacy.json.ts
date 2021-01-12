import { database } from '../../_firebase';
import type { Request, Response } from 'express';

export async function get(req: Request, res: Response, next: () => void) {
    const { pid } = req.params;

    const noteRef = database.collection('notes').doc(pid);
    const note = await noteRef.get();

    res.setHeader('Content-Type', 'application/json');
    if (note.exists) {
        const privacy = note.data().privacy;
        res.end(JSON.stringify({ privacy }));
    } else {
        res.end(JSON.stringify({ privacy: 'Public' }));
    }
}