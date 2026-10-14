import { inject, Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  addDoc, collection, collectionData, doc, Firestore, writeBatch,
} from '@angular/fire/firestore';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { NodeRecord } from '../models/tree-node.model';

const BATCH_LIMIT = 450; // Firestore permite 500 operaciones por batch

@Injectable({ providedIn: 'root' })
export class TreeRepository {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly nodesCol = collection(this.firestore, 'nodes');

  /**
   * La escucha de Firestore depende de la sesión: se abre al iniciar sesión y se
   * cierra al salir. Así, al cambiar de cuenta no queda una escucha "muerta" por
   * permisos denegados.
   */
  readonly nodes$: Observable<NodeRecord[]> = authState(this.auth).pipe(
    switchMap((user) =>
      user
        ? (collectionData(this.nodesCol, { idField: 'id' }) as Observable<NodeRecord[]>).pipe(
            catchError((error) => {
              console.error('Error al leer el árbol:', error);
              return of([] as NodeRecord[]);
            }),
          )
        : of([] as NodeRecord[]),
    ),
  );

  async create(record: Omit<NodeRecord, 'id'>): Promise<string> {
    const ref = await addDoc(this.nodesCol, record);
    return ref.id;
  }

  async deleteMany(ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
      const batch = writeBatch(this.firestore);
      ids.slice(i, i + BATCH_LIMIT).forEach((id) => batch.delete(doc(this.firestore, 'nodes', id)));
      await batch.commit();
    }
  }
}
