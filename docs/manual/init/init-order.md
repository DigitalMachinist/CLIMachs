
# init-order Manual Page

## Name

init-order - Display the initiative order for one complete round (players and GM).

## Synopsis

```
init-order
```

## Description

init-order displays the initiative order beginning from the current token's turn and continuing until the same token's turn in the following round.

This command is permitted as any player or as the GM.

## Options

n/a

## Output

When executed, this command returns the initiative order beginning from the current token's turn and continuing until the same token's turn in the following round as whisper to only the player that invoked the command.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

```init-order``` *(on Ringwraith 1's turn, selection doesn't matter)*

> Initiative Order: 
>
> Ringwraith 1    18  <-- Current
> 
> Ringwraith 2    16
> 
> Gandalf         23  <-- Round 2
>
> Ringwraith 1    18