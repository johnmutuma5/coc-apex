import * as path from 'path';
import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../salesforcedx-utils-vscode/cli/commandBuilder";
import {CliLogLevel} from "../../salesforcedx-core/model/cliLogLevels";
import {workspace} from "coc.nvim";
import {getRootWorkspacePath} from "../../salesforcedx-core/utils";
import {CLASS_NAME_PROMPT, CLASS_TEMPLATE_PROMPT, DEFAULT_APEX_CLASS, CLASS_OUTPUT_DIR_PROMPT} from '../../salesforcedx-core/constants';
import {getDefaultSrcRootPath} from '../utils'

interface CreateApexClassOptions {
  name: string;
  template: string;
  outputDir: string;
}

class CreateApexClassGatherer implements ParametersGatherer<CreateApexClassOptions> {
  public async gather(): Promise<CancelResponse | ContinueResponse<CreateApexClassOptions>> {
    const name = await workspace.requestInput(CLASS_NAME_PROMPT);
    if (!name) {
      return {
        type: 'CANCEL'
      }
    }

    const template = await workspace.requestInput(CLASS_TEMPLATE_PROMPT, DEFAULT_APEX_CLASS);

    const defaultApexClassDir = path.resolve(getRootWorkspacePath(), getDefaultSrcRootPath(), 'classes');
    const outputDir = await workspace.requestInput(CLASS_OUTPUT_DIR_PROMPT, defaultApexClassDir);

    return {
      type: 'CONTINUE',
      data: {
        name,
        template: template || DEFAULT_APEX_CLASS,
        outputDir: outputDir || defaultApexClassDir
      }
    };
  }
}

class ForceCreateApexClassExecutor extends SfdxCommandletExecutor<null> {
  public build(data: CreateApexClassOptions): Command {
    return new SfdxCommandBuilder()
      .withDescription('Opening Default Scratch Org')
      .withArg('force:apex:class:create')
      .withFlag('--classname', data.name)
      .withFlag('--template', data.template)
      .withFlag('--outputdir', data.outputDir)
      .withFlag('--loglevel', CliLogLevel.DEBUG)
      .build();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new CreateApexClassGatherer();

export async function forceCreateApexClass() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceCreateApexClassExecutor()
  );
  await commandlet.run();
}

