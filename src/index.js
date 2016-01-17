const constants = {
  STATE_START: 0,
  STATE_REMOTE: 1,
  STATE_CODES: 2
}

export default class LircdConf {
  constructor(config) {
    this.config = config;
    this.state = constants.STATE_START;
  }

  static parse() {
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
      if(this.isBeginRemote(line)) {
        let currentRemote = {};
        this.state = constants.STATE_REMOTE;
      } else if(this.state == constants.STATE_REMOTE) {
        if(this.isEndRemote(line)) {
          result.remotes.push(currentRemote);
          this.state = constants.STATE_START;
        } else {
          let attribute = this.parseAttribute(line);
          if(attribute !== null) {
            currentRemote[attribute.key] = attribute.value;
          }
        }
      }
    });

    if(this.state !== constants.STATE_START) {
      throw(new Error("Missing end remote"));
    }

    return result;
  }
}
