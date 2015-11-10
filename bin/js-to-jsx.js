#!/usr/bin/env node

require("babel-core/register");

var buf = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", function(chunk) { buf += chunk; });
process.stdin.on("end", function() {
  process.stdout.write(
    require("babel-core").transform(buf, {
      plugins: [".", "./es6/arrow-functions", "./es6/modules"],
    }).code
  );
});
