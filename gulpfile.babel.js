import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import ts from 'gulp-typescript';
import tslint from 'gulp-tslint';
import typescript from 'typescript';
import plumber from 'gulp-plumber';
import log from 'fancy-log';
import { argv } from 'yargs';

const env = {
  NODE_ENV: argv.env ? argv.env : 'development',
  PORT: 8080 // port for express app
};

const tsProject = ts.createProject('tsconfig.json', {
  typescript: typescript,
  rootDir: __dirname
});

const tslintReportOption = { emitError: false };
gulp.task(
  'server-compile',
  () =>
    gulp
      .src('src/**/*.ts') // src ES6
      .pipe(
        plumber({
          errorHandler: err => log.error(`Error typescript parser : ${err}`)
        })
      )
      .pipe(
        tslint({
          configuration: './tslint.json',
          formattersDirectory:
            './node_modules/custom-tslint-formatters/formatters',
          formatter: 'grouped'
        })
      )
      .pipe(tslint.report(tslintReportOption))
      .pipe(tsProject(ts.reporter.longReporter()))
      .pipe(babel()) // transpile with babel
      .pipe(gulp.dest('dest')) // write files to output
);

/**
 * Start express with nodemon and watch
 */
gulp.task('nodemon', () =>
  nodemon({
    script: 'dest/server.js', // run transpiled ES5 code
    env: env,
    ext: 'ts',
    execMap: {
      js: 'node'
    },
    watch: ['src/**/*.ts'], // watch ES6 code
    tasks: ['server-compile']
  })
);

// Development task
// Just run gulp in order to run the project
gulp.task('default', gulp.series('server-compile', 'nodemon', done => done()));

// Production task
gulp.task('build', gulp.series('server-compile', done => done()));
