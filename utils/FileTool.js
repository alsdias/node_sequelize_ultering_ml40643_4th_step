//@SYNC: y;filetool<memo<tools.js;.
'use strict';
const fs = require('fs');
const Tools = require('./Tools');

/**
 * File utilities.
 *
 * @class FileTool
 */
class FileTool {

  /**
   *
   * Read a JSON file returning a JSON answer object.
   * @static
   * @param {*} filepath
   * @returns JSON answer object: {error:'', text: ''}. If successfull returns empty error, otherwise the error message.
   * @memberof FileTool
   */
  static readJson(filepath) {
    let warn = '';
    if (Tools.isNullEmpty(filepath)) {
      warn = '[WARN]: invalid null/empty output filepath. Operation skipped';
    }
    return JSON.parse('{"error": "' + warn + '", "text": ' + fs.readFileSync(filepath) + '}');
  }

  /**
   * Write a JSON to file.
   *
   * @static
   * @param {*} filepath
   * @param {*} jsonText
   * @returns empty if successful, otherwise error message.
   * @memberof FileTool
   */
  static writeJson(filepath, jsonText) {
    if (Tools.isNullEmpty(jsonText)) {
      return '[WARN]: empty text, nothing to write. Operation skipped';
    }
    if (Tools.isNullEmpty(filepath)) {
      return '[WARN]: invalid null/empty output filepath. Operation skipped';
    }
    fs.writeFileSync(filepath, JSON.stringify(jsonText));
    return '';
  }

}

module.exports = FileTool;
