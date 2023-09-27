export class BuildTree {
  buildTree(list: any[], parentId?: string | number): any {
    const tree: any[] = [];
    for (const item of list) {
      if (!item.parentId) {
        tree.push(item);
      } else {
        const children = this.buildTree(list, item.parentId);
        for (const child of children) {
          tree.push(child);
        }
      }
    }
    return tree;
  }
}
