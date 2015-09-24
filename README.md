# CLIMachs Command Framework 
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

CLIMachs is a complete CLI command framework for the Roll20.net scripting API.

TODO

## Documentation

The [CLIMachs Reference Manual]() describes the how to use the built-in commands and how to create your own commands. It is more suitable for less advanced users and just for typical day-to-day use of CLIMachs.

The [CLIMachs API Docs]() provide all of the nitty-gritty details of the objects and functions that make up CLIMachs' guts. These pages may only be useful to very advanced users and coders with the goal of hacking CLIMachs in some way.

## Features

TODO

## Using CLIMachs in your Roll20 Campaign

To use CLIMachs in your Roll20 campaign, you'll need to copy the contents of [CLIMachs.js](https://raw.githubusercontent.com/DigitalMachinist/CLIMachs/master/CLIMachs.js) or [CLIMachs.min.js](https://raw.githubusercontent.com/DigitalMachinist/CLIMachs/master/CLIMachs.min.js) into the Roll20 script editor. If you have any other scripts that depend on CLIMachs, such as custom CLIMachs commands that were written by you or someone else, make sure to copy CLIMachs in at the beginning of your script editor field.

*If you're not developing your own commands, I reccommend using CLIMachs.min.js. Yes, it looks like death, but it's smaller for your players to download and run, so everyone's load times will be better. If you don't mind waiting a bit and would rather have more readable code, feel free to use CLIMachs.js instead.*

Cross your fingers and give it a whirl! That's all it should take to get going.

Please [post an issue](https://github.com/DigitalMachinist/CLIMachs/issues) if you have any problems.

## Building CLIMachs for Development

If you are working on some really fancy commands or are interested in contributing to CLIMachs, you'll probably end up working in a more sophisticated development environment than the Roll20 script editor, and you'll probably want access to the actual ES2015 source code. In this case, you'll need to clone this repository to your hard drive and use Grunt to build source code into the final script that you can copy into the Roll20 script editor. This will give you the ability to modify CLIMachs, customize what commands are included in the final output, and even package your own scripts into a customized CLIMachs bundle.

If you want to modify CLIMach's and make it your own or something else entirely, you'll have to modify the source code and build the Roll20 distributable script using ```grunt```. You'll need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) (bundled with Node.js) as well as the npm packages [grunt](https://www.npmjs.com/package/grunt) and [grunt-cli](https://www.npmjs.com/package/grunt-cli) installed in order to do this. 

If you have no clue what I'm talking about, check out [this grunt getting started guide](http://gruntjs.com/getting-started) and follow the instructions for "working with an existing Grunt project". It's not as tough as it may seem, but it's outside the scope of this README and it will take you a few hours to get going if you are new to this. You can contact me if you need some advice on getting started. I'm always happy to help.

If you have everything you need, run this at the terminal (in the repo folder):

```
grunt
```

## Contributors

CLIMachs was written entirely by Jeff Rose (DigitalMachinist) - [Roll20](https://app.roll20.net/users/554530/jeff-r) - [GitHub](https://github.com/DigitalMachinist)

## LIcense

CLIMachs is licensed under the [WTFPL License](http://www.wtfpl.net/). You can do whatever you want with it. See if I care.

## History

### v0.0.1

Initial release!

---

# TODO

## CLI

  - Jasmine unit tests
  - CLIMachs Reference Manual
  - sendChat use name|id format to get full avatar support

## Init

### Important

  - init-add
  - init-clear
  - init-help
  - init-next
  - init-prev
  - init-start

### Back Burner

  - cond
  - init-act
  - init-config
  - init-info
  - init-move
  - init-order
  - init-remove
  - init-round
  - init-turn
  - init-wait