import {CancelResponse, ContinueResponse, ParametersGatherer} from "../../../salesforcedx-utils-vscode";

export default class ContinueGatherer implements ParametersGatherer<void> {
  public async gather(): Promise<CancelResponse | ContinueResponse<null>> {
    return {
      type: 'CONTINUE',
      data: null
    }
  }
}
