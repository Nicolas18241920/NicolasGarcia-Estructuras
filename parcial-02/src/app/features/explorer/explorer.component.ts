import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NodeType } from '../../core/models/tree-node.model';
import { AuthService } from '../../core/services/auth.service';
import { FileSystemService } from '../../core/services/file-system.service';
import { TreeNode } from '../../core/tree/n-ary-tree';
import { TreeNodeViewComponent } from './tree-node-view/tree-node-view.component';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [ReactiveFormsModule, TreeNodeViewComponent],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.scss',
})
export class ExplorerComponent {
  protected readonly fs = inject(FileSystemService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  private readonly selectedFolderId = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly busy = signal(false);

  /** Carpeta destino efectiva: si la seleccionada ya no existe, vuelve a la raíz. */
  protected readonly target = computed(() => {
    const id = this.selectedFolderId();
    const node = id ? this.fs.tree().find(id) : null;
    return node?.isFolder ? id : null;
  });
  protected readonly targetPath = computed(() => {
    const id = this.target();
    return id ? this.fs.tree().pathOf(id) : '/';
  });

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(/^[^/\\]+$/)]],
    type: ['folder' as NodeType, Validators.required],
  });

  protected selectFolder(node: TreeNode | null): void {
    this.selectedFolderId.set(node?.data.id ?? null);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      const { name, type } = this.form.getRawValue();
      await this.fs.create({ name, type, parentId: this.target() });
      this.form.controls.name.reset('');
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Error inesperado.');
    } finally {
      this.busy.set(false);
    }
  }

  protected async remove(node: TreeNode): Promise<void> {
    const extra = node.children.length ? ' y todo su contenido' : '';
    if (!confirm(`¿Eliminar "${node.data.name}"${extra}?`)) return;
    this.error.set(null);
    try {
      await this.fs.remove(node.data.id);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Error inesperado.');
    }
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
