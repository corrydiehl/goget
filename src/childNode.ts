import * as vscode from 'vscode';
import { pathToFileURL } from "url";
import { IconPath, NodeBase } from './nodeBase';

export class ChildNode extends NodeBase {

  constructor(
    public readonly label: string,
    public readonly contextValue: 'childNode',
  ) {
    super(label);
  }

  public getTreeItem(): vscode.TreeItem {
    return {
        label: this.label,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        contextValue: this.contextValue
    };
  }

  public async getChildren(element: NodeBase): Promise<NodeBase[]> {
      return [];
  }
}