const execa = require("execa");

function runBuild() {
  execa("rollup", ["-cw", "--environment",  [`SOURCE_MAP:true`].join(',')], {
    stdio: "inherit",
  });
}

runBuild();
