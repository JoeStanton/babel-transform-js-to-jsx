require("babel/register");

var esformatter = require('esformatter');
esformatter.register(require('esformatter-jsx'));

var buf = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", function(chunk) { buf += chunk; });
process.stdin.on("end", function() {
  process.stdout.write(
    require("babel").transform(buf, {
      plugins: [require(".")],
      blacklist: ["react"],
    }).code
  );
});
