import { ExtensionContext, commands, LanguageClient } from 'coc.nvim';
import { SObjectRefreshSource } from './salesforcedx-sobjects-faux-generator';
import * as languageServer from './salesforcedx-vscode-apex/src/languageServer';
import {SfdxWorkspaceChecker} from './salesforcedx-core/commands/utils';
import {forceGenerateFauxClassesCreate, forceApexClassTestRun} from './salesforcedx-vscode-apex/src/commands';
import {forceApexTestRun} from './salesforcedx-vscode-apex/src/commands/forceApexTestRun';


let languageClient: LanguageClient | undefined;

const sfdxWorkspaceChecker = new SfdxWorkspaceChecker();

export async function activate(context: ExtensionContext) {
  if(sfdxWorkspaceChecker.check(true)){
    languageClient = await languageServer.createLanguageServer(context);

    context.subscriptions.push(
      commands.registerCommand('SFDX.Refresh.SObjects', async () => {
        // const line = await workspace.nvim.getLine();
        // console.log('windows: ', (await (workspace.nvim.windows)).map(win => win.id));
        // console.log('line: ', line);
        // const pos = await workspace.getCursorPosition();
        // console.log('line splice: ', line.slice(pos.character))
        // console.log('line: ', await workspace.getLine();
        return forceGenerateFauxClassesCreate(SObjectRefreshSource.Manual);
      }),
      commands.registerCommand('SFDX.run.apex.class.tests', forceApexClassTestRun),
      commands.registerCommand('SFDX.run.apex.tests', forceApexTestRun),
      languageClient.start()
    );
    // context.subscriptions.push(languageClient.start());
    // languageClientUtils.setClientInstance(languageClient);
  }
}
