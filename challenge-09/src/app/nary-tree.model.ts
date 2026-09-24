export interface MenuItem {
  title: string;
  link?: string;
  component?: string;
}

export class TreeNode {
  item: MenuItem;
  children: TreeNode[];
  expanded: boolean;

  constructor(item: MenuItem, children: TreeNode[] = [], expanded = false) {
    this.item = item;
    this.children = children;
    this.expanded = expanded;
  }

  addChild(child: TreeNode): void {
    this.children.push(child);
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }
}