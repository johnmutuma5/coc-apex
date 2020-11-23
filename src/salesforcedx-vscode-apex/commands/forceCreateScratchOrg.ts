import * as path from 'path';
import {workspace} from "coc.nvim";
import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../salesforcedx-utils-vscode/cli/commandBuilder";
import {
  SCRATCH_ORG_ALIAS_PROMPT,
  SCRATCH_ORG_CONFIG_PROMPT,
  SCRATCH_ORG_DEFINITION_FILE,
  SCRATCH_ORG_CONFIG_DIR,
  SCRATCH_ORG_DURATION_PROMPT,
  SCRATCH_ORG_DURATION,
  SCRATCH_ORG_AS_DEFAULT_PROMPT
} from "../../salesforcedx-core/constants";
import {getRootWorkspacePath} from "../../salesforcedx-core/utils";

interface CreateScratchOrgOptions {
  duration: string;
  configFile: string;
  scratchOrgAlias: string;
  setDefaultOrg: boolean;
}

class PushToSourceGatherer implements ParametersGatherer<CreateScratchOrgOptions> {
  public async gather(): Promise<CancelResponse | ContinueResponse<CreateScratchOrgOptions>> {

    const scratchOrgAlias = await workspace.requestInput(SCRATCH_ORG_ALIAS_PROMPT);
    if(!scratchOrgAlias) {
      return {
        type: 'CANCEL'
      }
    }

    const projectPath = getRootWorkspacePath();
    const defaultConfigFilePath = path.resolve(projectPath, SCRATCH_ORG_CONFIG_DIR, SCRATCH_ORG_DEFINITION_FILE);
    const configFile = await workspace.requestInput(SCRATCH_ORG_CONFIG_PROMPT, `"${defaultConfigFilePath}"`);
    if(!configFile) {
      return {
        type: 'CANCEL'
      }
    }
    const duration = await workspace.requestInput(SCRATCH_ORG_DURATION_PROMPT, SCRATCH_ORG_DURATION);
    const setDefaultOrg = await workspace.showPrompt(SCRATCH_ORG_AS_DEFAULT_PROMPT);

    return {
      type: 'CONTINUE',
      data: {
        scratchOrgAlias,
        configFile,
        duration,
        setDefaultOrg
      }
    };
  }
}

class ForceCreateScratchOrgExecutor extends SfdxCommandletExecutor<CreateScratchOrgOptions> {
  public build(data: CreateScratchOrgOptions): Command {
    const builder = new SfdxCommandBuilder();
    builder 
      .withDescription(`Creating a new scratch org: ${data.scratchOrgAlias}`)
      .withArg('force:org:create')
      .withFlag('--definitionfile', data.configFile)
      .withFlag('--durationdays', data.duration)
      .withFlag('--setalias', data.scratchOrgAlias)

    if(data.setDefaultOrg) {
      builder.withArg('--setdefaultusername')
    }

    return builder.build();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new PushToSourceGatherer();

export async function forceCreateScratchOrg() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceCreateScratchOrgExecutor()
  );
  await commandlet.run();
}

