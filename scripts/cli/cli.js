
/**
 * @class
 * CommandError is a subclass of Error for semantic purposes so denote problems with processing 
 * commands that may be expected behaviour, but that need to be handled as errors for consistency. 
 * It doesn't do anything new, it's just to distinguish error types.
 */
CLIMachs.fn.CommandError = class CommandError extends Error {

  constructor ( message ) {
    super( message );
  }

};


/**
 * @function
 * Constructor for middleware objects. These are used to keep track of middleware callbacks by 
 * giving them a key to identify them while stored in an array ordered by execution.
 * @param  {[type]}   key      The identifier given to this middleware callback.
 * @param  {Function} callback The callback function implementing the behaviour of the middleware.
 *                             Function signature may vary by context of usage.
 * @return {Middleware}        A Middleware instance.
 */
CLIMachs.fn.Middleware = function Middleware ( key, callback ) {

  // Validate Inputs

    if ( typeof( callback ) !== 'function' ) {
      throw new CLIMachs.fn.ArgumentError( 'callback must be a valid function!' );
    }
    if ( typeof( key ) !== 'string' ) {
      throw new CLIMachs.fn.ArgumentError( 'key must be a valid string!' );
    }

  // Fields

    /**
     * The callback function that implements the behaviour of the Middleware.
     * @type {Function}
     */
    const __callback = callback;

    /**
     * The identifier used to look this Middleware up on an array of several Middlewares.
     * @type {string}
     */
    const __key = key;

  // External Property Definitions

    let result = {};
    Object.defineProperties( result, {

      // Fields

        callback: {
          enumerable: true,
          get: () => __callback
        },

        key: {
          enumerable: true,
          get: () => __key
        }

    } );
    Object.seal( result );

  return result;

};


/**
 * @function
 * Constructor for permission group objects. Groups are structurally similar to Middleware objects, 
 * so this is simply an alias to denote the difference in usage/meaning.
 * @param  {[type]}   key      The identifier given to this middleware callback.
 * @param  {Function} callback The callback function implementing the behaviour of the middleware.
 *                             Expects a function matching the signature: ( message ) => {}.
 * @return {Middleware}        A Middleware instance.
 */
CLIMachs.fn.Group = Middleware;


/**
 * @function
 * Constructor for permissions objects. These are used to define a whitelist of conditions under 
 * under which a message is allowed to execute a command belonging to the CLI.
 * @return {Permissions} A Permissions instance.
 */
CLIMachs.fn.Permissions = function Permissions () {

  // Fields
  
    /**
     * A list of Groups that are permitted to execute this command. Each Group defines a callback 
     * that is tested when a user attempts to execute the relevant command, and if any Group's
     * callback returns true, then the user is permitted to execute the command. The GM is 
     * not included in this list as the GM is permitted to execute any command at any time.
     * @type {Array}
     */
    const __groups = [];

    /**
     * A list of player IDs that represent players who have been granted full-time exclusive access 
     * to this command. This kind of permission granting should be reserved for co-GMs or helpers 
     * that need higher-level access to CLI commands than players do.
     * @type {Array}
     */
    const __players = [];

  // Public Functions

    /**
     * @function
     * Add a new (or overwrite an existing) permission group.
     * @param  {string} groupName The name of the group to add permissions for.
     */
    function addPermissionGroup ( groupName ) {
      
      // Validate for invalid groupNames.
      if ( typeof( groupName ) !== 'string' ) {
        throw new CLIMachs.fn.ArgumentError( 'groupName must be a valid string!' );
      }

      // Look up the permission group.
      const groupCallback = CLIMachs.cli.permissionGroups
        .find( callback => callback.key === groupName );

      // Reject invalid group names.
      if ( !groupCallback ) {
        throw new CLIMachs.fn.CommandError( 'No permission group exists by that name!' );
      }

      // Create a new Group object and add it to the __groups array. This will automatically 
      // overwrite any existing group at the given key, but a warning will be printed if so.
      const group = CLIMachs.fn.Group( groupName, groupCallback.callback );
      __groups.addSortedByKey( 'key', group );

    }


    /**
     * @function
     * Add a new (or overwrite an existing) player permission.
     * @param  {string} playerName The name of the player to add permissions for.
     */
    function addPermissionPlayer ( playerName ) {
      
      // Validate for invalid playerNames.
      if ( typeof( playerName ) !== 'string' ) {
        throw new CLIMachs.fn.ArgumentError( 'playerName must be a valid string!' );
      }

      // Find the player ID for the given name. If no match exists, throw an Error.
      const playerId = CLIMachs.fn.getPlayerIdByName( playerName );
      if ( playerId < 0 ) {
        throw new CLIMachs.fn.CommandError( 'No player exists by that name!' ); 
      }
      
      // Add the player ID to the list of allow players IDs, if it doesn't already exist.
      if ( !__players.find( playerId ) ) {
        __players.push( playerId );
      }

    }

    /**
     * @function
     * Remove an existing permission group. This will result in messages matching the removed group 
     * being disallowed from invoking the protected command unless the message matches something else.
     * @param  {string}  groupName The name of the group to remove permissions for.
     * @return {Boolean}           Whether or not the player was found and removed.
     */
    function removePermissionGroup ( groupName ) {
      
      // Validate for invalid groupNames.
      if ( typeof( groupName ) !== 'string' ) {
        throw new CLIMachs.fn.ArgumentError( 'groupName must be a valid string!' );
      }

      // Look up the permission group.
      const groupCallback = CLIMachs.cli.permissionGroups
        .find( callback => callback.key === groupName );

      // Reject invalid group names.
      if ( !groupCallback ) {
        throw new CLIMachs.fn.CommandError( 'No permission group exists by that name!' );
      }

      // Try to remove the group and return the result.
      return __groups.removeByKey( groupName, false );

    }

    /**
     * @function
     * Remove an existing player permission. This will result in messages from the given user being 
     * disallowed from invoking the protected command unless the message matches something else.
     * @param  {string}  playerName The name of the player to remove permissions for.
     * @return {Boolean}            Whether or not the player was found and removed.
     */
    function removePermissionPlayer ( playerName ) {
      
      // Validate for invalid playerNames.
      if ( typeof( playerName ) !== 'string' ) {
        throw new CLIMachs.fn.ArgumentError( 'playerName must be a valid string!' );
      }
      
      // Find the player ID for the given name. If no match exists, throw an Error.
      const playerId = CLIMachs.fn.getPlayerIdByName( playerName );
      if ( playerId < 0 ) {
        throw new CLIMachs.fn.CommandError( 'No player exists by that name!' ); 
      }

      // Find the player ID in the list of allowed players. If it isn't found, return false.
      const playerIndex = __players.findIndex( playerId );
      if ( playerIndex < 0 ) {
        return false;
      }

      // Remove the player ID from the list and return true for success.
      __players.splice( playerIndex, 1 );
      return true;

    }

    /**
     * @function
     * Test a message for access to the protected command.
     * @param  {Message} message A Roll20 Message received from the chat interface.
     * @return {Boolean}         Whether or not the protected command can be invoked.
     */
    function test ( message ) {
      
      // Validate for invalid messages.
      if ( !message || !message.type || message.type !== 'api' ) {
        throw new CLIMachs.fn.ArgumentError( 'message must be a valid Roll20 Message!' );
      }

      // Is the sender the GM?
      if ( playerIsGM( message.playerid ) ) {
        return true;
      }

      // Does the sender's player ID match any of the allowed player IDs?
      if ( __players.find( message.playerid ) ) {
        return true;
      }

      // Does the sender belong to any of the allowed permission groups?
      return __groups
        .reduce( ( allow, group ) => allow = allow || group.callback( message ), false );

    }

  // External Property Definitions

    let result = {};
    Object.defineProperties( result, {

      // Fields

        groups: {
          enumerable: true,
          get: () => __groups.slice()
        },

        players: {
          enumerable: true,
          get: () => __players.slice()
        },

      // Functions

        addPermissionGroup: {
          enumerable: true,
          value: addPermissionGroup
        },

        addPermissionPlayer: {
          enumerable: true,
          value: addPermissionPlayer
        },

        removePermissionGroup: {
          enumerable: true,
          value: removePermissionGroup
        },

        removePermissionPlayer: {
          enumerable: true,
          value: removePermissionPlayer
        },

        test : {
          enumerable: true,
          value: test
        }

    } );
    Object.seal( result );

  return result;

};


/**
 * Constructor for Command objects. These are used to define all aspects of a command that can be 
 * executed by a chat command through the CLI.
 * @param  {string}   signature   The idiomatic text to match to execute this command
 * @param  {string}   description A short explanation of what the command does.
 * @param  {string}   syntax      A description of the syntax to use this command.
 * @param  {Function} callback    The callback function that implements the command behaviour.
 * @return {Command}              A Command instance.
 */
CLIMachs.fn.Command = function Command ( signature, description, syntax, callback ) {

  // Validate Inputs

    if ( typeof( callback ) !== 'function' ) {
      throw new CLIMachs.fn.ArgumentError( 'callback must be a valid function!' );
    }
    if ( typeof( description ) !== 'string' ) {
      throw new CLIMachs.fn.ArgumentError( 'description must be a valid string!' );
    }
    if ( typeof( signature ) !== 'string' ) {
      throw new CLIMachs.fn.ArgumentError( 'signature must be a valid string!' );
    }
    if ( typeof( syntax ) !== 'string' ) {
      throw new CLIMachs.fn.ArgumentError( 'syntax must be a valid string!' );
    }

  // Fields

    /**
     * A list of aliases that will match for this command. While the signature of the command is 
     * the idiomatic name to call it by, any of the aliases will match it to allow the caller to
     * use short forms or allow the CLI to handle common misspellings.
     * @type {Array}
     */
    const __aliases = [];
    
    /**
     * The callback function it called by the CLI when this command when it is matched and executed.
     * @type {Function}
     */
    const __callback = callback;

    /**
     * A short description of the command to provide basic command discovery features and make it 
     * easier for users to understand what commands are available and what they do at a glance.
     * @type {string}
     */
    const __description = description;

    /**
     * The Permissions object that defines who is permitted to execute this command and when.
     * @type {Permissions}
     */
    const __permissions = CLIMachs.fn.Permissions();

    /**
     * The idiomatic name of this command, considered the ideal match for this command at the CLI. 
     * If you would like to support this command under several different names/variants, use the 
     * __aliases array to provide other options.
     * @type {string}
     */
    const __signature = signature;

    /**
     * A list of subcommands that this command supports. This is common for more advanced or powerful 
     * commands, so this gives scriptwriters the ability to use CLIMachs' command parsing systems to 
     * handle the subcommands as well and call callbacks for these subcommands directly.
     * @type {Array}
     */
    const __subcommands = [];

    /**
     * An example of the syntax of this command, preferably in general form (like is presented in 
     * UNIX-style man pages).
     * @type {string}
     */
    const __syntax = syntax;

  // Public Functions

    /**
     * @function
     * Add an alias signature to enable another signature to call this command by.
     * @param  {string} alias The signature of the alias to add.
     */
    function addAlias ( alias ) {
      
      // Validate for invalid aliases.
      if ( typeof( alias ) !== 'string' ) {
        throw new CLIMachs.fn.ArgumentError( 'alias must be a valid string!' );
      }

      // TODO

    }

    /**
     * @function
     * Regsiter a subcommand to extend the behaviour of this command.
     * @param  {Command} command The Command object representing the command to add as a subcommand.
     */
    function registerSubcommand ( command ) {

      // Validate for invalid commands.
      if ( !( command instanceof Command ) ) {
        throw new CLIMachs.fn.ArgumentError( 'command must be a valid Command object!' );
      }

      // Check for conflicting aliases. This is a broad test to test if there is any reason at all 
      // that we might encounter a name conflict, although a name conflict of this kind MIGHT not 
      // be serious -- just annoying for certain users that use particular aliases.
      const allAliases       = __aliases.concat( __signature );
      const commandAliases   = command.aliases.concat( command.signature );
      const duplicateAliases = commandAliases
        .filter( alias => allAliases.find( alias ) );

      if ( duplicateAliases.length > 0 ) {
        log( `Warning! The ${ command.signature } subcommand contains conflicting command and/or 
          alias signatures! ${ duplicateAliases }` );
      }

      // Add the command to the __subcommands array. This will automatically overwrite any existing 
      // subcommand with the same signature, but a warning will be printed if so.
      __subcommands.addSortedByKey( 'signature', command );

    }

    /**
     * @function
     * Remove an alias signature to disable another signature to call this command by.
     * @param  {string}  alias The signature of the alias to remove.
     * @return {Boolean}       Whether or not the alias was found and removed.
     */
    function removeAlias ( alias ) {
      
      // Validate for invalid aliases.
      if ( typeof( alias ) !== 'string' ) {
        throw new CLIMachs.fn.ArgumentError( 'alias must be a valid string!' );
      }

      // TODO
      
    }

    /**
     * @function
     * Unregister a subcommand from this command by its signature.
     * @param  {string}  signature The signature of the command to be removed.
     * @return {Boolean}           Whether or not the command was found and removed.
     */
    function unregisterSubcommand ( signature ) {
      
      // Validate for invalid signature.
      if ( typeof( signature ) !== 'string' ) {
        throw new CLIMachs.fn.ArgumentError( 'signature must be a valid string!' );
      }

      // TODO

    }

  // External Property Definitions

    let result = {};
    Object.defineProperties( result, {

      // Fields

        aliases: {
          enumerable: true,
          get: () => __aliases.slice()
        },

        callback: {
          enumerable: true,
          get: () => __callback
        },

        description: {
          enumerable: true,
          get: () => __description
        },

        permissions: {
          enumerable: true,
          get: () => __permissions.slice()
        },

        signature: {
          enumerable: true,
          get: () => __signature
        },

        subcommands: {
          enumerable: true,
          get: () => __subcommands.slice()
        },

        syntax: {
          enumerable: true,
          get: () => __syntax
        },

      // Functions

        addAlias: {
          enumerable: true,
          value: addAlias
        },

        registerSubcommand: {
          enumerable: true,
          value: registerSubcommand
        },

        removeAlias: {
          enumerable: true,
          value: removeAlias
        },

        unregisterSubcommand: {
          enumerable: true,
          value: unregisterSubcommand
        }

    } );
    Object.seal( result );

  return result;

};


/**
 * Constructor for CLI objects. The CLI is effectively a singleton, as it is the entrypoint for all 
 * chat message commands to interface with the CLI and cause the execution of commands.
 * @return {CLI} A CLI instance.
 */
CLIMachs.fn.CLI = function CLI () {

  // Fields
  
    /**
     * The top-level list of commands available to users of the CLI.
     * @type {Array}
     */
    const __commands = [];


    /**
     * A complete list of the valid permission groups that the CLI will use to validate messages.
     * @type {Array}
     */
    const __permissionGroups = [];

    /**
     * An ordered list of middleware callbacks that run when any command is executed, just before 
     * the matched command is executed. These will only run if a command is matched.
     * @type {Array}
     */
    const __preCommandMiddleware = [];

    /**
     * An ordered list of middleware callbacks that run when any command is executed, just before 
     * the tokens are passed to the routing system. These will run if there are 1 or more tokens.
     * @type {Array}
     */
    const __preRoutingMiddleware = [];

  // Public Functions

    /**
     * Add a command to the CLI lexicon. This will automatically overwrite any command that 
     * matches the same signature, but will log a warning if an overwrite takes place.
     * @param  {Command} The Command object representing the command to add as a subcommand.
     */
    function addCommand ( command ) {

      // TODO

    }


    /**
     * Add a permission group to the set of available groups. This will automatically overwrite 
     * any group that has the same key, but will log a warning if an overwrite takes place.
     * @param  {Group} group The Group object to add.
     */
    function addPermissionGroup ( group ) {

      // TODO

    }
        
    /**
     * Add a middleware callback to run immediately before message routing is processed. If 
     * beforeIndex is supplied, the middleware will be spliced into the middleware order 
     * at the given index, pushing all items after it ahead one place.
     * @param {string}   key         The identifier to use later to remove the callback.
     * @param {Function} callback    The middleware callback function of the signature:
     *                               function middleware ( tokens, message ) {}
     * @param {Number}   beforeIndex The index to insert the middleware at (default: -1).
     */
    function addPreCommandMiddleware ( key, callback, atIndex = -1 ) {

      // TODO

    }
     
    /**
     * Add a middleware callback to run immediately before the matched command is executed. If 
     * beforeIndex is supplied, the middleware will be spliced into the middleware order 
     * at the given index, pushing all items after it ahead one place.
     * @param {string}   key         The identifier to use later to remove the callback.
     * @param {Function} callback    The middleware callback function of the signature:
     *                               function middleware ( tokens, message, Command ) {}
     * @param {Number}   beforeIndex The index to insert the middleware at (default: -1).
     */
    function addPreRoutingMiddleware ( key, callback, beforeIndex = -1 ) {

      // TODO

    }

    /**
     * Perform configuration tasks dependent upon the Roll20 ready event.
     */
    function onReady () {

      // TODO

    }

    /**
     * Remove a command from the CLI lexicon by its signature.
     * @param  {string}  signature The signature of the command to be removed.
     * @return {Boolean}           Whether or not the Command was found and removed.
     */
    function removeCommand ( signature ) {

      // TODO

    }


    /**
     * Remove a permission group from the set of available groups.
     * @param  {Group} group The key identifying the group to remove.
     * @return {Boolean}     Whether or not the Group was found and removed.
     */
    function removePermissionGroup ( group ) {

      // TODO

    }
        
    /**
     * Remove a middleware that would run before before command execution using its key. 
     * @param  {string} key The key identifying the middleware to remove.
     * @return {Boolean}    Whether or not the Middleware was found and removed.
     */
    function removePreCommandMiddleware ( key ) {

      // TODO

    }
     
    /**
     * Remove a middleware that would run before before message routing using its key. 
     * @param  {string} key The key identifying the middleware to remove.
     * @return {Boolean}    Whether or not the Middleware was found and removed.
     */
    function removePreRoutingMiddleware ( key ) {

      // TODO

    }

    /**
     * Given a tokenized command message, determine the command intended to be run and execute it.
     * @param  {Array}   tokens  An array containing a command and any passed arguments.
     * @param  {Message} message The original Roll20 Message object the tokens were pulled from.
     * @param  {Array}   head    Used for recursive calling. Stores tokens that have already been 
     *                           processed so they aren't lost as the tokens array shrinks.
     * @return {Command}         The matching Command, or null if no commands matched the input.
     */
    function route ( tokens, message, head = [] ) {

      // TODO

    }

    /**
     * Given a Roll20 Message object received as chat input, break in into an array containing a 
     * command and any passed arguments.
     * @param  {Message} message The Roll20 Message object to pull the tokens from.
     * @return {Array}           A series of string tokens representing the command and any passed 
     *                           arguments that were contained by the Roll20 Message object.
     */
    function tokenize ( message ) {

      // TODO

    }

  // Private Functions

    /**
     * @private
     * Execute each of the middleware callbacks in the provided array, in order.
     * @param  {Array} middlewareArray An ordered list of middleware to execute.
     */
    function __executeMiddleware ( middlewareArray ) {

      // TODO

    }

  // External Property Definitions

    let result = {};
    Object.defineProperties( result, {

      // Fields

        commands: {
          enumerable: true,
          get: () => __commands.slice()
        },

        permissionGroups: {
          enumerable: true,
          get: () => __permissionGroups.slice()
        },

        preCommandMiddleware: {
          enumerable: true,
          get: () => __preCommandMiddleware.slice()
        },

        preRoutingMiddleware: {
          enumerable: true,
          get: () => __preRoutingMiddleware.slice()
        },

      // Functions

        addCommand: {
          enumerable: true,
          value: addCommand
        },

        addPermissionGroup: {
          enumerable: true,
          value: addPermissionGroup
        },

        addPreCommandMiddleware: {
          enumerable: true,
          value: addPreCommandMiddleware
        },

        addPreRoutingMiddleware: {
          enumerable: true,
          value: addPreRoutingMiddleware
        },

        onReady: {
          enumerable: true,
          value: onReady
        },

        removeCommand: {
          enumerable: true,
          value: removeCommand
        },

        removePermissionGroup: {
          enumerable: true,
          value: removePermissionGroup
        },

        removePreCommandMiddleware: {
          enumerable: true,
          value: removePreCommandMiddleware
        },

        removePreRoutingMiddleware: {
          enumerable: true,
          value: removePreRoutingMiddleware
        },

        route: {
          enumerable: true,
          value: route
        },

        tokenize: {
          enumerable: true,
          value: tokenize
        }

    } );
    Object.seal( result );

  return result;

};

// Store the CLI's state in the CLIMachs global.
CLIMachs.cli = CLIMachs.cli || CLIMachs.fn.CLI();

// Start up the CLI when the sandbox ready event is emitted.
on( 'ready', CLIMachs.cli.onReady );
