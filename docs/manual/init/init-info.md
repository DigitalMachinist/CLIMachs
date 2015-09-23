
# init-info Manual Page

## Name

init-info - Display helpful initiative info about a token (players and GM).

## Synopsis

```
init-info [<token>]
```

## Description

init-info displays whether a token has acted yet, how many turns they have completed, and the initiative order upcoming until their next turn begins.

## Options

### \<token\> (optional)
The name of one token. If multiple tokens with the same name exist and are matched, the command will fail. If no label is provided, and exactly one token is selected, info will be returned about the currently selected token.

This command is permitted as any player or as the GM.

## Output

When executed, this command returns a list of available Init commands along with some examples of basic usage as a whisper to only the player that invoked the command.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init-info``` *(with Gandalf selected)*

> Gandalf has completed 4 turns.
>
> Turn Order: Ringwraith 2, Gandalf

```init-info Gandalf``` *(selection doesn't matter)*

> Gandalf has not acted yet (0 turns completed).
>
> Turn Order: Ringwraith 1, Ringwraith 2, Gandalf
