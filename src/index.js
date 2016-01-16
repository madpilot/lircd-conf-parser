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

  parse() {
    let config = this.convertTabs(this.config);
    config = this.removeComments(config);

    let result = {
      remotes: []
    };
    config.split("\n").forEach((line) => {
      if(this.isBeginRemote(line)) {
        this.state == constants.REMOTE;
      } else if(this.state == constants.REMOTE && this.isEndRemote(line)) {
        result.remotes.push({});
        this.state == constants.START;
      }
    });

    if(this.state !== constants.START) {
      throw("Error");
    }

    return result;
  }
}
