var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minfyCss = require('gulp-minify-css');

gulp.task('default', function() {
	return gulp.src('src/js/*.js')
	    .pipe(uglify())
	    .pipe(gulp.dest('dist/js'));
});

gulp.task('css',function(){
	return gulp.src('src/css/*.css')
		.pipe(minfyCss())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('watch',function(){
	gulp.watch(['src/js/*.js', 'src/css/*.css' ], ['default','css']);
});
