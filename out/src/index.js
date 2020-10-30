"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// export {default as apexCreateSobjectFauxClasses} from "./apex-create-sobject-faux-classes";
const coc_nvim_1 = require("coc.nvim");
const salesforcedx_sobjects_faux_generator_1 = require("./salesforcedx-sobjects-faux-generator");
const events_1 = require("events");
const languageServer = require("./salesforcedx-vscode-apex/src/languageServer");
console.info('here');
let languageClient;
class SObjectRefreshGatherer {
    constructor(source) {
        this.source = source;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            let category = salesforcedx_sobjects_faux_generator_1.SObjectCategory.ALL;
            if (!this.source || this.source === salesforcedx_sobjects_faux_generator_1.SObjectRefreshSource.Manual) {
                const options = [
                    'All',
                    'Custom',
                    'Standard'
                ];
                const choice = yield coc_nvim_1.workspace.showQuickpick(options);
                switch (choice) {
                    case 0:
                        category = salesforcedx_sobjects_faux_generator_1.SObjectCategory.ALL;
                        break;
                    case 1:
                        category = salesforcedx_sobjects_faux_generator_1.SObjectCategory.CUSTOM;
                        break;
                    case 2:
                        category = salesforcedx_sobjects_faux_generator_1.SObjectCategory.STANDARD;
                        break;
                    default:
                        return { type: 'CANCEL' };
                }
            }
            return {
                type: 'CONTINUE',
                data: {
                    category,
                    source: this.source || salesforcedx_sobjects_faux_generator_1.SObjectRefreshSource.Manual
                }
            };
        });
    }
}
exports.SObjectRefreshGatherer = SObjectRefreshGatherer;
// const workspaceChecker = new 
function forceGenerateFauxClassesCreate(source) {
    return __awaiter(this, void 0, void 0, function* () {
        const parameterGatherer = new SObjectRefreshGatherer(source);
        const params = yield parameterGatherer.gather();
        switch (params.type) {
            case 'CONTINUE':
                const refreshCategory = params.data.category;
                const refreshSource = params.data.source;
                const gen = new salesforcedx_sobjects_faux_generator_1.FauxClassGenerator(new events_1.EventEmitter());
                const projectPath = coc_nvim_1.Uri.parse(coc_nvim_1.workspace.workspaceFolder.uri);
                return gen.generate(projectPath.fsPath, refreshCategory, refreshSource);
            case 'CANCEL':
                return coc_nvim_1.workspace.showMessage('Refresh cancelled');
        }
    });
}
exports.forceGenerateFauxClassesCreate = forceGenerateFauxClassesCreate;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.subscriptions.push(coc_nvim_1.commands.registerCommand('SFDX.Refresh.SObjects', () => __awaiter(this, void 0, void 0, function* () {
            return forceGenerateFauxClassesCreate(salesforcedx_sobjects_faux_generator_1.SObjectRefreshSource.Manual);
        })));
        languageClient = yield languageServer.createLanguageServer(context);
        context.subscriptions.push(languageClient.start());
        // languageClientUtils.setClientInstance(languageClient);
    });
}
exports.activate = activate;
console.info('DONE');
