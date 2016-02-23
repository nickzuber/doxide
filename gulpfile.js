
var gulp = require('gulp');
var rename = require('gulp-rename'); // custom name for build files

// Set banner for production file
var pkg = require('./package.json');
var banner = ['/*!',
  ' // <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> ',
  ' // Copyright (c) 2016 <%= pkg.author %>',
  ' */',
  ''].join('\n');

// Contacat & compress javascript files
gulp.task('build', function(){
    gulp.src(['src/*.js'])
    .pipe(rename({
        basename: 'oxidize',
        extname: '.js'
    }))
    .pipe(gulp.dest('bin'));
});

// Set default to build
gulp.task('default', ['build']);
