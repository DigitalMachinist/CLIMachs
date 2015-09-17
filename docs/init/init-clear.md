
# init-clear Manual Page

## Name

init-clear - Clear the initiative order of all tokens (GM only).

## Synopsis

```init-clear```

## Description

init-clear removes all tokens from the initiative order and clears Init's own internal round/turn counters so the state of the initiative system is completely refreshed.

This command is permitted only as the GM.

## Options

n/a

## Output

If this command runs successfully, a confirmation that the initiative order has been cleared will be returned as chat output to all players.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init-clear``` *(selection doesn't matter)*

> Initiative order cleared!