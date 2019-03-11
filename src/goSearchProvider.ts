import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { NodeBase } from './nodeBase';
import { RootNode } from './rootNode';

export class GoSearchProvider implements vscode.TreeDataProvider<NodeBase> {

  private _onDidChangeTreeData: vscode.EventEmitter<NodeBase> = new vscode.EventEmitter<NodeBase>();
  public readonly onDidChangeTreeData: vscode.Event<NodeBase> = this._onDidChangeTreeData.event;

  private _hotRootNode: RootNode | undefined;
  private _hotTestRootNode: RootNode | undefined;
  private _mostImportedRootNode: RootNode | undefined;

  async getChildren(element?: NodeBase): Promise<NodeBase[]> {
    if (!element) {
      return this.getRootNodes();
    }
    return element.getChildren(element);
  }

  getTreeItem(element: NodeBase): vscode.TreeItem {
    return element.getTreeItem();
  }

  private async getRootNodes(): Promise<RootNode[]> {
    const rootNodes: RootNode[] = [];
    let node: RootNode;

    node = new RootNode("Hot", "hotRootNode", this._onDidChangeTreeData);
    this._hotRootNode = node;
    rootNodes.push(node);

    node = new RootNode("Hot Test", "hotTestRootNode", this._onDidChangeTreeData);
    this._hotTestRootNode = node;
    rootNodes.push(node);

    node = new RootNode("Most Imported", "mostImportedRootNode", this._onDidChangeTreeData);
    this._mostImportedRootNode = node;
    rootNodes.push(node);

    return rootNodes;
  }

}