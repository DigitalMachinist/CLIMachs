
# init-remove Manual Page

## Name

init remove - Remove tokens from the initiative order.

## Synopsis

init remove \[\<tokens\>\] ... \[--quiet|-q\] 

## Description

Init remove removes tokens from the initiative order using the current selection.

This allows several tokens to be removed from the initiative order simultaneously and easily.

## Options

### \<tokens\>
The names of one or more tokens. If multiple tokens with the same name exist and are matched, all will be removed from the initiative order. If no names are provided, the currently selected tokens will be removed from the initiative order by default (if any).

### --quiet, -q
If this option is enabled, chat message output will be whispered only to the player who caused this command to be run, rather than to all players.

## Output

If this command runs successfully, the names of the tokens removed from the initiative order will be returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init remove** *(with Gandalf selected)*

> Gandalf was removed from the initiative order.

**init remove** *(with Ringwraith 1 and Ringwraith 2 selected)*

> Ringwraith 1 was removed from the initiative order.
>
> Ringwraith 2 was removed from the initiative order.

**init remove "Ringwraith 1" "Ringwraith 2"** *(selection doesn't matter)*

> Ringwraith 1 was removed from the initiative order.
>
> Ringwraith 2 was removed from the initiative order.