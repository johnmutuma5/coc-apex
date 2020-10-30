// export {default as apexCreateSobjectFauxClasses} from "./apex-create-sobject-faux-classes";
import { ExtensionContext, commands, workspace, Uri, LanguageClient } from 'coc.nvim';
import { SObjectRefreshSource, FauxClassGenerator, SObjectCategory  } from './salesforcedx-sobjects-faux-generator';
import { ParametersGatherer, ContinueResponse, CancelResponse } from './salesforcedx-utils-vscode';
import {EventEmitter} from 'events';
import * as languageServer from './salesforcedx-vscode-apex/src/languageServer';

console.info('here');
export type RefreshSelection = {
  category: SObjectCategory;
  source: SObjectRefreshSource;
};

let languageClient: LanguageClient | undefined;

export class SObjectRefreshGatherer implements ParametersGatherer<RefreshSelection> {
  private source?: SObjectRefreshSource;

  public constructor(source?: SObjectRefreshSource) {
    this.source = source;
  }

  public async gather(): Promise<
    ContinueResponse<RefreshSelection> | CancelResponse
  > {
    let category = SObjectCategory.ALL;
    if (!this.source || this.source === SObjectRefreshSource.Manual) {
      const options = [
        'All',
        'Custom',
        'Standard'
      ];
      const choice = await workspace.showQuickpick(options);
      switch (choice) {
        case 0:
          category = SObjectCategory.ALL;
          break;
        case 1:
          category = SObjectCategory.CUSTOM;
          break;
        case 2:
          category = SObjectCategory.STANDARD;
          break;
        default:
          return { type: 'CANCEL' };
      }
    }
    return {
      type: 'CONTINUE',
      data: {
        category,
        source: this.source || SObjectRefreshSource.Manual
      }
    };
  }
}

// const workspaceChecker = new 
export async function forceGenerateFauxClassesCreate(
    source?: SObjectRefreshSource
) {
  const parameterGatherer = new SObjectRefreshGatherer(source);
  const params = await parameterGatherer.gather();
  switch(params.type) {
    case 'CONTINUE':
      const refreshCategory = params.data.category;
      const refreshSource = params.data.source;
      const gen: FauxClassGenerator = new FauxClassGenerator(new EventEmitter());
      const projectPath = Uri.parse(workspace.workspaceFolder.uri);
      return gen.generate(projectPath.fsPath, refreshCategory, refreshSource);
    case 'CANCEL':
      return workspace.showMessage('Refresh cancelled');
  }
}


export async function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand('SFDX.Refresh.SObjects', async () => {
    return forceGenerateFauxClassesCreate(SObjectRefreshSource.Manual);
  }));

  languageClient = await languageServer.createLanguageServer(context);
  context.subscriptions.push(languageClient.start());
  // languageClientUtils.setClientInstance(languageClient);
}
console.info('DONE')
