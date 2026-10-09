import { Injectable } from '@angular/core';
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where,
} from 'firebase/firestore';
import { db } from './firebase/config';

export interface Tarea {
  id?: string;
  titulo: string;
  hecha: boolean;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private col = collection(db, 'tareas');

  escuchar(uid: string, cb: (tareas: Tarea[]) => void): () => void {
    const q = query(this.col, where('uid', '==', uid));
    return onSnapshot(q, (snap) =>
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Tarea, 'id'>) })))
    );
  }

  agregar(titulo: string, uid: string) {
    return addDoc(this.col, { titulo, hecha: false, uid });
  }

  actualizar(id: string, datos: Partial<Tarea>) {
    return updateDoc(doc(db, 'tareas', id), datos);
  }

  eliminar(id: string) {
    return deleteDoc(doc(db, 'tareas', id));
  }
}