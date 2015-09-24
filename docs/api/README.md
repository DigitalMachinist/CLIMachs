# CLIMachs Command Framework 

CLIMachs is a complete CLI command framework for the [Roll20](https://roll20.net/) scripting API.

You're looking at the CLIMachs API Docs. These pages will help you navigate coding your own commands or modifying the CLIMachs framework itself. They provide all of the usual goodies you'd find on an API page, since the CLIMachs source code is carefully commented in [JSDoc](http://usejsdoc.org/) style.

If you're looking for something a less technical, check out the [CLIMachs Reference Manual]() instead. The manual is designed to provide help with common usage of CLIMachs in your Roll20 campaigns, step-by-step instructions for getting CLIMachs up and running in your game, and walkthroughs to clearify the process of making basic commands compatible with the CLIMachs framework.

Since you're here, you may also what to check out the [CLIMachs GitHub Repo](https://github.com/DigitalMachinist/CLIMachs), since all the code documented here is hosted there.

## Building CLIMachs for Development
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Run this at the terminal (in the cloned repo folder) to build the Roll20 script files from source:

```
npm install
grunt
```

Perhaps that needs a bit more explanation...

If you're looking at this page, you might be the type who uses a more sophisticated development environment than the Roll20 script editor and want to do your coding there. If so, you'll need to clone this repository to your hard drive and build the ES2015 source code to produce the script that you can copy into the Roll20 script editor. This will give you the ability to modify CLIMachs, customize what commands are included in the final output, and package your own scripts into a customized CLIMachs bundle.

I use a ```grunt``` build process to convert my ES2015 code into ES5 (browser-compatible) JavaScript. You'll need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) (bundled with Node.js) as well as the npm packages [grunt](https://www.npmjs.com/package/grunt) and [grunt-cli](https://www.npmjs.com/package/grunt-cli) installed in order to do this. 

If you have no clue what I'm talking about, now is the time for fight or flight! If you're keen to dive in, check out [this grunt getting started guide](http://gruntjs.com/getting-started) and follow the instructions for "working with an existing Grunt project". It's not as tough as it may seem, but it's outside the scope of this README and it will take you a few hours or even a few days to get going if you are new to this. You can contact me if you need some advice on getting started. I'm always happy to help!

## Notes

Just as fair warning, the line numbers reported for functions and classes in these API docs are not accurate. Since I have to transpile my fancy futuristic ES2015 code into ES5 before I can run JSDoc on it, that inevitably alises the line numbers that the docs refer to compared to the original pre-transpiled source code. 

*Sorry! 'Tis the price of progress!*

That being said, the files to which the classes and functions belong are accurate, and the line numbers should give you a ballpark for how far down in the file they are.

## History

### v0.0.1

Initial release!

