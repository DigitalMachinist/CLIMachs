
# init-act Manual Page

## Name

init act - End the wait actions of tokens.

## Synopsis

init act \[\<tokens\>\] ... \[--no-move|-n\] \[--quiet|-q\] 

## Description

Init act ends the wait actions of the supplied tokens and inserts them back into the initiative order before the current turn.

## Options

### \<tokens\>
The names of one or more tokens. If multiple tokens with the same name exist and are matched, all will have their wait actions ended. If no label is provided, the currently selected tokens will be added to the initiative order by default (if any).

### --no-move, -n
If this option is supplied, the tokens will have their wait action ended, but will not be moved in the initiative order. This is useful if a token is placed into a wait action accidentally and it isn't discovered until another player's turn.

### --quiet, -q
If this option is enabled, chat message output will be whispered only to the player who caused this command to be run, rather than to all players.

## Output

If this command runs successfully, the labels of tokens moved in the initiative order and the label of the token they were moved to will be returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init act** *(with Gandalf selected)*

> Gandalf took action before Ringwraith 1.

**init act** *(with Ringwraith 1 and Ringwraith 2 selected)*

> Ringwraith 1 took action before Gandalf (initiative order 18).
>
> Ringwraith 2 took action before Gandalf (initiative order 18).

**init act --no-move "Ringwraith 1" "Ringwraith 2"** *(selection doesn't matter)*

> Ringwraith 1 is no longer waiting (not moved in initiative order).
>
> Ringwraith 2 is no longer waiting (not moved in initiative order).
