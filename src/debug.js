/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
var util = require('util');


exports.inspect = function inspect() {
  var line = '';
  try {
    throw new Error();
  } catch (e) {
    line = e.stack.split(' at ')[2].trim();
  }
  console.log('\n * dump at: ' + line);
  for (var i = 0; i < arguments.length; i++) {
    console.log('\n' + i + ' ' + util.inspect(arguments[i], true, 10, true) + '\n');
  }
};