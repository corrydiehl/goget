import * as vscode from 'vscode';
import url = require('url');
import * as https from 'https';
import { IconPath, NodeBase } from './nodeBase';
import { ChildNode } from './childNode';

export interface IHotListItem {
  Index: number;
  Name: string;
  Package: string;
  Link: string;
  Info: string;
}

export interface IHotList {
  Name: string;
  Info: string;
  Items: [IHotListItem];
}

export class RootNode extends NodeBase {
  private hotLists: IHotList[] = [];

  constructor(
    public readonly label: string,
    public readonly contextValue: 'hotRootNode' | 'hotTestRootNode' | 'mostImportedRootNode',
    public eventEmitter: vscode.EventEmitter<NodeBase>
  ) {
    super(label);

    this.getTops<IHotList[]>().then((data) => {
      console.log(data);
      this.hotLists = data;
    });
  }

  public getTreeItem(): vscode.TreeItem {
    return {
      label: this.label,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      contextValue: this.contextValue
    };
  }

  public async getChildren(element: RootNode): Promise<NodeBase[]> {
    switch (element.contextValue) {
      case 'hotRootNode': {
        return this.getHotNodes();
      }
      case 'hotTestRootNode': {
        return this.getHotTestNodes();
      }
      case 'mostImportedRootNode': {
        return this.getMostImportedNodes();
      }
      default: {
        throw new Error(`Unexpected contextValue ${element.contextValue}`);
      }
    }
  }

  private async getHotNodes(): Promise<NodeBase[]> {
    let nodes: NodeBase[] = [];

    this.hotLists.forEach((list) => {
      if (list.Name === 'Hot') {
        list.Items.forEach((item) => {
          nodes.push(new ChildNode(item.Package, 'childNode'));
        });
      }
    });

    return nodes;
  }

  private async getHotTestNodes(): Promise<NodeBase[]> {
    let nodes: NodeBase[] = [];

    this.hotLists.forEach((list) => {
      if (list.Name === 'Hot Test') {
        list.Items.forEach((item) => {
          nodes.push(new ChildNode(item.Package, 'childNode'));
        });
      }
    });

    return nodes;
  }

  private async getMostImportedNodes(): Promise<NodeBase[]> {
    let nodes: NodeBase[] = [];

    this.hotLists.forEach((list) => {
      if (list.Name === 'Most Imported') {
        list.Items.forEach((item) => {
          nodes.push(new ChildNode(item.Package, 'childNode'));
        });
      }
    });

    return nodes;
  }

  private async getTops<T>(): Promise<T> {
    return this.httpsRequest({
      // https://go-search.org/api?action=tops
      hostname: 'go-search.org',
      port: 443,
      path: '/api?action=tops',
      method: 'GET'
    }).then((data) => {
      console.log(data);
      return JSON.parse(data);
    });
  }

  private convertToOptions(options: https.RequestOptions | string): https.RequestOptions {
    if (typeof options === 'string') {
        // Must use Node's url, not vscode.Uri
        let optionsAsUrl = url.parse(options);
        return <https.RequestOptions>optionsAsUrl;
    } else {
        return options;
    }
  }

  private async httpsRequest(opts: https.RequestOptions | string): Promise<string> {
    let convertedOpts = this.convertToOptions(opts);
    convertedOpts.headers = convertedOpts.headers || {};
    convertedOpts.headers.Accept = 'application/json';
    // let convertedOpts = opts;

    return new Promise<string>((resolve, reject) => {
        let req = https.request(convertedOpts, (res) => {
            let data = '';
            res.on('data', (d: string) => {
                data += d;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.end();
        req.on('error', reject);
    });
  }
}