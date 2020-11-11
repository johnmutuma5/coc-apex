/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { workspace, Uri } from 'coc.nvim';
import {WorkspaceFolder} from 'vscode-languageserver-protocol';

export function hasRootWorkspace(ws: typeof workspace = workspace) {
  return ws?.workspaceFolders?.length > 0 || ws?.workspaceFolder;
}

export function getRootWorkspace(): WorkspaceFolder {
  return hasRootWorkspace()
    ? workspace.workspaceFolders?.[0] || workspace.workspaceFolder
    : ({} as WorkspaceFolder);
}

export function getRootWorkspacePath(): string {
  return getRootWorkspace().uri ? Uri.parse(getRootWorkspace().uri).fsPath : '';
}

