// place for general functions and js-ink interface

// note: may not be totally accurate; see https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md#external-functions
EXTERNAL get_elapsed_seconds()
// fallback
== function get_elapsed_seconds
~ return 0

VAR TRAVIS_WPM = 180
