
# init Manual Page

## Name

init - a simple and powerful initiative order command set

## Synopsis

init \<command\> \[\<args\>\] ...

## Description

Init is a simple POSIX-style chat-message-driven command set to make making initiative order in Roll20.net campaigns easy to manage. 

Init commands are only accessible to GMs, but it is possible to install companion scripts to make certain actions available to all players (such as ending their own turn or viewing the initiative order).

## Options

### \<command\>
The Init command to be executed (available commands listed below).

### \<args\>
The command arguments expected by the given command. See the manual of the particular command you intend to use for further details regarding the arguments it expects.

## Commands

  - [init-act](init-act.md): End the wait actions of tokens.
  - [init-add](init-add.md): Add tokens to the initiative order.
  - [init-clear](init-clear.md): Clear the initiative order of all tokens.
  - [init-config](init-config.md): Get or set Init configuration variables.
  - [init-help](init-help.md): Display a short list of instructions and simple examples of usage.
  - [init-info](init-info.md): Display helpful initiative info about a token.
  - [init-move](init-move.md): Move a token in the initiative order.
  - [init-next](init-next.md): Advance to the next token's turn.
  - [init-order](init-order.md): Display the initiative order.
  - [init-prev](init-prev.md): Reverse back to the previous token's turn.
  - [init-round](init-round.md): Get or set the current round counter.
  - [init-remove](init-remove.md): Remove a token from the initiative order.
  - [init-shuffle](init-shuffle.md): Randomize the turn order.
  - [init-start](init-start.md): Reset the round counter and start from the highest rolling token's turn.
  - [init-turn](init-turn.md): Get or set the token who is currently taking their turn.
  - [init-wait](init-wait.md): Begin a wait action for a token.
