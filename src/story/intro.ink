== intro
You have one unread message. Type `open` to view it. # system
* [open]
    -> message

= message
To whom it may concern, # timescale 0 # suppressTypingIndicator
I am a senior level Facebook engineer. Facebook is ready to pull the trigger on a terrible choice for user security, and I won't stand for it. I am prepared to go on background to bring the story to the public. Please reach out to me through Journo where I'll be happy to talk about the details.  # timescale 0 # suppressTypingIndicator
Cheers - Anonymous and Angry Facebook Engineer # timescale 0 # suppressTypingIndicator
Type `reply` to start a secure chat session with this user. Type `inbox` to return to your inbox. # system
* [reply]
    -> connecting
+ [inbox]
    You have no unread messages and one message in your inbox. To view your most recent message, type `open`. # system
++ [open]
    -> message

= connecting
Initializing connection with "FbkE7"... # system
Done. You are now connected to chat. # system # timescale .5
~ connectedUser = "FbkE7"
Hello, who is this? -> new_phone_who_dis

= new_phone_who_dis
* this is Newspaper
    Oh, fantastic, I wasn't expecting this thing to actually work.
* who are you?
    Sorry, don't recognize the number, won't share my name.
    -> new_phone_who_dis

-You caught me at an awkward time though - I absolutely have to leave for a series of meetings starting in 5 minutes. # interruptible
* then why did you use it?
    -> interrupted ->
    I only have 5 minutes since I'm about to leave for a series of high-priority meetings.
* [.wait]

-After that I'm going on a tech-detox vacation in Thailand for a week. # interruptible
* 5 minutes is not enough time to verify you as a source
    -> interrupted -> busy
* [.wait]
    I hope that isn't an issue. # interruptible
** 5 minutes is not enough time to verify you as a source
    -> busy

= busy
You should have reached out earlier. I'm a busy man.

-
->END
