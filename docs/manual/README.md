# CLI Mach's Documentation

## Overview

This collection of chat commands can be used together in a Roll20 game to enhance your game experience and make your gameplay a little more streamlined. The intended user is someone who really loves the UNIX command-line ala ```bash```, but it isn't hard to learn how to manage the basics. All of these manu8al pages come with examples of usage and full explanations of every option or intended use that I've planned for. If these docs don't explain what you're trying to do, maybe rethink what you're trying to do.

## Command Manual Pages (man-style)

### [cond Manual](cond/cond.md)
Cond is a condition tracking system. It allows the GM and their players to keep track conditions easily and display them graphically as icons on tokens using a chat-message-driver command interface.

### [init Manual](init/init.md)
Init is a initiative tracking system. It gives the GM and their players the tools to easily manage initiative order, including more complex actions like wait/delay actions. It has a complete chat-message-driven command interface for doing anything a GM and his/her players might want to do with initiative (within reason).

## Dependencies

Init is dependent upon [Manveti](https://app.roll20.net/users/503018/manveti)'s [CommandShell](https://wiki.roll20.net/Script:Command_Shell) to process chat messages into commands and arguments.

## Building CLI Mach's

If you want to modify CLI Mach's and make it your own or something else entirely, you'll have to modify the source code and build the Roll20 distributable script using ```grunt```. You'll need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) (bundled with Node.js) as well as the npm packages [grunt](https://www.npmjs.com/package/grunt) and [grunt-cli](https://www.npmjs.com/package/grunt-cli) installed in order to do this. 

If you have no clue what I'm talking about, check out [this grunt getting started guide](http://gruntjs.com/getting-started) and follow the instructions for "working with an existing Grunt project". It's not as tough as it may seem, but it's outside the scope of this README and it will take you a few hours to get going if you are new to this. You can contact me using either of the links at the bottom if you need some advice on getting started.

If you have everything you need, run this at the terminal (in the repo folder):

```
grunt
```

## Developer's Notes

This collection of Roll20 CLI scripts is (ambitiously) my first attempt at building a script for Roll20. I started with Init, my initiative tracking system, since I wanted to make something that has been done many times already to get started. An initiative tracking tool seemed like it had been done to death, so I figured I'd make one of those so I could peek at how others had done it before me and learn the API.

Init was mostly inspired by [Initiative Tracker](https://wiki.roll20.net/Script:Initiative_Tracker) by [Manveti](https://app.roll20.net/users/503018/manveti) on Roll20.net. 

## Future Plans

My intention for Init is to incorporate it into a small ecosystem of commands that all interoperate and provide compatibility for a wide range of RPG systems.

I would love to provide an interface for graphical controls and feedback akin to those provided by [The Aaron](https://app.roll20.net/users/104025/the-aaron)'s [Turn Marker](https://wiki.roll20.net/Script:Turn_Marker). This isn't high priority, but would probably make this script much more popular amongst less UNIX-nerd-ish devs.

Condition tracking is also a natural next-step feature. In order to make conditions play into rolls usefully across a range of RPG systems, a plugin system to provide hooks for different types of character sheets will be necessary so conditions and adjust rolls using character data.

For the immediate future, expect condition tracking that is superficial but integrated with initiative tracking to handle durations of effect. However, once I build a Cypher System character sheet, I can move ahead on a module to hook into that sheet and generalize its behaviour to character sheets for other RPG systems (so long as someone is willing to write extensions for the sheets they intend to use).

Anyway, all of this is very ambitious. I'll probably tire of all of this, but my goal is to make all of the tools I need to smoothly run a Cypher System game using Roll20, and hopefully provide something of value to the players of other RPG systems while I'm at it.

If you would like to contribute to this project, contact me using one of the links below or just go ahead and submit a PR and we'll talk!

Wish me luck!


@DigitalMachinist - [Roll20](https://app.roll20.net/users/554530/jeff-r) - [GitHub](https://github.com/DigitalMachinist)