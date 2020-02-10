/**
 * Gulpfile.
 *
 * A simple implementation of Gulp.
 *
 * Implements:
 * 			1. Sass to CSS conversion
 * 			2. JS concatenation
 * 			3. Watch files
 */

/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * Edit the variables as per your project requirements.
 */
var styleSRC            = './assets/scss/*.scss'; // Path to main scss files
var styleDestination    = './assets/css/'; // Path to place the compiled CSS file
// Default set to root folder


var jsVendorSRC         = './assets/js/vendors/*.js'; // Path to JS vendors folder
var jsVendorDestination = './assets/js/'; // Path to place the compiled JS vendors file
var jsVendorFile        = 'vendors'; // Compiled JS vendors file name
// Default set to vendors i.e. vendors.js


var jsCustomConcatSRC         = './assets/js/*.js'; // Path to JS custom scripts folder
var jsCustomConcatDestination = './assets/js/'; // Path to place the compiled JS custom scripts file
var jsCustomConcatFile        = 'custom'; // Compiled JS custom file name
// Default set to custom i.e. custom.js

var jsCustomSRC         = ['./assets/js/*.js', '!./assets/js/*.min.js']; // Path to JS custom scripts folder
var jsCustomDestination = './assets/js/'; // Path to place the compiled JS custom scripts files

var styleWatchFiles     = './assets/scss/**/*.scss'; // Path to all *.scss files inside css folder and inside them
var vendorJSWatchFiles  = './assets/js/vendors/*.js'; // Path to all vendors JS files
var customJSWatchFiles  = ['./assets/js/*.js', '!./assets/js/*.min.js']; // Path to all custom JS files


/**
 * Load Plugins.
 *
 * Load gulp plugins and assigning them semantic names.
 */
var gulp         = require('gulp'); // Gulp of-course

// CSS related plugins.
var sass         = require('gulp-sass'); // Gulp pluign for Sass compilation
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files

// JS related plugins.
var concat       = require('gulp-concat'); // Concatenates JS files
var uglify       = require('gulp-uglify'); // Minifies JS files

// Utility related plugins.
var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify       = require('gulp-notify'); // Sends message notification to you
var filter       = require('gulp-filter'); // Filter files


var noPartials = function (file) {
    var path = require('path');
    var dirSeparator = path.sep.replace('\\', '\\\\');
    var relativePath = path.relative(process.cwd(), file.path);
    return !new RegExp('(^|'+dirSeparator+')_').test(relativePath);
};

/**
 * Task: styles
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 * 		1. Gets the source scss file
 * 		2. Compiles Sass to CSS
 * 		3. Writes Sourcemaps for it
 * 		4. Autoprefixes it and generates css
 * 		5. Renames the CSS file with suffix .min.css
 * 		6. Minifies the CSS file and generates .min.css
 */
gulp.task('styles', function () {
    gulp.src( styleSRC )
        .pipe( filter(noPartials) )
        .pipe( sourcemaps.init() )
        .pipe( sass( {
            errLogToConsole: true,
            outputStyle: 'compact',
            // outputStyle: 'compressed',
            // outputStyle: 'nested',
            // outputStyle: 'expanded',
            precision: 10
        } ) )
        .pipe( sourcemaps.write( { includeContent: false } ) )
        .pipe( sourcemaps.init( { loadMaps: true } ) )
        .pipe( autoprefixer(
            'last 2 version',
            '> 1%',
            'safari 5',
            'ie 8',
            'ie 9',
            'opera 12.1',
            'ios 6',
            'android 4' ) )

        .pipe( rename( { suffix: '.min' } ) )

        .pipe( sourcemaps.write ( './' ) )
        // .pipe( gulp.dest( styleDestination ) )

        .pipe( minifycss( {
            maxLineLen: 10
        }))
        .pipe( gulp.dest( styleDestination ) )

        .pipe( notify( { message: 'TASK: "styles" Completed!', onLast: true } ) );
});


/**
 * Task: vendorJS
 *
 * Concatenate and uglify vendor JS scripts.
 *
 * This task does the following:
 * 		1. Gets the source folder for JS vendor files
 * 		2. Concatenates all the files and generates vendors.js
 * 		3. Renames the JS file with suffix .min.js
 * 		4. Uglifes/Minifies the JS file and generates vendors.min.js
 */
gulp.task( 'vendorsJs', function() {
    gulp.src( jsVendorSRC )
        .pipe( concat( jsVendorFile + '.js' ) )
        .pipe( gulp.dest( jsVendorDestination ) )
        .pipe( rename( {
            basename: jsVendorFile,
            suffix: '.min'
        }))
        .pipe( uglify() )
        .pipe( gulp.dest( jsVendorDestination ) )
        .pipe( notify( { message: 'TASK: "vendorsJs" Completed!', onLast: true } ) );
});


/**
 * Task: customJS
 *
 * Concatenate and uglify custom JS scripts.
 *
 * This task does the following:
 * 		1. Gets the source folder for JS custom files
 * 		2. Concatenates all the files and generates custom.js
 * 		3. Renames the JS file with suffix .min.js
 * 		4. Uglifes/Minifies the JS file and generates custom.min.js
 */
gulp.task( 'customJsConcat', function() {
    gulp.src( jsCustomConcatSRC )
        .pipe( concat( jsCustomConcatFile + '.js' ) )
        .pipe( gulp.dest( jsCustomConcatDestination ) )
        .pipe( rename( {
            basename: jsCustomConcatFile,
            suffix: '.min'
        }))
        .pipe( uglify() )
        .pipe( gulp.dest( jsCustomConcatDestination ) )
        .pipe( notify( { message: 'TASK: "customJSConcat" Completed!', onLast: true } ) );
});

/**
 * Task: customJS
 *
 * Uglify custom JS scripts.
 *
 * This task does the following:
 * 		1. Gets the source folder for JS custom files
 * 		2. Renames the JS files with suffix .min.js
 * 		3. Uglifes/Minifies the JS files
 */
gulp.task( 'customJs', function() {
    gulp.src( jsCustomSRC )
        // .pipe( gulp.dest( jsCustomDestination ) )
        .pipe( rename( {
            suffix: '.min'
        }))
        .pipe( uglify() )
        .pipe( gulp.dest( jsCustomDestination ) )
        .pipe( notify( { message: 'TASK: "customJs" Completed!', onLast: true } ) );
});


/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */

// gulp.task( 'default', [ 'styles', 'vendorsJs', 'customJs' ], function () {
//     gulp.watch( styleWatchFiles, [ 'styles' ] );
//     gulp.watch( vendorJSWatchFiles, [ 'vendorsJs' ] );
//     gulp.watch( customJSWatchFiles, [ 'customJS' ] );
// });

gulp.task( 'default', [ 'styles', 'customJs' ], function () {
    gulp.watch( styleWatchFiles, [ 'styles' ] );
    gulp.watch( customJSWatchFiles, [ 'customJs' ] );
});
