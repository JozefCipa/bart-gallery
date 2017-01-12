var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var cleanCSS = require('gulp-clean-css');

var vendors = ['react', 'jquery'];

//SASS
gulp.task('build:sass', function () {
	return gulp.src('./sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS())
		.pipe(notify({
			message: "SASS compiled."
		}))
		.pipe(gulp.dest('./public/dist/css/'));
});

gulp.task('watch:sass', function () {
	gulp.watch('./sass/*.scss', ['build:sass']);
});

//React, ES6, JSX
gulp.task('build:react', function () {
	browserify({
		entries: ['./react/app.jsx'],
		extensions: ['.js', '.jsx'],
		debug: true
	})
		.external(vendors) // Specify all vendors as external source
		.transform('babelify', {presets: ['es2015', 'react']})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(notify({
			message: "React compiled."
		}))
		.pipe(gulp.dest('./public/dist/js/'));
});

gulp.task('watch:react', function () {
	gulp.watch(['./react/**/*.jsx', './react/**/*.js'], ['build:react']);
});

gulp.task('build:vendor', function () {
	const b = browserify({
		debug: true
	});

	// require all libs specified in vendors array
	vendors.forEach(function (lib) {
		b.require(lib);
	});

	b.bundle()
		.pipe(source('vendor.js'))
		.pipe(notify({
			message: "Vendors compiled."
		}))
		.pipe(gulp.dest('./public/dist/js/'));
});