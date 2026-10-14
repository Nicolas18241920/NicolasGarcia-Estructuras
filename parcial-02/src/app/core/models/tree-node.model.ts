export type NodeType = 'folder' | 'file';

/** Registro tal como se persiste en Firestore. */
export interface NodeRecord {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null; // null = hijo directo de la raíz
  createdBy: string;       // correo de quien lo creó (dato validador)
  createdAt: number;
}

export type NewNodeInput = Pick<NodeRecord, 'name' | 'type' | 'parentId'>;
