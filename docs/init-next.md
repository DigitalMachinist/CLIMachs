
# init-next Manual Page

## Name

init next - Advance to the next token's turn.

## Synopsis

init next \[--quiet|-q\] 

## Description

Init next advances the initiiative order to the next token's turn and notifies players.

## Options

### --quiet, -q
If this option is enabled, chat message output will be whispered only to the player who caused this command to be run, rather than to all players.

## Output

If this command runs successfully, the name of the token whose turn is beginning is returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init next** *(selection doesn't matter)*

> Advancing to next turn...
>
> It is now Gandalf's turn.