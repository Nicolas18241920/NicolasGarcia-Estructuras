import { NodeRecord, NodeType } from '../models/tree-node.model';
import { NaryTree } from './n-ary-tree';

const rec = (id: string, name: string, type: NodeType, parentId: string | null): NodeRecord => ({
  id, name, type, parentId, createdBy: 'a@a.com', createdAt: 1,
});

describe('NaryTree', () => {
  it('agrega una carpeta en la raíz', () => {
    const tree = new NaryTree();
    tree.add(rec('1', 'Docs', 'folder', null));
    expect(tree.root.children.length).toBe(1);
  });

  it('permite varios hijos dentro de una carpeta', () => {
    const tree = new NaryTree();
    tree.add(rec('1', 'Docs', 'folder', null));
    tree.add(rec('2', 'a.txt', 'file', '1'));
    tree.add(rec('3', 'b.txt', 'file', '1'));
    expect(tree.find('1')!.children.length).toBe(2);
  });

  it('rechaza hijos dentro de un archivo', () => {
    const tree = new NaryTree();
    tree.add(rec('1', 'a.txt', 'file', null));
    expect(() => tree.add(rec('2', 'x', 'folder', '1'))).toThrow();
  });

  it('rechaza nombres duplicados en la misma carpeta', () => {
    const tree = new NaryTree();
    tree.add(rec('1', 'Docs', 'folder', null));
    expect(() => tree.add(rec('2', 'docs', 'folder', null))).toThrow();
  });

  it('reconstruye el árbol aunque los registros lleguen desordenados', () => {
    const tree = NaryTree.fromRecords([
      rec('3', 'c.txt', 'file', '2'),
      rec('2', 'Sub', 'folder', '1'),
      rec('1', 'Docs', 'folder', null),
    ]);
    expect(tree.pathOf('3')).toBe('/Docs/Sub/c.txt');
  });

  it('subtree devuelve el nodo y sus descendientes', () => {
    const tree = NaryTree.fromRecords([
      rec('1', 'Docs', 'folder', null),
      rec('2', 'a.txt', 'file', '1'),
    ]);
    expect(tree.subtree('1').map((n) => n.data.id).sort()).toEqual(['1', '2']);
  });
});
