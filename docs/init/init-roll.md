
# init-roll Manual Page

## Name

init roll - Add a token to the initiative order (players and GM).

## Synopsis

```
init roll <roll> [<token>]
```

## Description

Init roll adds a single token to the initiative order. The GM can use this to add a token by name or from the current selection. Players can use this to add their own token to the initiative order.

This command is permitted only for the GM and by players controlling tokens not yet added to the initiative order.

## Options

### \<roll\>
The initiative test result for the token(s) to be added to in the initiative order. If dice roll literals such as d6 or d20 are provided, they will be processed as dice rolls usually are.

### \<token\> (optional)
The name of one token. If multiple tokens with the same name exist and are matched, the command will fail. If no label is provided, and exactly one token is selected, roll will be returned about the currently selected token.

## Output

If this command runs successfully, the name of the token added to the initiative order and the value at which it was added will be returned as chat output to all players.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init roll d20+3``` *(as GM, with Gandalf selected)*

> Gandalf added at initiative order 18.

```init roll d20+3 Gandalf``` *(as GM, selection doesn't matter)*

> Gandalf added at initiative order 19.

```init roll d20+3``` *(as Gandalf, selection doesn't matter)*

> Gandalf added at initiative order 20.