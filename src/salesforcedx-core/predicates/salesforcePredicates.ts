/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as fs from 'fs';
import * as path from 'path';
import { workspace } from 'coc.nvim';
import { SFDX_PROJECT_FILE } from '../constants';
import {nls} from '../../salesforcedx-vscode-apex/src/messages';
import {Predicate, PredicateResponse} from '../../salesforcedx-utils-vscode/src/predicates';
import {hasRootWorkspace, getRootWorkspacePath} from '../utils';

export class IsSfdxProjectOpened implements Predicate<typeof workspace> {
  public apply(item: typeof workspace): PredicateResponse {
    if (!hasRootWorkspace()) {
      return PredicateResponse.of(
        false,
        nls.localize('predicates_no_folder_opened_text')
      );
    } else if (
      !fs.existsSync(path.join(getRootWorkspacePath(), SFDX_PROJECT_FILE))
  ) {
      return PredicateResponse.of(
        false,
        nls.localize('predicates_no_sfdx_project_found_text')
      );
    } else {
      return PredicateResponse.true();
    }
  }
}

