
# init-wait Manual Page

## Name

init wait - Begin wait actions for tokens (players and GM).

## Synopsis

```
init wait [<tokens>] ...
```

## Description

Init wait begins wait actions for the supplied tokens. Their turns will begin when either a) the player takes a delayed action or b) their next turn begins.

The opposite of this command is [init-act](init-act.md).

This command is permitted only for the GM and by players controlling tokens not yet added to the initiative order.

## Options

### \<tokens\>
The names of one or more tokens. If multiple tokens with the same name exist and are matched, all will begin wait actions. If no names are provided, the currently selected tokens will be begin wait actions by default (if any). If called by a player on their turn and no tokens are provided, the player's token will begin a wait action.

## Output

If this command runs successfully, the names of tokens beginning wait actions will be returned as chat output to all players.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init wait``` *(as GM, with Gandalf selected)*

> Gandalf began a wait action.

```init wait``` *(as GM, with Ringwraith 1 and Ringwraith 2 selected)*

> Ringwraith 1 began a wait action.
>
> Ringwraith 2 began a wait action.

```init wait "Ringwraith 1" "Ringwraith 2"``` *(as GM, selection doesn't matter)*

> Ringwraith 1 began a wait action.
>
> Ringwraith 2 began a wait action.

```init wait``` *(as Gandalf, selection doesn't matter)*

> Gandalf began a wait action.
