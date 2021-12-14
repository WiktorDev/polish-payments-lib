const moment = require("moment");
exports.log = (content, type = "log") => {
  const timestamp = `[${moment().format("DD-MM-YY H:m:s")}]:`;
  switch (type) {
    case "info": {
        console.log(`${timestamp} [\x1b[36m${type.toUpperCase()}\x1b[0m] ${content} `);
        return;
    }
    case "ready": {
        console.log(`${timestamp} [\x1b[32m${type.toUpperCase()}\x1b[0m] ${content} `);
        return;
    }
    case 'error': {
        console.error(`${timestamp} [\x1b[31m${type.toUpperCase()}\x1b[0m] ${content} `);
        return;
    }
    case 'warn': {
        console.log(`${timestamp} [\x1b[33m${type.toUpperCase()}\x1b[0m] ${content} `);
        return;
    }
    
    default: {
        console.log(content)
        return;
    }
  }
};

exports.info = (...args) => this.log(...args, 'info');
exports.error = (...args) => this.log(...args, 'error');
exports.ready = (...args) => this.log(...args, 'ready');
exports.warn = (...args) => this.log(...args, 'warn');
exports.clear = (...args) => this.log(...args)