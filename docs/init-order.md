
# init-order Manual Page

## Name

init order - Display the initiative order for one complete round.

## Synopsis

init order \[--current|-c\] \[--shout|-s\] 

## Description

Init order displays the initiative order of the current round starting from the turn at the beginning of the round and continuing to the same token's turn at the beginning of the following round.

## Options

### --current, -c
Is this option is enabled, the initiative order returned begins from the current turn and continues until the same token's turn in the following round, instead of starting from the turn at the beginning of this round and continuing to the same token's turn at the beginning of the following round.

### --shout, -s
If this option is enabled, chat message output will be sent to all players, rather than to only the player to executed the command.

## Output

When executed, this command returns the initiative order of the current round starting from the turn at the beginning of the round and continuing to the same token's turn at the beginning of the following round as whisper to only the player that invoked the command. To display to the output as a chat message to all players, use --shout option.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init order** *(selection doesn't matter)*

> Initiative Order: 
> 
> Gandalf         23
>
> Ringwraith 1    18  <-- Current
> 
> Ringwraith 2    16
> 
> Gandalf         23  <-- Round 2

**init order --current** *(selection doesn't matter)*

> Initiative Order: 
>
> Ringwraith 1    18  <-- Current
> 
> Ringwraith 2    16
> 
> Gandalf         23  <-- Round 2
>
> Ringwraith 1    18