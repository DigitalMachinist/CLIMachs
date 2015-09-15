
# init-wait Manual Page

## Name

init wait - Begin wait actions for tokens.

## Synopsis

init wait \[\<tokens\>\] ... \[--quiet|-q\] 

## Description

Init wait begins wait actions for the supplied tokens. Their turns will begin when either a) the player takes a delayed action or b) their next turn begins.

The opposite of this command is [init-act](init-act.md).

## Options

### \<tokens\>
The names of one or more tokens. If multiple tokens with the same name exist and are matched, all will begin wait actions. If no names are provided, the currently selected tokens will be begin wait actions by default (if any).

### --quiet, -q
If this option is enabled, chat message output will be whispered only to the player who caused this command to be run, rather than to all players.

## Output

If this command runs successfully, the names of tokens beginning wait actions will be returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init wait** *(with Gandalf selected)*

> Gandalf began a wait action.

**init wait** *(with Ringwraith 1 and Ringwraith 2 selected)*

> Ringwraith 1 began a wait action.
>
> Ringwraith 2 began a wait action.

**init wait "Ringwraith 1" "Ringwraith 2"** *(selection doesn't matter)*

> Ringwraith 1 began a wait action.
>
> Ringwraith 2 began a wait action.
