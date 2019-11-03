# author: Chris Janidlo (crass_sandwich)
# title: Journo (working title)

->intro

// interface between js and ink
VAR elapsed_time_seconds = 0.0 // read-only in ink, js should update this

=== function wait_for_typing(seconds) ===
    .wait{seconds}



== intro
You have one new message. Click here to view it.
* here
    To whom it may concern,
    I am a senior level Facebook engineer. Facebook is ready to pull the trigger on a terrible choice for user security, and I won't stand for it. I am prepared to go on background to bring the story to the public. Please reach out to me through Journo where I'll be happy to talk about the details.
    Cheers - Anonymous and Angry Facebook Engineer
    ...
    Click here to respond to this message.
-
* here
    Hello, who is this?->new_phone_who_dis

= new_phone_who_dis
* this is Newspaper->scoop
* who are you?
    I never share my name with an unrecognized number, so you're going to have to answer me first.
    ->new_phone_who_dis

= scoop
Fantastic, I wasn't expecting this application to actually work.
You caught me at an awkward time though - I absolutely have to leave for a series of meetings starting in 5 minutes.
* \ {wait_for_typing(10)}
    After that I'm going on a tech-detox vacation in Thailand for a week.
* 5 minutes is not enough time to verify you as a source
    You should have reached out earlier. I'm a busy man.

-
->END
