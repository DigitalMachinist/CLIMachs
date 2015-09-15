
# init-prev Manual Page

## Name

init prev - Reverse back to the previous token's turn.

## Synopsis

init prev \[--quiet|-q\] 

## Description

Init prev reverses the initiative order back to the most recent turn and notifies players.

## Options

### --quiet, -q
If this option is enabled, chat message output will be whispered only to the player who caused this command to be run, rather than to all players.

## Output

If this command runs successfully, the name of the token whose turn is beginning is returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init prev** *(selection doesn't matter)*

> Reversing to previous turn...
>
> It is now Ringwraith 2's turn.