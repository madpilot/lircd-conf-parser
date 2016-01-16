import { default as chai } from 'chai';
import { default as sinon } from 'sinon';
import { default as mockery } from 'mockery';

import fs from 'fs';

import { default as LircdConf } from '../lib/index';
const expect = chai.expect;

describe('Parser', () => {
  describe('LircdConf#parse', () => {
    it('should have static function', () => {
      expect(LircdConf.parse).to.not.equal(undefined);
    });

    it('should create a new instance and invoke #parse');
  });

  describe('#convertTabs', () => {
    it('should convert all tabs to spaces', () => {
      let l = new LircdConf('');
      expect(l.convertTabs("\t\t\t\n\t\t")).to.equal("   \n  ");
    });
  });

  describe('#removeComments', () => {
    it('should strip comments on the beginning of a line', () => {
      let l = new LircdConf('');
      let actual = l.removeComments("# This is a comment\nThis isn't\n# So is this");
      let expected = "\nThis isn't\n"
      expect(actual).to.equal(expected);
    });

    it('should strip comments anywhere on the line', () => {
      let l = new LircdConf('');
      let actual = l.removeComments("# This is a comment\nThis isn't # This is\nThis isn't");
      let expected = "\nThis isn't \nThis isn't"
      expect(actual).to.equal(expected);
    });
  });

  describe("#isBeginRemote", () => {
    it("should return true if the line is 'begin remote'", () => {
      let l = new LircdConf('');
      expect(l.isBeginRemote("begin remote")).to.equal(true);
    });

    it("should return false if line is not begin remote", () => {
      let l = new LircdConf('');
      expect(l.isBeginRemote("begin not remote")).to.equal(false);
    });

    it("should not care about case", () => {
      let l = new LircdConf('');
      expect(l.isBeginRemote("BEGIN reMoTE")).to.equal(true);
    });


    it('should not care about white space on the line', () => {
      let l = new LircdConf('');
      expect(l.isBeginRemote("begin    \tremote")).to.equal(true);
    });
  });

  describe("#isEndRemote", () => {
    it("should return true if the line is 'end remote'", () => {
      let l = new LircdConf('');
      expect(l.isEndRemote("end remote")).to.equal(true);
    });

    it("should return false if line is not end remote", () => {
      let l = new LircdConf('');
      expect(l.isEndRemote("end not remote")).to.equal(false);
    });

    it("should not care about case", () => {
      let l = new LircdConf('');
      expect(l.isEndRemote("END reMoTE")).to.equal(true);
    });

    it('should not care about white space on the line', () => {
      let l = new LircdConf('');
      expect(l.isEndRemote("end    \tremote")).to.equal(true);
    });
  });



  describe('#parse', () => {
    it('should parse an empty config', () => {
      let config = fs.readFileSync(__dirname + '/fixtures/empty.conf', 'utf8');
      let l = new LircdConf(config);
      let parsed = l.parse();
      expect(parsed.remotes.length).to.equal(0);
    });

    it('should create one remote entry per remote in the conf', () => {
      let config = fs.readFileSync(__dirname + '/fixtures/multi-remote.conf', 'utf8');
      let l = new LircdConf(config);
      let parsed = l.parse();
      expect(parsed.remotes.length).to.equal(3);
    });

    it('should raise an error is one remote entry does not end', () => {
      let config = fs.readFileSync(__dirname + '/fixtures/incomplete-multi-remote.conf', 'utf8');
      let l = new LircdConf(config);
      expect(() => {
        let parsed = l.parse();
      }).to.throw(Error);
    });
  });
});
