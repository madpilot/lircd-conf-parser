const constants = {
  STATE_START: 1,
  STATE_REMOTE: 2,
  STATE_CODES: 3
}

export default class LircdConf {
  constructor(config) {
    this.config = config;
    this.state = constants.STATE_START;
  }

  static parse(config) {
    return new LircdConf(config).parse();
  }

  convertTabs(string) {
    return string.replace(/\t/g, ' ');
  }

  removeComments(string) {
    return string.replace(/#.+/g, '');
  }

  isBeginRemote(line) {
    return line.match(/begin \s*remote/i) !== null;
  }

  isEndRemote(line) {
    return line.match(/end \s*remote/i) !== null;
  }

  isBeginCodes(line) {
    return line.match(/begin \s*codes/i) !== null;
  }

  isEndCodes(line) {
    return line.match(/end \s*codes/i) !== null;
  }

  trim(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }

  removeExtraWhitespace(string) {
    return string.replace(/\s+/g, ' ');
  }

  parseAttribute(line) {
    let re = line.match(/^\s*(\S+)\s*(.*)$/);

    if(re) {
      return { key: this.trim(re[1]), value: this.removeExtraWhitespace(this.trim(re[2])) };
    }
    return null;
  }

  parse() {
    let config = this.convertTabs(this.config);
    config = this.removeComments(config);

    let result = {
      remotes: []
    };

    let currentRemote = {};
    config.split("\n").forEach((line) => {
      switch(this.state) {
      case constants.STATE_REMOTE:
        if(this.isEndRemote(line)) {
          result.remotes.push(currentRemote);
          this.state = constants.STATE_START;
        } else if(this.isBeginCodes(line)) {
          currentRemote.codes = {};
          this.state = constants.STATE_CODES;
        } else {
          let attribute = this.parseAttribute(line);
          if(attribute !== null) {
            currentRemote[attribute.key] = attribute.value;
          }
        }
        break;
      case constants.STATE_CODES:
        if(this.isEndCodes(line)) {
          this.state = constants.STATE_REMOTE;
        } else {
          let code = this.parseAttribute(line);
          if(code !== null) {
            currentRemote.codes[code.key] = code.value;
          }
        }
        break;
      default:
        if(this.isBeginRemote(line)) {
          let currentRemote = {};
          this.state = constants.STATE_REMOTE;
        }
        break;
      }
    });

    if(this.state === constants.STATE_CODES) {
      throw(new Error("Missing end codes"));
    }
    
    if(this.state !== constants.STATE_START) {
      throw(new Error("Missing end remote"));
    }

    return result;
  }
}
