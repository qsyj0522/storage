const execa = require("execa");

function runBuild() {
  execa("rollup", ["-c", "--environment", [`SOURCE_MAP:false`].join(",")], {
    stdio: "inherit",
  });
}

runBuild();
