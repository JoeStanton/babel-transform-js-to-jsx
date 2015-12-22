#!/usr/bin/env node

require("babel-register")({ only: /babel-js-to-jsx/ });
var path = require("path");
var root = path.resolve(__dirname, "..");

var components = [];
if (process.argv[2]) {
  var fs = require("fs");
  components = fs.readFileSync(process.argv[2], 'utf8').split("\n");
}

var buf = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", function(chunk) { buf += chunk; });
process.stdin.on("end", function() {
  process.stdout.write(
    require("babel-core").transform(buf, {
      plugins: [[root, { components: components }], root + "/es6/arrow-functions", root + "/es6/modules"],
    }).code
  );
});
