import { ExtensionContext, LanguageClient, commands } from 'coc.nvim';
import { SObjectRefreshSource } from './salesforcedx-sobjects-faux-generator';
import * as languageServer from './salesforcedx-vscode-apex/src/languageServer';
import {SfdxWorkspaceChecker} from './salesforcedx-core/commands/utils';
import {forceGenerateFauxClassesCreate, forceApexClassTestRun, forceApexMethodTestRun } from './salesforcedx-vscode-apex/src/commands';
import {forceApexTestRun} from './salesforcedx-vscode-apex/src/commands/forceApexTestRun';
import {forceOpenDefaultOrg} from './salesforcedx-vscode-apex/src/commands/forceOpenDefaultOrg';


let languageClient: LanguageClient | undefined;
const sfdxWorkspaceChecker = new SfdxWorkspaceChecker();

export async function activate(context: ExtensionContext) {
  if(sfdxWorkspaceChecker.check(true)){
    languageClient = await languageServer.createLanguageServer(context);

    context.subscriptions.push(
      commands.registerCommand('SFDX.Refresh.SObjects', async () => {
        return forceGenerateFauxClassesCreate(SObjectRefreshSource.Manual);
      }),
      commands.registerCommand('SFDX.Run.Apex.Class.Tests', forceApexClassTestRun),
      commands.registerCommand('SFDX.Run.Apex.Method.Test', forceApexMethodTestRun),
      commands.registerCommand('SFDX.Run.Apex.Tests', forceApexTestRun),
      commands.registerCommand('SFDX.Open.Default.Scratch.Org', forceOpenDefaultOrg),
      languageClient.start()
    );
  }
}

