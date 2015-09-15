
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
  - [init-order](init-order.md): Display the initiative order for one complete round.
  - [init-prev](init-prev.md): Reverse back to the previous token's turn.
  - [init-round](init-round.md): Get or set the current round counter.
  - [init-remove](init-remove.md): Remove a token from the initiative order.
  - [init-start](init-start.md): Start counting turns from the token with the highest initiative.
  - [init-turn](init-turn.md): Get or set the token currently taking its turn.
  - [init-wait](init-wait.md): Begin wait actions for tokens.

## Author's Notes

This chat message CLI app is my first attempt at building a script for Roll20, so I wanted to make something that has been done many times already. An initiative tracking tool seemed like it had been done to death, so I figured I'd make one of those so I could peek at how others had done it before me and learn the API.

Init was mostly inspired by [Initiative Tracker](https://wiki.roll20.net/Script:Initiative_Tracker) by [Manveti](https://app.roll20.net/users/503018/manveti) on Roll20.net. 

Init is dependent upon [Manveti](https://app.roll20.net/users/503018/manveti)'s [CommandShell](https://wiki.roll20.net/Script:Command_Shell) to process chat messages into commands with arguments.

## Future Plans

My intention for Init is to incorporate it into a small ecosystem of commands that all interoperate and provide compatibility for a wide range of RPG systems.

Status effect tracking is a natural next-step feature. In order to make tracking of status effects play into rolls usefully across a range of RPG systems, a plugin system to provide hooks for different types of character sheets will be necessary.

For the immediate future, expect status effect tracking that is superficial but integrated with initiative tracking to handle durations of effect. However, once I build a Cypher System character sheet, I can move ahead on a module to hook into that sheet and generalize its behaviour to character sheets for other RPG systems (so long as someone is willing to write extensions for the sheets they intend to use).

Anyway, all of this is very ambitious. I'll probably tire of all of this, but my goal is to make all of the tools I need to smoothly run a Cypher System game using Roll20, and hopefully provide something of value to the players of other RPG systems while I'm at it.

Wish me luck!
