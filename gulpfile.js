// grab our gulp packages
var gulp = require("gulp");
var jshint = require("gulp-jshint");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var nunjucksRender = require('gulp-nunjucks-render');
var babel = require('gulp-babel');

// var defaults = {
//     // path: '.',
//     path: 'src/html/page/templates',
//     ext: '.html',
//     data: {},
//     inheritExtension: false,
//     envOptions: {
//         watch: false
//     },
//     manageEnv: null,
//     loaders: null
// };

// building the html task
gulp.task('nunjucks', function() {
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/html/pages/**/*.+(html|nunjucks)')
    // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['src/html/page/templates']
        }))
        // output files in app folder
        .pipe(gulp.dest('website'))
});

// configure the jshint task
gulp.task("jshint", function() {
  return gulp
    .src(["src/js/*.js"])
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
      .pipe(gulp.dest("website/js"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// configure sass task
gulp.task("sass", function() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("website/css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// start web server
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "website"
    }
  });
});

// watch changes to HTML, CSS and JS,
gulp.task(
  "watch",
  gulp.parallel("browserSync", function() {
    gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
    gulp.watch("src/js/*.js", gulp.series("jshint"));

    gulp.watch("website/*.html", browserSync.reload);
  })
);

// define the default task and add the watch task to it
gulp.task("default", gulp.parallel("watch"));
