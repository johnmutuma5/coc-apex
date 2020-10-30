"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const pathExists = require("path-exists");
const shelljs_1 = require("shelljs");
class TestRunner {
    getTempFolder(vscodePath, testType) {
        const dirPath = path.join(vscodePath, '.sfdx', 'tools', 'testresults', testType);
        if (!pathExists.sync(dirPath)) {
            shelljs_1.mkdir('-p', dirPath);
        }
        return dirPath;
    }
}
exports.TestRunner = TestRunner;
