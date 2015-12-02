var gulp = require('gulp');
var ftp = require('vinyl-ftp');
var gutil = require('gulp-util');
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));

gulp.task('deploy', function() {
	var conn = ftp.create({
		host: 'avalcohol.com',
		user: args.user,
		password: args.password,
		parallel: 7,
		log: gutil.log
	});

	var globs = [
		'api/**',
		'app/**',
		'bootstrap/**',
		'css/**',
		'database/**',
		'fonts/**',
		'img/**',
		'js/**',
		'resources/**',
		'storage/**',
		'vendor/**',
		'index.html',
		'.htaccess'
	];

	/**
	 * This will clean the out the remote server!
	 * skips vendor and index.html and .htaccess
	 */
	var index;
	for (index = 0; index < globs.length - 3; index++) {
		var glob = globs[index];
		glob = glob.slice(0, -3); // remove /**

		var i = 3;
		conn.rmdir('/public_html/dev/' + glob, function () {
			i++;
			if (i == globs.length) {
				// by now, all the directories we want to remove have been removed. time to upload!
				// done this way because of concurrency issues

				// upload EVERYTHING newer
				globs = [
					'*/**',
					'!node_modules/**',
					'!.env',
					'!vendor/symfony/finder/Tests/' // causing problems..
				]

				// ok so travis installs all the vendor files, so they will be newer than the ones on the server
				// and therefore uploaded. It's a waste, but I don't feel like figuring out a work around
				// right now
				return gulp.src( globs, { base: '.', buffer: false, dot: true } )
					.pipe( conn.newer( '/public_html/dev' ) ) // only upload newer files
					.pipe( conn.dest( '/public_html/dev' ) );
			}
		});
	}


});