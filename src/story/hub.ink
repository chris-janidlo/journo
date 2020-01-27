== hub
<- about_travis
<- ask_how_much_time_is_left
<- majority_report

== ask_how_much_time_is_left
+ {TURNS_SINCE(-> answer) != 0} how long until your meetings?
    -> answer
= answer
{capitalize(remaining_time_to_string())}.
-> hub
