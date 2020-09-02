// export {default as apexCreateSobjectFauxClasses} from "./apex-create-sobject-faux-classes";
import { ExtensionContext, commands, workspace } from 'coc.nvim';
import { SObjectRefreshSource, FauxClassGenerator } from '@johnmutuma5/salesforce-sobjects-faux-generator/src/generator';
import { SObjectCategory } from '@johnmutuma5/salesforce-sobjects-faux-generator/src/describe';
import { ParametersGatherer, ContinueResponse, CancelResponse } from '@johnmutuma5/salesforcedx-utils-vscode/src/types';
import {EventEmitter} from 'events';

export type RefreshSelection = {
  category: SObjectCategory;
  source: SObjectRefreshSource;
};

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
      return gen.generate(workspace.workspaceFolders![0].uri, refreshCategory, refreshSource);
    case 'CANCEL':
      return workspace.showMessage('Refresh cancelled');
  }
    // const commandlet = new SfdxCommandlet(
    //   workspaceChecker,
    //   parameterGatherer,
    //   new ForceGenerateFauxClassesExecutor()
    // );
    // await commandlet.run();
}


export async function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand('SFDX - Refresh SObjects', async () => {
    return forceGenerateFauxClassesCreate(SObjectRefreshSource.Manual);
  }));
}
