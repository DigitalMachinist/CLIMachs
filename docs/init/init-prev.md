
# init-prev Manual Page

## Name

init prev - Reverse back to the previous token's turn (GM only).

## Synopsis

```
init prev
```

## Description

Init prev reverses the initiative order back to the most recent turn and notifies players.

This command is permitted only as the GM.

## Options

n/a

## Output

If this command runs successfully, the name of the token whose turn is beginning is returned as chat output to all players.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init prev``` *(selection doesn't matter)*

> Reversing to previous turn...
>
> It is now Ringwraith 2's turn.