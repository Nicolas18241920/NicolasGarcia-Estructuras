import { Component, input, output, signal } from '@angular/core';
import { TreeNode } from '../../../core/tree/n-ary-tree';

@Component({
  selector: 'app-tree-node-view',
  standalone: true,
  templateUrl: './tree-node-view.component.html',
  styleUrl: './tree-node-view.component.scss',
})
export class TreeNodeViewComponent {
  readonly node = input.required<TreeNode>();
  readonly selectedId = input<string | null>(null);

  readonly folderSelected = output<TreeNode>();
  readonly removeRequested = output<TreeNode>();

  protected readonly expanded = signal(true);

  protected onRowActivate(): void {
    if (!this.node().isFolder) return;
    this.expanded.update((v) => !v);
    this.folderSelected.emit(this.node());
  }
}
