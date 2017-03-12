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
  if (arg === '-') { fail('Reading from stdin is not supported yet.'); }
  if (arg.substr(0, 1) === '-') {
    fail('Unsupported command line option: ' + arg);
  }
  arg = Object.assign({}, state, { sourceFilename: arg });
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
      fs.readFile(job.sourceFilename,
        (job.sourceEncoding || job.encoding || 'UTF-8'),
        whenSourceRead);
    },
    function (text, whenSaved) {
      var traFunc = job.trafoFunc;
      if (traFunc) { text = traFunc(text); }
      fs.writeFile(job.outputFilename, text, {
        encoding: (job.sourceEncoding || job.encoding || 'UTF-8'),
      }, whenSaved);
    },
  ], whenJobDone);
};











module.exports = EX;
if (require.main === module) { EX.easyCli(); }
