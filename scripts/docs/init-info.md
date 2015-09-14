
# init-info Manual Page

## Name

init info - Display helpful initiative info about a token.

## Synopsis

init info \[\<token\>\] \[--quiet|-q\]

## Description

Init info displays whether a token has acted yet, how many turns they have completed, and the initiative order upcoming until their next turn begins.

## Options

### \<token\>
The name of one token. If multiple tokens with the same name exist and are matched, the command will fail. If no label is provided, and exactly one token is selected, info will be returned about the currently selected token.

### --quiet, -q
If this option is enabled, chat message output will be whispered only to the player who caused this command to be run, rather than to all players.

## Output

If this command runs successfully, info about whether a token has acted yet, how many turns they have completed, and the initiative order upcoming until their next turn begins will be returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init info** *(with Gandalf selected)*

> Gandalf has completed 4 turns.
>
> Turn Order: Ringwraith 2, Gandalf

**init info Gandalf** *(selection doesn't matter)*

> Gandalf has not acted yet (0 turns completed).
>
> Turn Order: Ringwraith 1, Ringwraith 2, Gandalf
