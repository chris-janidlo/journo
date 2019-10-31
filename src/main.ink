# author: Chris Janidlo (crass_sandwich)
# title: Journo (working title)

->intro

// interface between js and ink
VAR elapsed_time_seconds = 0.0 // read-only in ink, js should update this

=== function wait_for_typing(seconds) ===
    .wait{seconds}



== intro
Hello, is this Newspaper? ->is_this_on

= is_this_on
* yes
    ->scoop
* sorry, no
    My apologies, I must have set up the chat incorrectly. I'll let you continue with your day.
    TODO: have him try to reconnect again?
    ->END
* who are you?
    We'll get to that later - answer my question first.
    ->is_this_on

= scoop
I'm a /*TODO:*/ very important person, and I just got wind of a major scoop. I only have 5 minutes, however.
* \ {wait_for_typing(10)}
    It's not safe for me to take any longer than that.
* 5 minutes is not enough time to verify you as a source
    Too bad, that's all you get. You can verify my information later, but when the 5 minutes are up, no more questions for me.
