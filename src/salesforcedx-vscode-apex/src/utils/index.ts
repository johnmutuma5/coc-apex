import * as glob from 'glob';
import { promisify } from 'util';
import {Uri} from 'coc.nvim';
 
const globFiles = promisify(glob);


export async function findFiles(globPattern: string, ignore?: string): Promise<Uri[]> {
  const files = await globFiles(globPattern, { absolute: true, ignore: ignore! });
  return Promise.resolve(files.map((file) => Uri.parse(file)));
}
