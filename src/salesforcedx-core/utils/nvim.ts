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
    return  path.basename(filePath).replace(path.extname(filePath), '');
  } catch (e) {
    return Promise.reject(null);
  }
}

export async function getCurrentLine(): Promise<string> {
  try {
    return workspace.nvim.getLine();
  } catch (e) {
    return Promise.reject(null);
  }
}
