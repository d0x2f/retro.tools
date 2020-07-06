import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import copy from "rollup-plugin-copy";
import json from '@rollup/plugin-json';

const IS_PROD = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    sourcemap: !IS_PROD,
    format: "iife",
    name: "app",
    file: "build/bundle.[hash].js",
  },
  plugins: [
    copy({ targets: [{ src: "public/*", dest: "build" }] }),

    svelte({
      dev: !IS_PROD,
      css: (css) => {
        css.write("build/bundle.[hash].css", !IS_PROD);
      },
    }),

    resolve(),

    commonjs(),
    json(),

    !IS_PROD &&
      serve({
        contentBase: ["build"],
        port: 3000,
      }),

    !IS_PROD && livereload({ watch: "build" }),

    IS_PROD && terser(),
  ],
};
