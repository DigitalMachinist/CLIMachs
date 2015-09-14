
# init-add Manual Page

## Name

init add - Add the currently selected tokens to the initiative order.

## Synopsis

init add \<roll\> \[\<tokens\>\] ...

## Description

Init add adds tokens to the initiative order using the current selection.

This allows several tokens to be added to the initiative order simultaneously and easily, as long as they have similar initiative stats.

## Options

### \<roll\>
The initiative test result for the token to be added to the initiative order. If dice roll literals such as d6 or d20 are provided, they will be processed for each of the tokens being added to the initiative order.

### \<tokens\>
The labels of one or more tokens. If two tokens with the same name exist and are matched, both will be added to the initiative order. If no label is provided, the currently selected tokens will be added to the initiative order by default (if any).

## Output

If this command runs successfully, the labels of the tokens added to the initiative order and the value at which they were added will be returned as chat output whispered to the user who invoked the command.

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init add 18** *(with Gandalf selected)*

> Gandalf added at initiative order 18.

**init add d20+3** *(with Ringwraith 1 and Ringwraith 2 selected)*

> Ringwraith 1 added at initiative order 8.
>
> Ringwraith 2 added at initiative order 15.

**init add d20+3 "Ringwraith 1" "Ringwraith 2"** *(selection doesn't matter)*

> Ringwraith 1 added at initiative order 16.
>
> Ringwraith 2 added at initiative order 11.