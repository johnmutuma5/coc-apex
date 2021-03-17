import * as path from 'path';
import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../salesforcedx-utils-vscode/cli/commandBuilder";
import {CliLogLevel} from "../../salesforcedx-core/model/cliLogLevels";
import {workspace} from "coc.nvim";
import {getRootWorkspacePath} from "../../salesforcedx-core/utils";
import {FILE_NAME_PROMPT, OUTPUT_DIR_PROMPT} from '../../salesforcedx-core/constants';
import {getDefaultSrcRootPath} from '../utils'

interface CreateLwcOptions {
  name: string;
  outputDir: string;
}

class CreateLwcGatherer implements ParametersGatherer<CreateLwcOptions> {
  public async gather(): Promise<CancelResponse | ContinueResponse<CreateLwcOptions>> {
    const name = await workspace.requestInput(FILE_NAME_PROMPT);
    if (!name) {
      return {
        type: 'CANCEL'
      }
    }

    const defaultLwcDir = path.resolve(getRootWorkspacePath(), getDefaultSrcRootPath(), 'lwc');
    const outputDir = await workspace.requestInput(OUTPUT_DIR_PROMPT, defaultLwcDir);

    return {
      type: 'CONTINUE',
      data: {
        name,
        outputDir: outputDir || defaultLwcDir
      }
    };
  }
}

class ForceCreateLwcExecutor extends SfdxCommandletExecutor<null> {
  public build(data: CreateLwcOptions): Command {
    return new SfdxCommandBuilder()
      .withDescription('Opening Default Scratch Org')
      .withArg('force:lightning:component:create')
      .withFlag('--componentname', data.name)
      .withFlag('--outputdir', data.outputDir)
      .withFlag('--type', 'lwc')
      .withFlag('--loglevel', CliLogLevel.DEBUG)
      .build();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new CreateLwcGatherer();

export async function forceCreateLwc() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceCreateLwcExecutor()
  );
  await commandlet.run();
}

