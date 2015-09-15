
# init-act Manual Page

## Name

init act - End the wait actions of tokens (players and GM).

## Synopsis

```
init act [<tokens>] ...
```

## Description

Init act ends the wait actions of the supplied tokens and inserts them back into the initiative order before the current turn. If this command is not called for a waiting token before its next turn, the wait action is cancelled once their next run begins.

The opposite of this command is [init-wait](init-wait.md).

This command is permitted only for the GM and by players whose token is currently performing a wait action.

## Options

### \<tokens\> (optional)
The names of one or more tokens. If multiple tokens with the same name exist and are matched, all will have their wait actions ended. If no names are provided, the currently selected tokens will be added to the initiative order by default (if any). If called by a player with a token performing a wait action and no tokens are provided, the player's token will have its wait action ended.

## Output

If this command runs successfully, the names of tokens moved in the initiative order and the label of the token they were moved to will be returned as chat output to all players.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init act``` *(as GM, with Gandalf selected)*

> Gandalf took action before Ringwraith 1.

```init act``` *(as GM, with Ringwraith 1 and Ringwraith 2 selected)*

> Ringwraith 1 took action before Gandalf (initiative order 18).
>
> Ringwraith 2 took action before Gandalf (initiative order 18).

```init act --no-move "Ringwraith 1" "Ringwraith 2"``` *(as GM, selection doesn't matter)*

> Ringwraith 1 is no longer waiting (not moved in initiative order).
>
> Ringwraith 2 is no longer waiting (not moved in initiative order).

```init wait``` *(as Gandalf, selection doesn't matter)*

> Gandalf began a wait action.
