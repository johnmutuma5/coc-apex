import {CancelResponse, ContinueResponse, PostconditionChecker, PreconditionChecker} from "../../salesforcedx-utils-vscode";
import {workspace} from "coc.nvim";
import {notificationService} from "../notifications";
import {isSfdxProjectOpened} from "../predicates";

export class EmptyPostChecker implements PostconditionChecker<any> {
  public async check(
    inputs: ContinueResponse<any> | CancelResponse
  ): Promise<ContinueResponse<any> | CancelResponse> {
    return inputs;
  }
}


export class SfdxWorkspaceChecker implements PreconditionChecker {
  /**
  * @param {boolean} passive - check workspace passively? Don't show error messages if `true`
  *
  *
  */
  public check(passive?:boolean ): boolean {
    const result = isSfdxProjectOpened.apply(workspace);
    if (!result.result) {
      if(!passive){
        notificationService.showErrorMessage(result.message);
      }
      return false;
    }
    return true;
  }
}
