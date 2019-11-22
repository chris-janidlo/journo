// place for general functions and js-ink interface

// note: may not be totally accurate; see https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md#external-functions
EXTERNAL get_elapsed_seconds()
// fallback
== function get_elapsed_seconds
~ return 0

VAR TRAVIS_WPM = 180

== interrupted
// can count interruptions here if we want Travis to complain about you later
{!Okay, first of all, interrupting someone while they're typing is very rude. It derails the conversation and betrays an ugly impatience.|What did I say about interruptions?|I really wish you would stop interrupting me.|I'm just going to ignore you interrupting me now.}
->->

