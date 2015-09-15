
# init-next Manual Page

## Name

init next - Advance to the next token's turn (players and GM).

## Synopsis

```
init next
```

## Description

Init next advances the initiative order to the next token's turn and notifies players.

This command permitted only for the GM and the player controlling the currently acting token.

## Options

n/a

## Output

If this command runs successfully, the name of the token whose turn is beginning is returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init next``` *(selection doesn't matter)*

> Advancing to next turn...
>
> It is now Gandalf's turn.