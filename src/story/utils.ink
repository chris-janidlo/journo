// place for general functions and js-ink interface

EXTERNAL get_elapsed_seconds ()
== function get_elapsed_seconds
~ return 0

EXTERNAL capitalize (string)
== function capitalize (string)
~ return "capital " + string

EXTERNAL time_duration_to_string (seconds)
== function time_duration_to_string (seconds)
~ return seconds

EXTERNAL remaining_time_to_string ()
== function remaining_time_to_string ()
~ return time_duration_to_string(MAX_INTERVIEW_TIME - get_elapsed_seconds())

EXTERNAL total_time_to_string ()
== function total_time_to_string ()
~ return time_duration_to_string(MAX_INTERVIEW_TIME)

== function alter (ref x, k)
~ x = x + k

// in seconds
VAR MAX_INTERVIEW_TIME = 900

// words per minute. word = 5 characters
VAR TRAVIS_WPM = 250
// thoughts per minute. the amount of 5 character words travis can fully process in one minute. can represent either composing or reading
VAR TRAVIS_TPM = 100
// how much to scale follow-up messages in thinking time. follow ups are defined as messages travis sends after responding (after the user sends a message, Travis sends one response followed by any number of follow-up messages)
VAR FOLLOW_UP_TPM_SCALE = 0.15

VAR dev_env = false

// in livedrop terms, this is the person you're currently chatting with. can be used to de-anonymyze travis after a while
VAR connected_user = ""

VAR total_respect = 10

VAR just_interrupted = false

VAR interruptions = 0
== interrupted
{not just_interrupted: ->->}
~ alter(interruptions, 1)
// can count interruptions here if we want Travis to complain about you later
{ interruptions:
    - 1: Ok, first of all, interrupting someone while they're typing is very rude. It derails the conversation and honestly just makes you look impatient.
    - 2: What did I say about interruptions?
    - 3: I really wish you would stop interrupting me.
    - 4: Alright, I'm going to be nice. You get three more interruptions and then I'm out.
    - 5: Two more interruptions. Use them wisely.
    - 6: One more interruption before I stop answering any questions.
    - 7: Last interruption.
    - 8: Alright, that's it. I can't handle the constant interruptions. Good luck writing your article, you'll need it. -> final_article
}
->->
