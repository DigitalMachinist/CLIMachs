
# init-clear Manual Page

## Name

init clear - Clear the initiative order of all tokens.

## Synopsis

init clear \[--quiet|-q\] 

## Description

Init clear removes all tokens from the initiative order and clears Init's own internal round/turn counters so the state of the initiative system is completely refreshed.

## Options

### --quiet, -q
If this option is enabled, chat message output will be whispered only to the player who caused this command to be run, rather than to all players.

## Output

If this command runs successfully, a confirmation that the initiative order has been cleared will be returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init clear** *(selection doesn't matter)*

> Initiative order cleared!