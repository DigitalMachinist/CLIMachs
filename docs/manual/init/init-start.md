
# init-start Manual Page

## Name

init-start - Start counting turns from the token with the highest initiative (GM only).

## Synopsis

```
init-start
```

## Description

init-start resets the round counter to 0 and begins counting through turns starting from the token with the highest initiative score. 

Typically you will use this command once your initiative order has all tokens added and ordered correctly (whatever correctly is for you). If you want to clear the initiative order before adding new items, use [init-clear](init-clear.md).

This command is permitted only as the GM.

## Options

n/a

## Output

If this command runs successfully, a confirmation that the first round of the encounter has began and an announcement of the first turn will be returned as chat output to all players.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init-start``` *(selection doesn't matter)*

> An encounter has begun!
>
> It is now Gandalf's turn.
