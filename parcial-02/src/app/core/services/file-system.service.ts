import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewNodeInput, NodeRecord } from '../models/tree-node.model';
import { NaryTree } from '../tree/n-ary-tree';
import { AuthService } from './auth.service';
import { TreeRepository } from './tree-repository.service';

const NAME_PATTERN = /^[^/\\]+$/;
const MAX_NAME = 60;

@Injectable({ providedIn: 'root' })
export class FileSystemService {
  private readonly repo = inject(TreeRepository);
  private readonly auth = inject(AuthService);

  private readonly records = toSignal(this.repo.nodes$, { initialValue: [] as NodeRecord[] });

  readonly tree = computed(() => NaryTree.fromRecords(this.records()));
  readonly stats = computed(() => this.tree().stats());

  async create(input: NewNodeInput): Promise<void> {
    const email = this.auth.email();
    if (!email) throw new Error('Debes iniciar sesión para crear carpetas o archivos.');

    const name = input.name.trim();
    if (!name || name.length > MAX_NAME || !NAME_PATTERN.test(name)) {
      throw new Error(`El nombre es obligatorio, máx. ${MAX_NAME} caracteres y sin "/" ni "\\".`);
    }

    const error = this.tree().validateAdd(input.parentId, name);
    if (error) throw new Error(error);

    await this.repo.create({
      name,
      type: input.type,
      parentId: input.parentId,
      createdBy: email,
      createdAt: Date.now(),
    });
  }

  async remove(id: string): Promise<void> {
    const email = this.auth.email();
    if (!email) throw new Error('Debes iniciar sesión para eliminar.');

    const nodes = this.tree().subtree(id);
    if (!nodes.length) return;
    if (nodes.some((n) => n.data.createdBy !== email)) {
      throw new Error('Solo puedes eliminar elementos (y su contenido) creados por ti.');
    }
    await this.repo.deleteMany(nodes.map((n) => n.data.id));
  }
}
