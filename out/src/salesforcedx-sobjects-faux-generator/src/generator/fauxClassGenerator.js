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
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const coc_nvim_1 = require("coc.nvim");
const core_1 = require("@salesforce/core");
const salesforcedx_utils_vscode_1 = require("../../../salesforcedx-utils-vscode");
const fs = require("fs");
const os_1 = require("os");
const path = require("path");
const shelljs_1 = require("shelljs");
const constants_1 = require("../constants");
const describe_1 = require("../describe");
const configUtil_1 = require("../describe/configUtil");
const __1 = require("../../");
exports.INDENT = '    ';
const MODIFIER = 'global';
var SObjectRefreshSource;
(function (SObjectRefreshSource) {
    SObjectRefreshSource["Manual"] = "manual";
    SObjectRefreshSource["Startup"] = "startup";
})(SObjectRefreshSource = exports.SObjectRefreshSource || (exports.SObjectRefreshSource = {}));
class FauxClassGenerator {
    constructor(emitter, cancellationToken) {
        this.emitter = emitter;
        this.cancellationToken = cancellationToken;
        this.result = { data: { cancelled: false } };
    }
    static fieldDeclToString(decl) {
        return `${FauxClassGenerator.commentToString(decl.comment)}${exports.INDENT}${decl.modifier} ${decl.type} ${decl.name};`;
    }
    // VisibleForTesting
    static commentToString(comment) {
        // for some reasons if the comment is on a single line the help context shows the last '*/'
        return comment
            ? `${exports.INDENT}/* ${comment.replace(/(\/\*+\/)|(\/\*+)|(\*+\/)/g, '')}${os_1.EOL}${exports.INDENT}*/${os_1.EOL}`
            : '';
    }
    generate(projectPath, type, source) {
        return __awaiter(this, void 0, void 0, function* () {
            this.result = { data: { category: type, source, cancelled: false } };
            const sobjectsFolderPath = path.join(projectPath, constants_1.SFDX_DIR, constants_1.TOOLS_DIR, constants_1.SOBJECTS_DIR);
            const standardSObjectsFolderPath = path.join(sobjectsFolderPath, constants_1.STANDARDOBJECTS_DIR);
            const customSObjectsFolderPath = path.join(sobjectsFolderPath, constants_1.CUSTOMOBJECTS_DIR);
            if (!fs.existsSync(projectPath) ||
                !fs.existsSync(path.join(projectPath, salesforcedx_utils_vscode_1.SFDX_PROJECT_FILE))) {
                return this.errorExit('Not in an SFDX project'
                // nls.localize('no_generate_if_not_in_project', sobjectsFolderPath)
                );
            }
            this.cleanupSObjectFolders(sobjectsFolderPath, type);
            const connection = yield core_1.Connection.create({
                authInfo: yield core_1.AuthInfo.create({
                    username: yield configUtil_1.ConfigUtil.getUsername(projectPath)
                })
            });
            const describe = new describe_1.SObjectDescribe(connection);
            const standardSObjects = [];
            const customSObjects = [];
            let fetchedSObjects = [];
            let sobjects = [];
            try {
                coc_nvim_1.workspace.showMessage('Fetching SObject descriptions');
                sobjects = yield describe.describeGlobal(projectPath, type);
            }
            catch (e) {
                const err = JSON.parse(e);
                return this.errorExit(__1.nls.localize('failure_fetching_sobjects_list_text', err.message), err.stack);
            }
            const filteredSObjects = sobjects.filter(this.isRequiredSObject);
            let j = 0;
            while (j < filteredSObjects.length) {
                try {
                    if (this.cancellationToken &&
                        this.cancellationToken.isCancellationRequested) {
                        return this.cancelExit();
                    }
                    fetchedSObjects = fetchedSObjects.concat(yield describe.describeSObjectBatch(filteredSObjects, j));
                    j = fetchedSObjects.length;
                    coc_nvim_1.workspace.showMessage(`Fetch SObejct at ${j} / ${filteredSObjects.length}`);
                }
                catch (errorMessage) {
                    return this.errorExit(__1.nls.localize('failure_in_sobject_describe_text', errorMessage));
                }
            }
            coc_nvim_1.workspace.showMessage('Fetch Done: Creating Faux SObejct classes');
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < fetchedSObjects.length; i++) {
                if (fetchedSObjects[i].custom) {
                    customSObjects.push(fetchedSObjects[i]);
                }
                else {
                    standardSObjects.push(fetchedSObjects[i]);
                }
            }
            this.result.data.standardObjects = standardSObjects.length;
            this.result.data.customObjects = customSObjects.length;
            this.logFetchedObjects(standardSObjects, customSObjects);
            try {
                this.generateFauxClasses(standardSObjects, standardSObjectsFolderPath);
            }
            catch (errorMessage) {
                return this.errorExit(errorMessage);
            }
            try {
                this.generateFauxClasses(customSObjects, customSObjectsFolderPath);
            }
            catch (errorMessage) {
                return this.errorExit(errorMessage);
            }
            return this.successExit();
        });
    }
    // VisibleForTesting
    isRequiredSObject(sobject) {
        // Ignore all sobjects that end with Share or History or Feed or Event
        return !/Share$|History$|Feed$|Event$/.test(sobject);
    }
    // VisibleForTesting
    generateFauxClassText(sobject) {
        const declarations = this.generateFauxClassDecls(sobject);
        return this.generateFauxClassTextFromDecls(sobject.name, declarations);
    }
    // VisibleForTesting
    generateFauxClass(folderPath, sobject) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        const fauxClassPath = path.join(folderPath, sobject.name + '.cls');
        fs.writeFileSync(fauxClassPath, this.generateFauxClassText(sobject), {
            mode: 0o444
        });
        return fauxClassPath;
    }
    // VisibleForTesting
    cleanupSObjectFolders(baseSObjectsFolder, type) {
        let pathToClean;
        switch (type) {
            case describe_1.SObjectCategory.STANDARD:
                pathToClean = path.join(baseSObjectsFolder, constants_1.STANDARDOBJECTS_DIR);
                break;
            case describe_1.SObjectCategory.CUSTOM:
                pathToClean = path.join(baseSObjectsFolder, constants_1.CUSTOMOBJECTS_DIR);
                break;
            default:
                pathToClean = baseSObjectsFolder;
        }
        if (fs.existsSync(pathToClean)) {
            shelljs_1.rm('-rf', pathToClean);
        }
    }
    errorExit(message, stack) {
        this.emitter.emit(salesforcedx_utils_vscode_1.LocalCommandExecution.STDERR_EVENT, `${message}\n`);
        this.emitter.emit(salesforcedx_utils_vscode_1.LocalCommandExecution.ERROR_EVENT, new Error(message));
        this.emitter.emit(salesforcedx_utils_vscode_1.LocalCommandExecution.EXIT_EVENT, salesforcedx_utils_vscode_1.LocalCommandExecution.FAILURE_CODE);
        this.result.error = { message, stack };
        return Promise.reject(this.result);
    }
    successExit() {
        this.emitter.emit(salesforcedx_utils_vscode_1.LocalCommandExecution.EXIT_EVENT, salesforcedx_utils_vscode_1.LocalCommandExecution.SUCCESS_CODE);
        coc_nvim_1.workspace.showMessage('Yeeeehh! Successfully created SObject Faux Classes');
        return Promise.resolve(this.result);
    }
    cancelExit() {
        this.emitter.emit(salesforcedx_utils_vscode_1.LocalCommandExecution.EXIT_EVENT, salesforcedx_utils_vscode_1.LocalCommandExecution.FAILURE_CODE);
        this.result.data.cancelled = true;
        return Promise.resolve(this.result);
    }
    stripId(name) {
        if (name.endsWith('Id')) {
            return name.slice(0, name.length - 2);
        }
        else {
            return name;
        }
    }
    capitalize(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
    getTargetType(describeType) {
        const gentype = FauxClassGenerator.typeMapping.get(describeType);
        return gentype ? gentype : this.capitalize(describeType);
    }
    getReferenceName(relationshipName, name) {
        return relationshipName ? relationshipName : this.stripId(name);
    }
    generateChildRelationship(rel) {
        const name = this.getReferenceName(rel.relationshipName, rel.field);
        return {
            modifier: MODIFIER,
            type: `List<${rel.childSObject}>`,
            name
        };
    }
    generateField(field) {
        const decls = [];
        const comment = field.inlineHelpText;
        let genType = '';
        if (field.referenceTo.length === 0) {
            // should be a normal field EXCEPT for external lookup & metadata relationship
            // which is a reference, but no referenceTo targets
            if (field.extraTypeInfo === 'externallookup') {
                genType = 'String';
            }
            else {
                genType = this.getTargetType(field.type);
            }
            decls.push({
                modifier: MODIFIER,
                type: genType,
                name: field.name,
                comment
            });
        }
        else {
            const name = this.getReferenceName(field.relationshipName, field.name);
            decls.push({
                modifier: MODIFIER,
                name,
                type: field.referenceTo.length > 1 ? 'SObject' : `${field.referenceTo}`,
                comment
            });
            // field.type will be "reference", but the actual type is an Id for Apex
            decls.push({
                modifier: MODIFIER,
                name: field.name,
                type: 'Id',
                comment
            });
        }
        return decls;
    }
    generateFauxClasses(sobjects, targetFolder) {
        if (!this.createIfNeededOutputFolder(targetFolder)) {
            throw __1.nls.localize('no_sobject_output_folder_text', targetFolder);
        }
        for (const sobject of sobjects) {
            if (sobject.name) {
                this.generateFauxClass(targetFolder, sobject);
            }
        }
    }
    generateFauxClassDecls(sobject) {
        const declarations = [];
        if (sobject.fields) {
            for (const field of sobject.fields) {
                const decls = this.generateField(field);
                if (decls && decls.length > 0) {
                    for (const decl of decls) {
                        declarations.push(decl);
                    }
                }
            }
        }
        if (sobject.childRelationships) {
            for (const rel of sobject.childRelationships) {
                if (rel.relationshipName) {
                    const decl = this.generateChildRelationship(rel);
                    if (decl) {
                        declarations.push(decl);
                    }
                }
            }
            for (const rel of sobject.childRelationships) {
                // handle the odd childRelationships last (without relationshipName)
                if (!rel.relationshipName) {
                    const decl = this.generateChildRelationship(rel);
                    if (decl) {
                        declarations.push(decl);
                    }
                }
            }
        }
        return declarations;
    }
    generateFauxClassTextFromDecls(className, declarations) {
        // sort, but filter out duplicates
        // which can happen due to childRelationships w/o a relationshipName
        declarations.sort((first, second) => {
            return first.name || first.type > second.name || second.type ? 1 : -1;
        });
        declarations = declarations.filter((value, index, array) => {
            return !index || value.name !== array[index - 1].name;
        });
        const classDeclaration = `${MODIFIER} class ${className} {${os_1.EOL}`;
        const declarationLines = declarations
            .map(FauxClassGenerator.fieldDeclToString)
            .join(`${os_1.EOL}`);
        const classConstructor = `${exports.INDENT}${MODIFIER} ${className} () ${os_1.EOL}    {${os_1.EOL}    }${os_1.EOL}`;
        const generatedClass = `${__1.nls.localize('class_header_generated_comment')}${classDeclaration}${declarationLines}${os_1.EOL}${os_1.EOL}${classConstructor}}`;
        return generatedClass;
    }
    createIfNeededOutputFolder(folderPath) {
        if (!fs.existsSync(folderPath)) {
            shelljs_1.mkdir('-p', folderPath);
            return fs.existsSync(folderPath);
        }
        return true;
    }
    logSObjects(sobjectKind, fetchedLength) {
        if (fetchedLength > 0) {
            this.emitter.emit(salesforcedx_utils_vscode_1.LocalCommandExecution.STDOUT_EVENT, __1.nls.localize('fetched_sobjects_length_text', fetchedLength, sobjectKind));
        }
    }
    logFetchedObjects(standardSObjects, customSObjects) {
        this.logSObjects('Standard', standardSObjects.length);
        this.logSObjects('Custom', customSObjects.length);
    }
}
exports.FauxClassGenerator = FauxClassGenerator;
// the empty string is used to represent the need for a special case
// usually multiple fields with specialized names
FauxClassGenerator.typeMapping = new Map([
    ['string', 'String'],
    ['double', 'Double'],
    ['reference', ''],
    ['boolean', 'Boolean'],
    ['currency', 'Decimal'],
    ['date', 'Date'],
    ['datetime', 'Datetime'],
    ['email', 'String'],
    ['location', 'Location'],
    ['percent', 'Double'],
    ['phone', 'String'],
    ['picklist', 'String'],
    ['multipicklist', 'String'],
    ['textarea', 'String'],
    ['encryptedstring', 'String'],
    ['url', 'String'],
    ['id', 'Id'],
    // note that the mappings below "id" only occur in standard SObjects
    ['base64', 'Blob'],
    ['address', 'Address'],
    ['int', 'Integer'],
    ['anyType', 'Object'],
    ['combobox', 'String'],
    ['time', 'Time'],
    // TBD what are these mapped to and how to create them
    // ['calculated', 'xxx'],
    // ['masterrecord', 'xxx'],
    ['complexvalue', 'Object']
]);
