import { ExtensionContext, LanguageClient, commands } from 'coc.nvim';
import { SObjectRefreshSource } from './salesforcedx-sobjects-faux-generator';
import * as languageServer from './salesforcedx-vscode-apex/languageServer';
import {SfdxWorkspaceChecker} from './salesforcedx-core/commands/utils';
import {
  forceGenerateFauxClassesCreate,
  forceApexClassTestRun,
  forceApexMethodTestRun,
  forceApexTestRun,
  forceOpenDefaultOrg,
  forcePushDefaultOrg,
  forcePullDefaultOrg,
  forceGeneratePassword,
  forceDisplayPassword,
  forceCreateScratchOrg,
  forceCreateApexClass
  } from './salesforcedx-vscode-apex/commands';


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
      commands.registerCommand('SFDX.Push.Default.Scratch.Org', forcePushDefaultOrg),
      commands.registerCommand('SFDX.Pull.Default.Scratch.Org', forcePullDefaultOrg),
      commands.registerCommand('SFDX.Generate.Password.Default.Scratch.Org', forceGeneratePassword),
      commands.registerCommand('SFDX.Display.Password.Default.Scratch.Org', forceDisplayPassword),
      commands.registerCommand('SFDX.Create.Scratch.Org', forceCreateScratchOrg),
      commands.registerCommand('SFDX.Create.Apex.Class', forceCreateApexClass),
      languageClient.start()
    );
  }
}

