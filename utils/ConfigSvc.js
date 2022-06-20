'use strict';
const FileTool = require('./FileTool');

class ConfigSvc {

  /**
   * How to test (use the snippet into app.js):
   * const ConfigSvc = require('./utils/ConfigSvc');
   * console.log('*** ' + ConfigSvc.hasDbCreation());
   */
  static hasDbCreation() {
    var jsonAnwer = FileTool.readJson('./config/createdb.json' );
    if (jsonAnwer.error) {
      console.log(jsonAnwer.error);
      return false;
    } else {
      return (jsonAnwer.text.create_db === 'true') ? true : false;
    }
  }

}

module.exports =  ConfigSvc;