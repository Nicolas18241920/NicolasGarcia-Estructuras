import { NodeRecord } from '../models/tree-node.model';

export const ROOT_ID = '__root__';

export class TreeNode {
  readonly children: TreeNode[] = [];

  constructor(
    readonly data: NodeRecord,
    readonly parent: TreeNode | null = null,
  ) {}

  get isFolder(): boolean {
    return this.data.type === 'folder';
  }
}

const foldersFirstThenName = (a: TreeNode, b: TreeNode): number =>
  Number(b.isFolder) - Number(a.isFolder) ||
  a.data.name.localeCompare(b.data.name, 'es', { sensitivity: 'base' });

/** Árbol n-ario: cada carpeta puede tener N hijos; un archivo ninguno. */
export class NaryTree {
  readonly root = new TreeNode({
    id: ROOT_ID, name: '/', type: 'folder', parentId: null, createdBy: 'system', createdAt: 0,
  });

  /** Reconstruye el árbol desde la lista plana, sin depender del orden de llegada. */
  static fromRecords(records: readonly NodeRecord[]): NaryTree {
    const byParent = new Map<string | null, NodeRecord[]>();
    for (const record of records) {
      const siblings = byParent.get(record.parentId) ?? [];
      siblings.push(record);
      byParent.set(record.parentId, siblings);
    }

    const tree = new NaryTree();
    const queue: TreeNode[] = [tree.root];
    while (queue.length) {
      const current = queue.shift()!;
      const key = current === tree.root ? null : current.data.id;
      for (const record of byParent.get(key) ?? []) {
        const node = tree.attach(current, record);
        if (node.isFolder) queue.push(node); // los archivos nunca reciben hijos
      }
    }
    return tree;
  }

  /** Búsqueda en profundidad (iterativa). `null` devuelve la raíz. */
  find(id: string | null): TreeNode | null {
    if (id === null) return this.root;
    const stack: TreeNode[] = [this.root];
    while (stack.length) {
      const node = stack.pop()!;
      if (node.data.id === id) return node;
      stack.push(...node.children);
    }
    return null;
  }

  /** Devuelve el motivo del rechazo, o null si la inserción es válida. */
  validateAdd(parentId: string | null, name: string): string | null {
    const parent = this.find(parentId);
    if (!parent) return 'La carpeta destino no existe.';
    if (!parent.isFolder) return 'Un archivo no puede tener hijos.';
    const clean = name.trim().toLowerCase();
    if (parent.children.some((c) => c.data.name.toLowerCase() === clean)) {
      return `Ya existe "${name.trim()}" en esta carpeta.`;
    }
    return null;
  }

  add(record: NodeRecord): TreeNode {
    const error = this.validateAdd(record.parentId, record.name);
    if (error) throw new Error(error);
    return this.attach(this.find(record.parentId)!, record);
  }

  /** El nodo y todos sus descendientes (vacío si no existe). */
  subtree(id: string): TreeNode[] {
    const start = this.find(id);
    if (!start) return [];
    const result: TreeNode[] = [];
    const stack = [start];
    while (stack.length) {
      const node = stack.pop()!;
      result.push(node);
      stack.push(...node.children);
    }
    return result;
  }

  pathOf(id: string): string {
    const parts: string[] = [];
    let node = this.find(id);
    while (node && node !== this.root) {
      parts.unshift(node.data.name);
      node = node.parent;
    }
    return '/' + parts.join('/');
  }

  stats(): { folders: number; files: number } {
    let folders = 0;
    let files = 0;
    for (const node of this.subtree(ROOT_ID)) {
      if (node === this.root) continue;
      if (node.isFolder) folders++;
      else files++;
    }
    return { folders, files };
  }

  private attach(parent: TreeNode, record: NodeRecord): TreeNode {
    const node = new TreeNode(record, parent);
    parent.children.push(node);
    parent.children.sort(foldersFirstThenName);
    return node;
  }
}
