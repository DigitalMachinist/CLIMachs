
# init-act Manual Page

## Name

init act - End the wait actions of the currently selected tokens.

## Synopsis

init act \[--no-move|-n\] \[\<tokens\>\] ...

## Description

Init act ends the wait actions of the supplied tokens and inserts them back into the initiative order before the current turn.

## Options

### --no-move, -n
If this option is supplied, the tokens will have their wait action ended, but will not be moved in the initiative order. This is useful if a token is placed into a wait action accidentally and it isn't discovered until another player's turn.

### \<tokens\>
The labels of one or more tokens. If two tokens with the same name exist and are matched, both will have their wait actions ended. If no label is provided, the currently selected tokens will be added to the initiative order by default (if any).

## Output

If this command runs successfully, the labels of tokens moved in the initiative order and the label of the token they were moved to will be returned as chat output whispered to the user who invoked the command.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init act** *(with Gandalf selected)*

> Gandalf took action before Ringwraith 1.

**init act** *(with Ringwraith 1 and Ringwraith 2 selected)*

> Ringwraith 1 took action before Gandalf.
>
> Ringwraith 2 took action before Gandalf.

**init act --no-move "Ringwraith 1" "Ringwraith 2"** *(selection doesn't matter)*

> Ringwraith 1 is no longer waiting (not moved in initiative order).
>
> Ringwraith 2 is no longer waiting (not moved in initiative order).
