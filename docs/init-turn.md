
# init-turn Manual Page

## Name

init turn - Get or set the token currently taking its turn.

## Synopsis

init turn \[\<token\>\]\] \[--quiet|-q\] 

## Description

Init turn gets or sets the token considered to be currently taking its turn. This does NOT cause the round counter to advance or otherwise change. If you just want to advance the turn order, use [init-next](init-next.md) instead.

To set the current turn as belonging to a token, include the name of the token in your command (e.g. ```init turn Gandalf```).

To print out the current turn number, write the bare command (e.g. ```init turn```).

## Options

### \<token\>
The name of one token. If multiple tokens with the same name exist and are matched, the command will fail. If no label is provided, and exactly one token is selected, the token's turn will begin immediately.

### --quiet, -q
If this option is enabled, chat message output will be whispered only to the player who caused this command to be run, rather than to all players.

## Output

If this command runs successfully, the name of the token currntly taking its turn is returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init turn**

> It is currently Ringwraith 2's turn.

**init turn Gandalf**

> Gandalf's turn has begun (turn forcibly set).