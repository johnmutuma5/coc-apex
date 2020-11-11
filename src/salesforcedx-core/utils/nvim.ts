import * as path from 'path';
import {workspace, Uri} from "coc.nvim";

/**
  *
  * Get the current buffer's basename without the extension name
  *
  */
export async function getCurrentBufferBasename(): Promise<string> {
  try {
    const currentBuffer =  await workspace.nvim.buffer;
    const filePath = Uri.parse(await currentBuffer.name).fsPath;
    const className = path.basename(filePath).replace(path.extname(filePath), '');
    return Promise.resolve(className);
  } catch (e) {
    return Promise.reject(null);
  }
}
