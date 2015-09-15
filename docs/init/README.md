
# init Manual Page

## Name

init - A simple and powerful initiative order command set.

## Synopsis

```
init <command> [<args>] ...
```

## Description

Init is a complete chat-message-driven command set designed to make initiative order in Roll20.net campaigns easy to manage. 

The commands provided by Init allow the GM to perform just about any initiative-related task with relative ease, using only chat commands. Players have access to only the commands that they need to speed up the turn order, and they only have access when they need to have access (typically when it's their turn).

Init commands syntax is in the classic POSIX-style. If you're familiar with terminals such as ```bash``` or even the goold ole' ```DOS Shell```, this was made for you. However, Init is easy to learn and very well-documented, so you'll figure this out in to time regardless of your level of experience. Furthermore, all player commands are even simpler by design, so your players won't get tripped up by weird syntax.

## Options

### \<command\>
The Init command to be executed (available commands listed below).

### \<args\> (optional)
The command arguments expected by the given command. See the manual of the particular command you intend to use for further details regarding the arguments it expects.

## Commands

Init provides some commands that are available to all players and others that only the GM can use. Player command usage is restricted to only the player's token and commands will only be accepted at appropriate times (typically during the player's turn). The GM, however, has full access to the command set at any time to use as they wish.

### All Players

  - [init-act](init-act.md): End the wait actions of tokens.
  - [init-help](init-help.md): Display a short list of instructions and simple examples of usage.
  - [init-info](init-info.md): Display helpful initiative info about a token.
  - [init-next](init-next.md): Advance to the next token's turn.
  - [init-order](init-order.md): Display the initiative order for one complete round.
  - [init-prev](init-prev.md): Reverse back to the previous token's turn.
  - [init-wait](init-wait.md): Begin wait actions for tokens.

### GM Only

  - [init-add](init-add.md): Add tokens to the initiative order.
  - [init-clear](init-clear.md): Clear the initiative order of all tokens.
  - [init-config](init-config.md): Get or set Init configuration variables.
  - [init-move](init-move.md): Move a token in the initiative order.
  - [init-round](init-round.md): Get or set the current round counter.
  - [init-remove](init-remove.md): Remove a token from the initiative order.
  - [init-start](init-start.md): Start counting turns from the token with the highest initiative.
  - [init-turn](init-turn.md): Get or set the token currently taking its turn.
