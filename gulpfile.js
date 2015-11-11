var gulp = require('gulp');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var es = require('event-stream');
var angularFilesort = require('gulp-angular-filesort');
var jade = require('gulp-jade');
var rename = require("gulp-rename");

gulp.task('index', function () {
  var target = gulp.src('index.html.jade')
  .pipe( jade({ pretty: true }) )
  .pipe( rename('index.html') );

  var sources = {
    css: gulp.src([ 'app/*.css', 'app/css/*' ], { read: false }),
    js: gulp.src([ 'app/*.js', 'app/js/*' ])
      .pipe( angularFilesort() ),
    bower: gulp.src(bowerFiles(), { read: false }),
  };

  return target
  .pipe( inject(sources.bower, { name: 'bower' }) )
  .pipe( inject( es.merge(sources.css, sources.js) ) )
  .pipe( gulp.dest('.') )
});
