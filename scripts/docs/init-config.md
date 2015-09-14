
# init-config Manual Page

## Name

init config - Get or set Init configuration variables.

## Synopsis

init config \[\<key\> \[\<value\>\]\] \[--quiet|-q\] 

## Description

Init clear gets or sets configuration variables that control how Init behaves for all players in the campaign.

To set a variable to a new value, include the key of the variable followed by its new value in your command (e.g. ```init config announceTurns true```).

To print out the value of a variable, include the key of the variable only (e.g. ```init config announceTurns```).

## Options

### \<key\>
The key of the variable to be accessed/mutated by this command (available variables listed below).

### \<value\>
If supplied with a \<key\>, the variable at the given \<key\> will be set to this value.

### --quiet, -q
If this option is enabled, chat message output will be whispered only to the player who caused this command to be run, rather than to all players.

## Variables

The following variables can be observed and set using this command: 

  - **allowPlayerCommands**: Allow players to invoke Init commands *(default: false)*.

  - **announceTurns**: Announce the beginning of each token's turn as a chat message to all players *(default: true)*.

  - **announceRounds**: Announce the beginning of each round of combat as a chat message to all players *(default: true)*.

  - **quietCommands**: All commands whisper chat message output only to the player who caused the command to be run, rather than to all players. This is equivalent to providing the --quiet option to every command. *(default: false)*

## Output

If this command runs successfully, the human-readable name for the requested variable, the key of the variable, and the value of the variable will be returned as chat output to all players (unless the --quiet option is set).

If an error occurs, the error will whispered to the user who invoked the command, accompanied by a suggestion of appropriate usage.

## Examples

**init config announceTurns**

> Player turn announcements (announceTurns) currently set to TRUE.

**init config announceTurns false**

> Player turn announcements (announceTurns) now set to FALSE.