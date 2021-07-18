import * as gulp from "gulp";
import * as tsc from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import del from "del";
import exec from "child_process";
import logger from "fancy-log";
import * as path from "path";

const TARGET_PATH = "dist";
const SOURCE_PATH = "src";
const GENERATED_PARSER_FILES = SOURCE_PATH + "/parser/generated";

function execWithPromise(cmd: string): Promise<unknown> {
  logger(`Executing "${cmd}"`);
  return new Promise((resolve, reject) => {
    exec.exec(cmd, (error, stdout, stderr) => {
      if (error != null || stderr != "") {
        reject(error != null ? error : stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

function clean(): Promise<unknown> {
  return del([TARGET_PATH, GENERATED_PARSER_FILES]);
}

const ANTLR_CMD = `./node_modules/.bin/antlr4ts -Dlanguage=JavaScript -Xexact-output-dir -o ${GENERATED_PARSER_FILES}`;

function generateParser(): Promise<unknown> {
  return execWithPromise(
    `${ANTLR_CMD} -no-listener -no-visitor ${SOURCE_PATH}/parser/VelocityHtmlLexer.g4`
  );
}

function buildTs(
  source: NodeJS.ReadWriteStream,
  targetFolder: string
): NodeJS.ReadWriteStream {
  const tsProject = tsc.createProject("tsconfig.json");
  const tsResult = source.pipe(sourcemaps.init()).pipe(tsProject());

  // tsResult.dts.pipe(gulp.dest(TARGET_PATH));

  return tsResult.js
    .pipe(sourcemaps.write(".", { sourceRoot: "./", includeContent: false }))
    .pipe(gulp.dest(path.join(TARGET_PATH, targetFolder)));
}

function buildMain(): NodeJS.ReadWriteStream {
  return buildTs(gulp.src("src/**/*.ts"), "src");
}

function buildTest(): NodeJS.ReadWriteStream {
  return buildTs(gulp.src("test/**/*.ts"), "test");
}

function buildTools(): NodeJS.ReadWriteStream {
  return buildTs(gulp.src("tools/**/*.ts"), "tools");
}

function copyTestArtifacts() {
  // TODO !{js}
  return gulp
    .src("test/**/*.{html,vm,groovy,txt}")
    .pipe(gulp.dest(path.join(TARGET_PATH, "test")));
}

const allGenerateParser = gulp.series(clean, generateParser);
const allBuild = gulp.series(
  clean,
  generateParser,
  gulp.parallel(buildMain, copyTestArtifacts, buildTest, buildTools)
);

export { allGenerateParser as generateParser, allBuild as build };
