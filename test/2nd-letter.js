/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

require('txtrafo')({
  sourceFilename: module.filename,
  trafoFunc: function (text) { return text.replace(/\w(\w)\w*/g, '$1'); },
  guessOutputFilename: function (fn) { return fn.slice(0, -3) + '.txt'; },
});
