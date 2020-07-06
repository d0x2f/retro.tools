
const fs = require("fs");
const posthtml = require("posthtml");
const { hash } = require("posthtml-hash");
const htmlnano = require("htmlnano");

posthtml([
  hash({ path: "build" }),
  htmlnano(),
])
  .process(fs.readFileSync("build/index.html"))
  .then((result) => fs.writeFileSync("build/index.html", result.html));
