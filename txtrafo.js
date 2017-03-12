/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, async = require('async'), fs = require('fs'),
  iter = require('array-iter-next-crnt');

function identity(x) { return x; }
function fail(why) { throw new Error(why); }


EX = function (job, then) {
  job = Object.assign({}, job);
  EX.prepareJobInplace(job);
  return EX.processJob(job, then);
};


EX.easyCli = function (opt, then) {
  opt = (opt || false);
  var args = opt.cliArgs || process.argv.slice(2), jobs = [],
    state = Object.assign({}, opt);
  if (args) { iter(args).each(EX.parseArg, [state, jobs]); }
  async.each(jobs, EX.processJob, then);
};


EX.parseArg = function (arg, state, jobs) {
  if ((arg.length > 1) && (arg.substr(0, 1) === '-')) {
    if (arg === '-o') {
      state.outputFilenameNext = this.next().crnt;
      return;
    }
    fail('Unsupported CLI option: ' + arg);
  }
  arg = Object.assign({}, state, { sourceFilename: arg });
  if ((!arg.outputFilename) && state.outputFilenameNext) {
    arg.outputFilename = state.outputFilenameNext;
    state.outputFilenameNext = null;
  }
  EX.prepareJobInplace(arg);
  jobs.push(arg);
};


EX.prepareJobInplace = function (job) {
  if (!job.outputFilename) {
    job.outputFilename = job.guessOutputFilename(job.sourceFilename);
  }
};


EX.processJob = function (job, whenJobDone) {
  async.waterfall([
    function (whenSourceRead) {
      var srcSpec = job.sourceFilename;
      if (srcSpec === '-') { srcSpec = process.stdin.fd; }
      fs.readFile(srcSpec,
        (job.sourceEncoding || job.encoding || 'UTF-8'),
        whenSourceRead);
    },
    function (text, whenSaved) {
      var traFunc = job.trafoFunc, ofn = job.outputFilename,
        enc = (job.sourceEncoding || job.encoding || 'UTF-8');
      if (traFunc) { text = traFunc(text); }
      if (ofn === '-') {
        if (process.stdout.write(ofn, enc)) { return whenSaved(); }
        return whenSaved(new Error('Failed to write to stdout'
          + '; source: ' + job.sourceFilename));
      }
      fs.writeFile(ofn, text, { encoding: enc }, whenSaved);
    },
  ], whenJobDone);
};











module.exports = EX;
if (require.main === module) { EX.easyCli(); }
