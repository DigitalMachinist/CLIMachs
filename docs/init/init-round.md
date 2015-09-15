
# init-round Manual Page

## Name

init round - Get or set the current round counter (GM only).

## Synopsis

```
init round [<value>]
```

## Description

Init round gets or sets the round counter that tracks the total elapsed time since the encounter began.

To set the round counter to a new value, include its new value in your command (e.g. ```init round 6```).

To print out the current round number, write the bare command (e.g. ```init round```).

This command is permitted only as the GM.

## Options

### \<value\>
If supplied, the round counter will be set to this value.

## Output

If this command runs successfully, the value of the round counter will be returned as chat output to all players.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init round```

> The encounter is currently in round 2.

```init round 6```

> The encounter is now in round 6 (round counter forcibly set).