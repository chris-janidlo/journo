== intro
You have one unread message. Type __open__ to view it. # system
* [open]
    -> message

= message
_Dear Newspaper: I am a senior Facebook engineer. Facebook is about to make a terrible choice for user security, and I won't stand for it. I am prepared to go on background to bring the story to the public. If you want to know the details, respond to me here and I'll be happy to chat. Cheers - Angry Facebook Engineer_ # timescale 0 # suppressTypingIndicator # hideUsername
Type __reply__ to start a secure chat session with this user. Type __inbox__ to return to your inbox. # system
* [reply]
    -> connecting
+ [inbox]
    You have no unread messages. You have one message in your inbox. To view your most recent message, type __open__. # system
++ [open]
    -> message

= connecting
Initializing connection with "FbkE7"... # system
Done. You are now connected to chat. # system # timescale .5
~ connected_user = "FbkE7"
Hello, who is this? # delay 5
    -> new_phone_who_dis

= new_phone_who_dis
* this is Newspaper
    Oh, fantastic, I wasn't expecting this thing to actually work.
* who are you?
    Sorry, don't recognize the number, won't share my name.
    -> new_phone_who_dis

-You caught me at an awkward time though - I absolutely have to leave for a series of meetings starting in {total_time_to_string()}. # interruptible
* then why did you use it?
    -> interrupted ->
    I only have {total_time_to_string()} since I'm about to leave for a series of high-priority meetings.
* [.wait]

-After that I'm going on a tech-detox vacation in Thailand for a week. # startTimer # interruptible
* \ {total_time_to_string()} is not enough time to verify you as a source
    -> interrupted -> busy
* [.wait]
    I hope that isn't an issue. # interruptible
** \ {total_time_to_string()} is not enough time to verify you as a source
    -> busy

= busy
You should have reached out earlier. I'm a busy man.
Well, get to it - I obviously don't have all day. # delay 3
<- what
<- hub
-> DONE

= what
* get to what?
    Interviewing me, of course. That's your job, right?
-> hub

-
->END
