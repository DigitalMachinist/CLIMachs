
# init-help Manual Page

## Name

init help - Display a short list of instructions and simple examples of usage.

## Synopsis

init help \[--shout|-s\] 

## Description

Init help returns a list of available Init commands along with some examples of basic usage.

For more detailed documentation, view the Init manual (man) pages instead.

## Options

### --shout, -s
If this option is enabled, chat message output will be sent to all players, rather than to only the player to executed the command.

## Output

When executed, this command returns a list of available Init commands along with some examples of basic usage as a whisper to only the player that invoked the command. To display to the output as a chat message to all players, use --shout option.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init help** *(selection doesn't matter)*

> Help text (which is much longer than I care to write here!)...