
/**
 * @class
 * CommandError is a subclass of Error for semantic purposes so denote problems with processing 
 * commands that may be expected behaviour, but that need to be handled as errors for consistency. 
 * It doesn't do anything new, it's just to distinguish error types.
 */
CLIMachs.type.CommandError = class CommandError extends Error {

  // Constructor

    /**
     * @constructor
     * Constructor for CommandError objects. These are used to indicate non-critical exceptions in 
     * the process of handling command routing and execution.
     * @param  {string}       message A short description of the error.
     * @return {CommandError}         A CommandError instance.
     */
    constructor ( message ) {

      super( message );

    }

};


/**
 * @class
 * ConflictError is a subclass of Error for semantic purposes so denote a collision when attempting 
 * to map a command to a given signature because of existing subcommand signatures and/or aliases 
 * that are the same. 
 * It doesn't do anything new, it's just to distinguish error types.
 */
CLIMachs.type.ConflictError = class ConflictError extends Error {

  // Constructor

    /**
     * @constructor
     * Constructor for ConflictError objects. These are used to denote a collision when attempting 
     * to map a command to a given signature because of existing subcommand signatures and/or 
     * aliases that are the same.
     * @param  {string}       message A short description of the error.
     * @return {ConflictError}         A ConflictError instance.
     */
    constructor ( message ) {

      super( message );

    }

};


/**
 * @class
 * Middleware objects are used to keep track of middleware callbacks by giving them a key to 
 * identify them while stored in an array ordered by execution.
 */
CLIMachs.type.Middleware = class Middleware {

  // Constructor

    /**
     * @constructor
     * Constructor for Middleware objects. These are used to keep track of middleware callbacks by 
     * giving them a key to identify them while stored in an array ordered by execution.
     * @param  {string}     key      The identifier given to this middleware callback.
     * @param  {Function}   callback The callback function implementing the behaviour of the 
     *                               middleware. Function signature may vary by context of usage.
     * @return {Middleware}          A Middleware instance.
     */
    constructor ( key, callback ) {

      if ( typeof( callback ) !== 'function' ) {
        throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
      }
      if ( typeof( key ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
      }

      this.callback = callback;
      this.key = key;

    }

  // Fields

    /**
     * The callback function that implements the behaviour of the Middleware.
     * @type {Function}
     */
    get callback () { return this.callback; }

    /**
     * The identifier used to look this Middleware up on an array of several Middlewares.
     * @type {string}
     */
    get key () { return this.key; }

};


/**
 * @class
 * PermissionGroup objects are structurally the same as Middleware objects, so this is simply 
 * an alias to denote the difference in usage/meaning.
 */
CLIMachs.type.PermissionGroup = CLIMachs.type.Middleware;


/**
 * @class
 * Permissions objects are used to define a whitelist of conditions under which a message is 
 * allowed to execute a command belonging to the CLI.
 */
CLIMachs.type.Permissions = class Permissions {

  // Constructor

    /**
     * @constructor
     * Constructor for permissions objects. These are used to define a whitelist of conditions under 
     * under which a message is allowed to execute a command belonging to the CLI.
     * @return {Permissions} A Permissions instance.
     */
    constructor () {

      this.groups  = [];
      this.players = [];

    }

  // Fields

    /**
     * A list of PermissionGroups that are permitted to execute this command. Each PermissionGroup 
     * defines a callback that is tested when a user attempts to execute the relevant command, and 
     * if any PermissionGroup's callback returns true, then the user is permitted to execute the 
     * command. The GM is not included in this list as the GM is permitted to execute any command at 
     * any time.
     * @type {Array}
     */
    get groups () { return this.groups.slice(); }

    /**
     * A list of player IDs that represent players who have been granted full-time exclusive access 
     * to this command. This kind of permission granting should be reserved for co-GMs or helpers 
     * that need higher-level access to CLI commands than players do.
     * @type {Array}
     */
    get players () { return this.players.slice(); }

  // Functions

    /**
     * @function
     * Add a new (or overwrite an existing) permission group.
     * @param  {string}      groupName The name of the group to add permissions for.
     * @return {Permissions}           Returns itself to support function call chaining.
     */
    addGroup ( groupName ) {
      
      // Validate for invalid groupNames.
      if ( typeof( groupName ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
      }

      // Look up the permission group.
      const groupCallback = CLIMachs.cli.permissionGroups
        .find( callback => callback.key === groupName );

      // Reject invalid group names.
      if ( !groupCallback ) {
        throw new CLIMachs.type.CommandError( 'No permission group exists by that name!' );
      }

      // Create a new PermissionGroup object and add it to the __groups array. This will 
      // automatically overwrite any existing group at the given key, but a warning will 
      // be printed if so.
      const group = CLIMachs.type.PermissionGroup( groupName, groupCallback.callback );
      this.groups.addSortedByKey( 'key', group );

      // Return this to support function call chaining.
      return this;

    }


    /**
     * @function
     * Add a new (or overwrite an existing) player permission.
     * @param  {string}      playerName The name of the player to add permissions for.
     * @return {Permissions}            Returns itself to support function call chaining.
     */
    addPlayer ( playerName ) {
      
      // Validate for invalid playerNames.
      if ( typeof( playerName ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'playerName must be a valid string!' );
      }

      // Find the player ID for the given name. If no match exists, throw an Error.
      const playerId = CLIMachs.fn.getPlayerIdByName( playerName );
      if ( playerId < 0 ) {
        throw new CLIMachs.type.CommandError( `No player exists by that name (${ playerName }).` ); 
      }
      
      // Check if the player ID is already in the list.
      if ( this.players.find( playerId ) ) {
        throw new CLIMachs.type.CommandError( `${ playerName } already has permission to use ` + 
          `this command.` ); 
      }

      // Add the player ID to the list of allowed players IDs
      this.players
        .push( playerId )
        .sort();

      // Return this to support function call chaining.
      return this;

    }

    /**
     * @function
     * Remove an existing permission group. This will result in messages matching the removed group 
     * being disallowed from invoking the protected command unless the message matches something else.
     * @param  {string}      groupName The name of the group to remove permissions for.
     * @return {Permissions}           Returns itself to support function call chaining.
     */
    removeGroup ( groupName ) {
      
      // Validate for invalid groupNames.
      if ( typeof( groupName ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
      }

      // Look up the permission group.
      const groupCallback = CLIMachs.cli.permissionGroups
        .find( callback => callback.key === groupName );

      // Reject invalid group names.
      if ( !groupCallback ) {
        throw new CLIMachs.type.CommandError( `No permission group exists by that name ` + 
          `(${ groupName }).` );
      }

      // Try to remove the group.
      const wasRemoved = this.groups.removeByKey( 'key', groupName );
      if ( !wasRemoved ) {
        throw new CLIMachs.type.CommandError( `${ groupName } permissions are already enabled ` + 
          `for this command.` );
      }

      // Return this to support function call chaining.
      return this;

    }

    /**
     * @function
     * Remove an existing player permission. This will result in messages from the given user being 
     * disallowed from invoking the protected command unless the message matches something else.
     * @param  {string}      playerName The name of the player to remove permissions for.
     * @return {Permissions}            Returns itself to support function call chaining.
     */
    removePlayer ( playerName ) {
      
      // Validate for invalid playerNames.
      if ( typeof( playerName ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'playerName must be a valid string!' );
      }
      
      // Find the player ID for the given name. If no match exists, throw an Error.
      const playerId = CLIMachs.fn.getPlayerIdByName( playerName );
      if ( playerId < 0 ) {
        throw new CLIMachs.type.CommandError( `No player exists by that name (${ playerName }).` ); 
      }

      // Find the player ID in the list of allowed players. If it isn't found, return false.
      const playerIndex = this.players.findIndex( playerId );
      if ( playerIndex < 0 ) {
        throw new CLIMachs.type.CommandError( `${ playerName } doesn't have permission to use ` + 
          `this command.` );
      }

      // Remove the player ID from the list.
      this.players
        .splice( playerIndex, 1 );

      // Return this to support function call chaining.
      return this;

    }

    /**
     * @function
     * Test a message for access to the protected command.
     * @param  {Message} message A Roll20 Message received from the chat interface.
     * @return {Boolean}         Whether or not the message is permitted to execute the command.
     */
    test ( message ) {
      
      // Validate for invalid messages.
      if ( !message || !message.type || message.type !== 'api' ) {
        throw new CLIMachs.type.ArgumentError( 'message must be a valid Roll20 Message!' );
      }

      // Is the sender the GM?
      if ( playerIsGM( message.playerid ) ) {
        return true;
      }

      // Does the sender's player ID match any of the allowed player IDs?
      if ( this.players.find( message.playerid ) ) {
        return true;
      }

      // Does the sender belong to any of the allowed permission groups?
      return this.groups
        .reduce( ( allow, group ) => allow = allow || group.callback( message ), false );

    }

};


/**
 * @class
 * Command objects are used to define all aspects of a command that can be executed by a chat 
 * command through the CLI.
 */
CLIMachs.type.Command = class Command {

  // Constructor
  
    /**
     * @constructor
     * Constructor for Command objects. These are used to define all aspects of a command that can 
     * be executed by a chat command through the CLI.
     * @param  {string}   signature   The idiomatic text to match to execute this command
     * @param  {string}   description A short explanation of what the command does.
     * @param  {string}   syntax      A description of the syntax to use this command.
     * @param  {Function} callback    The callback function that implements the command behaviour.
     * @return {Command}              A Command instance.
     */
    constructor ( signature, description, syntax, callback ) {

      if ( typeof( callback ) !== 'function' ) {
        throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
      }
      if ( typeof( description ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'description must be a valid string!' );
      }
      if ( typeof( signature ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'signature must be a valid string!' );
      }
      if ( /[ '"]/g.test( signature ) ) {
        throw new CLIMachs.type.ArgumentError( 'signature must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }
      if ( typeof( syntax ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'syntax must be a valid string!' );
      }

      this.aliases     = [];
      this.callback    = callback;
      this.description = description;
      this.parent      = null;
      this.permissions = new CLIMachs.type.Permissions();
      this.signature   = signature;
      this.subcommands = [];
      this.syntax      = syntax;

    }

  // Fields

    /**
     * A list of aliases that will match for this command. While the signature of the command is 
     * the idiomatic name to call it by, any of the aliases will match it to allow the caller to
     * use short forms or allow the CLI to handle common misspellings.
     * @type {Array}
     */
    get aliases () { return this.aliases.slice(); }

    /**
     * The callback function it called by the CLI when this command when it is matched and executed.
     * @type {Function}
     */
    get callback () { return this.callback; }

    /**
     * A short description of the command to provide basic command discovery features and make it 
     * easier for users to understand what commands are available and what they do at a glance.
     * @type {string}
     */
    get description () { return this.description; }

    /**
     * The parent Command object that this command acts as a subcommand of (default: null, when 
     * the command is a top-level command i.e. not a subcommand).
     * @type {Permissions}
     */
    get parent () { return this.parent; }
    set parent ( value ) {
      if ( !( value instanceof CLIMachs.type.Command ) ) {
        throw new CLIMachs.type.ArgumentError( 'parent must be a valid Command object!' );
      }
      this.parent = value;
    }

    /**
     * The Permissions object that defines who is permitted to execute this command and when.
     * @type {Permissions}
     */
    get permissions () { return this.permissions; }

    /**
     * The idiomatic name of this command, considered the ideal match for this command at the CLI. 
     * If you would like to support this command under several different names/variants, use the 
     * aliases array to provide other options.
     * @type {string}
     */
    get signature () { return this.signature; }

    /**
     * A list of subcommands that this command supports. This is common for more advanced or 
     * powerful commands, so this gives scriptwriters the ability to use CLIMachs' command parsing 
     * systems to handle the subcommands as well and call callbacks for these subcommands directly.
     * @type {Array}
     */
    get subcommands () { return this.subcommands.slice(); }

    /**
     * An example of the syntax of this command, preferably in general form (like is presented in 
     * UNIX-style man pages).
     * @type {string}
     */
    get syntax () { return this.syntax; }

  // Computed Fields

    /**
     * A complete list of all aliases and/or signatures supported by this command, including all 
     * aliases and the primary signature.
     * @type {Array}
     */
    get allAliases () { 
      return this.aliases
        .concat( this.signature )
        .sort( CLIMachs.fn.currySortAlphabetical( false ) ); 
    }

    /**
     * Returns an string describing the idiomatic absolute signature of this command. 
     * @return {string} A string escribing the absolute signature of the command. 
     */
    get fullSignature () {
      return this.fullSignatureTokens.join( ' ' );
    }

    /**
     * Returns an array of tokens describing the idiomatic absolute signature of this command. 
     * @return {Array} An array of tokens describing the absolute signature of the command. 
     */
    @CLIMachs.decorator.enumerable( false )
    get fullSignatureTokens () {
      const result = [ this.signature ];
      if ( this.parent ) {
        result.unshift( this.parent.fullSignature );
      }
      return result;
    }

  // Functions

    /**
     * @function
     * Add an alias signature to enable another signature to call this command by.
     * @param  {string}  alias The signature of the alias to add.
     * @return {Command}       Returns itself to support function call chaining.
     */
    addAlias ( alias ) {
      
      // Validate for invalid aliases.
      if ( typeof( alias ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'alias must be a valid string!' );
      }
      if ( /[ '"]/g.test( alias ) ) {
        throw new CLIMachs.type.ArgumentError( 'alias must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }
      
      // Check if the alias is already in the list.
      if ( this.aliases.find( alias ) ) {
        throw new CLIMachs.type.CommandError( `The ${ alias } alias already exists.` );
      }

      // Add the alias to the list.
      this.aliases
          .push( alias )
          .sort( CLIMachs.fn.currySortAlphabetical( false ) );

      // Return this to support function call chaining.
      return this;

    }

    /**
     * @function
     * Adds a subcommand to extend the behaviour of this command.
     * @param  {Command} command The Command object representing the command to add as a subcommand.
     * @return {Command}         Returns itself to support function call chaining.
     */
    addSubcommand ( command ) {

      // Validate for invalid commands.
      if ( !( command instanceof CLIMachs.type.Command ) ) {
        throw new CLIMachs.type.ArgumentError( 'command must be a valid Command object!' );
      }

      // Check for any subcommand signatures and/or aliases that collide with the command to add.
      const collisions = this.subcommands
        .map( subcommand => subcommand.allAliases )
        .reduce( ( acc, sigArr ) => acc.concat( sigArr ), [] )
        .filter( signature => command.allAliases.find( signature ) )
        .sort( CLIMachs.fn.currySortAlphabetical( false ) );

      if ( collisions.length > 0 ) {
        throw new CLIMachs.type.ConflictError( `The ${ command.signature } subcommand collides` +  
          `with some existing command signatures/aliases! ${ collisions }` );
      }

      // Add the command to the subcommands array. This will automatically overwrite any existing 
      // subcommand with the same signature, but a warning will be printed if so.
      this.subcommands
        .addSortedByKey( 'signature', command );

      // Return this to support function call chaining.
      return this;

    }

    /**
     * @function
     * Remove an alias signature to disable another signature to call this command by.
     * @param  {string}  alias The signature of the alias to remove.
     * @return {Command}       Returns itself to support function call chaining.
     */
    removeAlias ( alias ) {
      
      // Validate for invalid aliases.
      if ( typeof( alias ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'alias must be a valid string!' );
      }
      if ( /[ '"]/g.test( alias ) ) {
        throw new CLIMachs.type.ArgumentError( 'alias must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }

      // Check if the alias is in the list.
      const aliasIndex = this.aliases.findIndex( alias );
      if ( aliasIndex < 0 ) {
        throw new CLIMachs.type.CommandError( `The ${ alias } alias could not be found.` );
      }

      // Remove the alias from the list.
      this.aliases
        .splice( aliasIndex, 1 );
      
      // Return this to support function call chaining.
      return true;
      
    }

    /**
     * @function
     * Removes a subcommand from this command by its signature (relative to this command).
     * @param  {string}  signature The signature of the command to be removed.
     * @return {Command}           Returns itself to support function call chaining.
     */
    removeSubcommand ( signature ) {
      
      // Validate for invalid signature.
      if ( typeof( signature ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'signature must be a valid string!' );
      }
      if ( /[ '"]/g.test( signature ) ) {
        throw new CLIMachs.type.ArgumentError( 'signature must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }

      // Try to remove the group.
      const wasRemoved = this.subcommands.removeByKey( 'signature', signature );
      if ( !wasRemoved ) {
        throw new CLIMachs.type.CommandError( `The ${ signature } subcommand could not be found.` );
      }
      
      // Return this to support function call chaining.
      return true;

    }

};


/**
 * @class
 * The CLI object should be used as a singleton. Tt is the entrypoint for all chat message commands 
 * to interface with the CLI and cause the execution of commands.
 */
CLIMachs.type.CLI = class CLI {

  // Constructors

    /**
     * Constructor for CLI objects. The CLI is effectively a singleton, as it is the entrypoint for 
     * all chat message commands to interface with the CLI and cause the execution of commands.
     * @return {CLI} A CLI instance.
     */
    constructor () {

      this.commands             = [];
      this.permissionGroups     = [];
      this.preCommandMiddleware = [];
      this.preRoutingMiddleware = [];

    }

  // Fields
  
    /**
     * The top-level list of commands available to users of the CLI.
     * @type {Array}
     */
    get commands () { return this.commands.slice(); }

    /**
     * A complete list of the valid permission groups that the CLI will use to validate messages.
     * @type {Array}
     */
    get permissionGroups () { return this.permissionGroups.slice(); }

    /**
     * An ordered list of middleware callbacks that run when any command is executed, just before 
     * the matched command is executed. These will only run if a command is matched.
     * @type {Array}
     */
    get preCommandMiddleware () { return this.preCommandMiddleware.slice(); }

    /**
     * An ordered list of middleware callbacks that run when any command is executed, just before 
     * the tokens are passed to the routing system. These will run if there are 1 or more tokens.
     * @type {Array}
     */
    get preRoutingMiddleware () { return this.preRoutingMiddleware.slice(); }

  // Computed Fields

    /**
     * Returns a flat array containing all of the commands in the CLI's lexicon, ordered 
     * alphabetically by signature then hierarchically, 
     * i.e. [ 'init', 'init add', 'init rm', 'perm' 'stat' ]
     * Note: This example shows signatures to explain, but an Array of Command objects is returned.
     * @type {Array}
     */
    get allCommands () {

      // This function is necessary to recurse through the command tree and flatten it into an 
      // array of commands. The base case occurs when a command has an empty subcommands array, 
      // since reduce will have nothing to iterate over, no deeper calls to recuse() will happen.
      function recurse ( acc, commands ) {
        return commands
          .reduce( ( acc, command ) => acc.concat( recurse( acc, command.subcommands ) ) );
      }
      return recurse( [], this.commands );

    }

  // Event Handlers

    /**
     * @function
     * Perform configuration tasks dependent upon the Roll20 ready event.
     */
    onReady () {

      // TODO

    }

  // Public Functions

    /**
     * @function
     * Adds a subcommand to extend the behaviour of this command.
     * @param  {Command} command The Command object to add as a command.
     * @return {CLI}             Returns itself to support function call chaining.
     */
    addCommand ( command ) {

      // Validate for invalid commands.
      if ( !( command instanceof CLIMachs.type.Command ) ) {
        throw new CLIMachs.type.ArgumentError( 'command must be a valid Command object!' );
      }

      // Check for any subcommand signatures and/or aliases that collide with the command to add.
      const collisions = this.commands
        .map( subcommand => subcommand.allAliases )
        .reduce( ( acc, sigArr ) => acc.concat( sigArr ), [] )
        .filter( signature => command.allAliases.find( signature ) )
        .sort( CLIMachs.fn.currySortAlphabetical( false ) );

      if ( collisions.length > 0 ) {
        throw new CLIMachs.type.ConflictError( `The ${ command.signature } command collides` +  
          `with existing command signatures/aliases! Remove the offending commands or alter` + 
          `the aliases of your command to avoid collisions. Collasions: ${ collisions }` );
      }

      // Add the command to the subcommands array. This will automatically overwrite any existing 
      // subcommand with the same signature, but a warning will be printed if so.
      this.subcommands
        .addSortedByKey( 'signature', command );

      // Return this to support function call chaining.
      return this;

    }

    /**
     * @function
     * Adds a permission group to the set of available groups.
     * @param  {string}   groupName The name of the new group to add.
     * @param  {Function} callback  A callback function to test whether a message belongs to this 
     *                              group, of the form: ( message ) => {}.
     */
    addPermissionGroup ( groupName, callback ) {
      
      // Validate inputs.
      if ( typeof( groupName ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
      }
      if ( /[ '"]/g.test( groupName ) ) {
        throw new CLIMachs.type.ArgumentError( 'groupName must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }
      if ( typeof( callback ) !== 'function' ) {
        throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
      }

      // Check for existing permission groups with the same name.
      const collisions = this.permissionGroups
        .map( group => group.key )
        .find( groupKey => groupKey === groupName )

      if ( collisions.length > 0 ) {
        throw new CLIMachs.type.ConflictError( `The ${ groupName } permission group already ` + 
          `exists! Remove it before adding another by the same name.` );
      }

      // Create a new PermissionGroup object (the PermissionGroup class is really just an alias 
      // for the Middleware class, so this is legit) and add it to the array.
      const middleware = new CLIMachs.type.PermissionGroup( key, callback );
      this.permissionGroups
        .addSortedByKey( 'key', middleware );

      // Return this to support function chaining.
      return this;

    }
     
    /**
     * @function
     * Add a middleware callback to run immediately before the matched command is executed. If 
     * beforeIndex is supplied, the middleware will be spliced into the middleware order 
     * at the given index, pushing all items after it ahead one place.
     * @param  {string}   key      The identifier to use later to remove the callback.
     * @param  {Function} callback The middleware callback function of the signature
     *                             ( tokens, message, Command ) => {}.
     * @param  {Number}   atIndex  The index to insert the middleware at (default: -1, interpreted 
     *                             as "add this middleware at the tail of the array").
     * @return {CLI}               Returns itself to support function chaining.
     */
    addPreCommandMiddleware ( key, callback, atIndex = -1 ) {
      
      // Validate inputs.
      if ( typeof( key ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
      }
      if ( /[ '"]/g.test( key ) ) {
        throw new CLIMachs.type.ArgumentError( 'key must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }
      if ( typeof( callback ) !== 'function' ) {
        throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
      }
      if ( typeof( atIndex ) !== 'number' ) {
        throw new CLIMachs.type.ArgumentError( 'atIndex must be a valid string!' );
      }
      if ( atIndex < -1 || atIndex >= this.preCommandMiddleware.length ) {
        throw new CLIMachs.type.ArgumentError( 'atIndex is out of range!' );
      }

      // Check for existing middleware with the same key.
      const collisions = this.preCommandMiddleware
        .map( mid => mid.key )
        .find( midKey => midKey === key );

      if ( collisions.length > 0 ) {
        throw new CLIMachs.type.ConflictError( `The ${ key } key is in use for another` + 
          `pre-command middleware! Remove it before adding another with the same key.` );
      }

      // Create a new Middleware object and add it to the array.
      const middleware = new CLIMachs.type.Middleware( key, callback );
      if ( atIndex === -1 ) {
        this.preCommandMiddleware
          .push( middleware );
      }
      else {
        this.preCommandMiddleware
          .splice( atIndex, 0, middleware );
      }

      // Return this to support function chaining.
      return this;

    }
        
    /**
     * @function
     * Add a middleware callback to run immediately before message routing is processed. If 
     * beforeIndex is supplied, the middleware will be spliced into the middleware order 
     * at the given index, pushing all items after it ahead one place.
     * @param  {string}   key      The identifier to use later to remove the callback.
     * @param  {Function} callback The middleware callback function of the signature
     *                             ( tokens, message ) => {}.
     * @param  {Number}   atIndex  The index to insert the middleware at (default: -1, interpreted 
     *                             as "add this middleware at the tail of the array").
     * @return {CLI}               Returns itself to support function chaining.
     */
    addPreRoutingMiddleware ( key, callback, atIndex = -1 ) {
      
      // Validate inputs.
      if ( typeof( key ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
      }
      if ( /[ '"]/g.test( key ) ) {
        throw new CLIMachs.type.ArgumentError( 'key must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }
      if ( typeof( callback ) !== 'function' ) {
        throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
      }
      if ( typeof( atIndex ) !== 'number' ) {
        throw new CLIMachs.type.ArgumentError( 'atIndex must be a valid string!' );
      }
      if ( atIndex < -1 || atIndex >= this.preRoutingMiddleware.length ) {
        throw new CLIMachs.type.ArgumentError( 'atIndex is out of range!' );
      }

      // Check for existing middleware with the same key.
      const collisions = this.preRoutingMiddleware
        .map( mid => mid.key )
        .find( midKey => midKey === key );

      if ( collisions.length > 0 ) {
        throw new CLIMachs.type.ConflictError( `The ${ key } key is in use for another` + 
          `pre-routing middleware! Remove it before adding another with the same key.` );
      }

      // Create a new Middleware object and add it to the array.
      const middleware = new CLIMachs.type.Middleware( key, callback );
      if ( atIndex === -1 ) {
        this.preRoutingMiddleware
          .push( middleware );
      }
      else {
        this.preRoutingMiddleware
          .splice( atIndex, 0, middleware );
      }

      // Return this to support function chaining.
      return this;

    }

    /**
     * @function
     * Removes a command from the CLI lexicon by its signature.
     * @param  {string}  signature The signature of the command to be removed.
     * @return {Command}           Returns itself to support function call chaining.
     */
    removeCommand ( signature ) {
      
      // Validate for invalid signatures.
      if ( typeof( signature ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'signature must be a valid string!' );
      }
      if ( /[ '"]/g.test( signature ) ) {
        throw new CLIMachs.type.ArgumentError( 'signature must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }

      // Try to remove the object by key.
      const wasRemoved = this.commands
        .removeByKey( 'signature', signature );
      
      if ( !wasRemoved ) {
        throw new CLIMachs.type.CommandError( `The ${ signature } command could not be found.` );
      }
      
      // Return this to support function call chaining.
      return true;

    }

    /**
     * @function
     * Removes a permission group from the set of available groups.
     * @param  {string}  groupName The key identifying the group to remove.
     * @return {Boolean}           Whether or not the Group was found and removed.
     */
    removePermissionGroup ( groupName ) {
      
      // Validate for invalid groupNames.
      if ( typeof( groupName ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
      }
      if ( /[ '"]/g.test( groupName ) ) {
        throw new CLIMachs.type.ArgumentError( 'groupName must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }


      // TODO Scour commands recursively for any references to this group.
      
      const dependentCommands = allCommands
        .filter( command => command.permissions.groups.find( groupName ) );

      // Try to remove the object by key.
      const wasRemoved = this.permissionGroups
        .removeByKey( 'key', groupName );
      
      if ( !wasRemoved ) {
        throw new Error( `The ${ groupName } permission group could not be found.` );
      }
      
      // Return this to support function call chaining.
      return true;

    }
        
    /**
     * @function
     * Remove a middleware that would run before before command execution using its key. 
     * @param  {string}  key The key identifying the middleware to remove.
     * @return {Command}     Returns itself to support function call chaining.
     */
    removePreCommandMiddleware ( key ) {
      
      // Validate for invalid keys.
      if ( typeof( key ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
      }
      if ( /[ '"]/g.test( key ) ) {
        throw new CLIMachs.type.ArgumentError( 'key must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }

      // Try to remove the object by key.
      const wasRemoved = this.preCommandMiddleware
        .removeByKey( 'key', key );
      
      if ( !wasRemoved ) {
        throw new Error( `The pre-command middleware identified by ${ key } could not be found.` );
      }
      
      // Return this to support function call chaining.
      return true;

    }
     
    /**
     * @function
     * Remove a middleware that would run before before message routing using its key. 
     * @param  {string}  key The key identifying the middleware to remove.
     * @return {Boolean}     Whether or not the Middleware was found and removed.
     */
    removePreRoutingMiddleware ( key ) {
      
      // Validate for invalid keys.
      if ( typeof( key ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
      }
      if ( /[ '"]/g.test( key ) ) {
        throw new CLIMachs.type.ArgumentError( 'key must not contain any spaces, ' + 
          'single-quotes or double-quotes!' );
      }

      // Try to remove the object by key.
      const wasRemoved = this.preRoutingMiddleware
        .removeByKey( 'key', key );
      
      if ( !wasRemoved ) {
        throw new Error( `The pre-routing middleware identified by ${ key } could not be found.` );
      }
      
      // Return this to support function call chaining.
      return true;

    }

    /**
     * @function
     * Given a tokenized command message, determine the command intended to be run and execute it.
     * @param  {Array}   tokens An array containing a command and any passed arguments.
     * @param  {Array}   head   Used for recursive calling. Stores tokens that have already been 
     *                          processed so they aren't lost as the tokens array shrinks.
     * @return {Command}        The matching Command, or null if no commands matched the input.
     */
    route ( tokens, head = [] ) {
      
      // Validate inputs.
      if ( !( tokens instanceof Array ) ) {
        throw new CLIMachs.type.ArgumentError( 'tokens must be a valid Array!' );
      }
      if ( tokens.filter( token => typeof( token ) !== 'string' ) > 0 ) {
        throw new CLIMachs.type.ArgumentError( 'tokens must contain only strings!' );
      }
      if ( !( head instanceof Array ) ) {
        throw new CLIMachs.type.ArgumentError( 'head must be a valid Array!' );
      }
      if ( head.filter( token => typeof( token ) !== 'string' ) > 0 ) {
        throw new CLIMachs.type.ArgumentError( 'head must contain only strings!' );
      }

      // TODO

    }

    /**
     * @function
     * Given the text message contents of a Roll20 Message object received from chat input, break 
     * in into an array containing a command and any passed arguments.
     * @param  {string} messageContents The message contents of the Roll20 Message object.
     * @return {Array}                  A series of string tokens representing a command and any 
     *                                  passed arguments that were parsed from the input string.
     */
    tokenize ( messageContents ) {
      
      // Validate for invalid strs.
      if ( typeof( messageContents ) !== 'string' ) {
        throw new CLIMachs.type.ArgumentError( 'messageContents must be a valid string!' );
      }

      // Tokenize the message by splitting by arguments then stripping starting and ending quotes 
      // from the matched tokens individually.
      // The String.match() pattern identifies arguments as (regex): 
      //    a) Any number of characters not containing spaces, single-quotes or double-quotes.
      //    b) Any number of characters (lazy) between single-quotes.
      //    c) Any number of characters (lazy) between double-quotes.
      return messageContents
        .match( /([^ '"]+|'.*?'|".*?")/g )
        .map( token => token.replace( /^['"]/g, '' ) )
        .map( token => token.replace( /['"]$/g, '' ) );

    }

};

// Store the CLI's state in the CLIMachs global.
CLIMachs.cli = CLIMachs.cli || new CLIMachs.type.CLI();

// Start up the CLI when the sandbox ready event is emitted.
on( 'ready', CLIMachs.cli.onReady );





/**
 * @function
 * Constructor for middleware objects. These are used to keep track of middleware callbacks by 
 * giving them a key to identify them while stored in an array ordered by execution.
 * @param  {string}     key      The identifier given to this middleware callback.
 * @param  {Function}   callback The callback function implementing the behaviour of the 
 *                               middleware. Function signature may vary by context of usage.
 * @return {Middleware}          A Middleware instance.
 */
// CLIMachs.type.Middleware = function Middleware ( key, callback ) {

//   // Validate Inputs

//     if ( typeof( callback ) !== 'function' ) {
//       throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
//     }
//     if ( typeof( key ) !== 'string' ) {
//       throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
//     }

//   // Fields

//     /**
//      * The callback function that implements the behaviour of the Middleware.
//      * @type {Function}
//      */
//     const __callback = callback;

//     /**
//      * The identifier used to look this Middleware up on an array of several Middlewares.
//      * @type {string}
//      */
//     const __key = key;

//   // External Property Definitions

//     let result = {};
//     Object.defineProperties( result, {

//       // Fields

//         callback: {
//           enumerable: true,
//           get: () => __callback
//         },

//         key: {
//           enumerable: true,
//           get: () => __key
//         }

//     } );
//     Object.seal( result );

//   return result;

// };


/**
 * @function
 * Constructor for permission group objects. Groups are structurally similar to Middleware objects, 
 * so this is simply an alias to denote the difference in usage/meaning.
 * @param  {string}   key      The identifier given to this middleware callback.
 * @param  {Function} callback The callback function implementing the behaviour of the middleware.
 *                             Expects a function matching the signature: ( message ) => {}.
 * @return {Middleware}        A Middleware instance.
 */
//CLIMachs.type.PermissionGroup = Middleware;


/**
 * @function
 * Constructor for permissions objects. These are used to define a whitelist of conditions under 
 * under which a message is allowed to execute a command belonging to the CLI.
 * @return {Permissions} A Permissions instance.
 */
// CLIMachs.type.Permissions = function Permissions () {

//   // Fields
  
//     /**
//      * A list of Groups that are permitted to execute this command. Each Group defines a callback 
//      * that is tested when a user attempts to execute the relevant command, and if any Group's
//      * callback returns true, then the user is permitted to execute the command. The GM is 
//      * not included in this list as the GM is permitted to execute any command at any time.
//      * @type {Array}
//      */
//     const __groups = [];

//     /**
//      * A list of player IDs that represent players who have been granted full-time exclusive access 
//      * to this command. This kind of permission granting should be reserved for co-GMs or helpers 
//      * that need higher-level access to CLI commands than players do.
//      * @type {Array}
//      */
//     const __players = [];

//   // Public Functions

//     /**
//      * @function
//      * Add a new (or overwrite an existing) permission group.
//      * @param  {string} groupName The name of the group to add permissions for.
//      */
//     function addGroup ( groupName ) {
      
//       // Validate for invalid groupNames.
//       if ( typeof( groupName ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
//       }

//       // Look up the permission group.
//       const groupCallback = CLIMachs.cli.permissionGroups
//         .find( callback => callback.key === groupName );

//       // Reject invalid group names.
//       if ( !groupCallback ) {
//         throw new CLIMachs.type.CommandError( 'No permission group exists by that name!' );
//       }

//       // Create a new Group object and add it to the __groups array. This will automatically 
//       // overwrite any existing group at the given key, but a warning will be printed if so.
//       const group = CLIMachs.type.Group( groupName, groupCallback.callback );
//       __groups.addSortedByKey( 'key', group );

//     }


//     /**
//      * @function
//      * Add a new (or overwrite an existing) player permission.
//      * @param  {string} playerName The name of the player to add permissions for.
//      */
//     function addPlayer ( playerName ) {
      
//       // Validate for invalid playerNames.
//       if ( typeof( playerName ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'playerName must be a valid string!' );
//       }

//       // Find the player ID for the given name. If no match exists, throw an Error.
//       const playerId = CLIMachs.fn.getPlayerIdByName( playerName );
//       if ( playerId < 0 ) {
//         throw new CLIMachs.type.CommandError( 'No player exists by that name!' ); 
//       }
      
//       // Add the player ID to the list of allowed players IDs, if it doesn't already exist.
//       if ( !__players.find( playerId ) ) {
//         __players
//           .push( playerId )
//           .sort();
//       }

//     }

//     /**
//      * @function
//      * Remove an existing permission group. This will result in messages matching the removed group 
//      * being disallowed from invoking the protected command unless the message matches something else.
//      * @param  {string}  groupName The name of the group to remove permissions for.
//      * @return {Boolean}           Whether or not the player was found and removed.
//      */
//     function removeGroup ( groupName ) {
      
//       // Validate for invalid groupNames.
//       if ( typeof( groupName ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
//       }

//       // Look up the permission group.
//       const groupCallback = CLIMachs.cli.permissionGroups
//         .find( callback => callback.key === groupName );

//       // Reject invalid group names.
//       if ( !groupCallback ) {
//         throw new CLIMachs.type.CommandError( 'No permission group exists by that name!' );
//       }

//       // Try to remove the group and return the result.
//       return __groups.removeByKey( groupName, false );

//     }

//     /**
//      * @function
//      * Remove an existing player permission. This will result in messages from the given user being 
//      * disallowed from invoking the protected command unless the message matches something else.
//      * @param  {string}  playerName The name of the player to remove permissions for.
//      * @return {Boolean}            Whether or not the player was found and removed.
//      */
//     function removePlayer ( playerName ) {
      
//       // Validate for invalid playerNames.
//       if ( typeof( playerName ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'playerName must be a valid string!' );
//       }
      
//       // Find the player ID for the given name. If no match exists, throw an Error.
//       const playerId = CLIMachs.fn.getPlayerIdByName( playerName );
//       if ( playerId < 0 ) {
//         throw new CLIMachs.type.CommandError( 'No player exists by that name!' ); 
//       }

//       // Find the player ID in the list of allowed players. If it isn't found, return false.
//       const playerIndex = __players.findIndex( playerId );
//       if ( playerIndex < 0 ) {
//         return false;
//       }

//       // Remove the player ID from the list and return true for success.
//       __players.splice( playerIndex, 1 );
//       return true;

//     }

//     /**
//      * @function
//      * Test a message for access to the protected command.
//      * @param  {Message} message A Roll20 Message received from the chat interface.
//      * @return {Boolean}         Whether or not the protected command can be invoked.
//      */
//     function test ( message ) {
      
//       // Validate for invalid messages.
//       if ( !message || !message.type || message.type !== 'api' ) {
//         throw new CLIMachs.type.ArgumentError( 'message must be a valid Roll20 Message!' );
//       }

//       // Is the sender the GM?
//       if ( playerIsGM( message.playerid ) ) {
//         return true;
//       }

//       // Does the sender's player ID match any of the allowed player IDs?
//       if ( __players.find( message.playerid ) ) {
//         return true;
//       }

//       // Does the sender belong to any of the allowed permission groups?
//       return __groups
//         .reduce( ( allow, group ) => allow = allow || group.callback( message ), false );

//     }

//   // External Property Definitions

//     let result = {};
//     Object.defineProperties( result, {

//       // Fields

//         groups: {
//           enumerable: true,
//           get: () => __groups.slice()
//         },

//         players: {
//           enumerable: true,
//           get: () => __players.slice()
//         },

//       // Functions

//         addGroup: {
//           enumerable: true,
//           value: addGroup
//         },

//         addPlayer: {
//           enumerable: true,
//           value: addPlayer
//         },

//         removeGroup: {
//           enumerable: true,
//           value: removeGroup
//         },

//         removePlayer: {
//           enumerable: true,
//           value: removePlayer
//         },

//         test : {
//           enumerable: true,
//           value: test
//         }

//     } );
//     Object.seal( result );

//   return result;

// };


/**
 * Constructor for Command objects. These are used to define all aspects of a command that can be 
 * executed by a chat command through the CLI.
 * @param  {string}   signature   The idiomatic text to match to execute this command
 * @param  {string}   description A short explanation of what the command does.
 * @param  {string}   syntax      A description of the syntax to use this command.
 * @param  {Function} callback    The callback function that implements the command behaviour.
 * @return {Command}              A Command instance.
 */
// CLIMachs.type.Command = function Command ( signature, description, syntax, callback ) {

//   // Validate Inputs

//     if ( typeof( callback ) !== 'function' ) {
//       throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
//     }
//     if ( typeof( description ) !== 'string' ) {
//       throw new CLIMachs.type.ArgumentError( 'description must be a valid string!' );
//     }
//     if ( typeof( signature ) !== 'string' ) {
//       throw new CLIMachs.type.ArgumentError( 'signature must be a valid string!' );
//     }
//     if ( typeof( syntax ) !== 'string' ) {
//       throw new CLIMachs.type.ArgumentError( 'syntax must be a valid string!' );
//     }

//   // Fields

//     /**
//      * A list of aliases that will match for this command. While the signature of the command is 
//      * the idiomatic name to call it by, any of the aliases will match it to allow the caller to
//      * use short forms or allow the CLI to handle common misspellings.
//      * @type {Array}
//      */
//     const __aliases = [];
    
//     /**
//      * The callback function it called by the CLI when this command when it is matched and executed.
//      * @type {Function}
//      */
//     const __callback = callback;

//     /**
//      * A short description of the command to provide basic command discovery features and make it 
//      * easier for users to understand what commands are available and what they do at a glance.
//      * @type {string}
//      */
//     const __description = description;

//     /**
//      * The Permissions object that defines who is permitted to execute this command and when.
//      * @type {Permissions}
//      */
//     const __permissions = CLIMachs.type.Permissions();

//     /**
//      * The idiomatic name of this command, considered the ideal match for this command at the CLI. 
//      * If you would like to support this command under several different names/variants, use the 
//      * __aliases array to provide other options.
//      * @type {string}
//      */
//     const __signature = signature;

//     /**
//      * A list of subcommands that this command supports. This is common for more advanced or powerful 
//      * commands, so this gives scriptwriters the ability to use CLIMachs' command parsing systems to 
//      * handle the subcommands as well and call callbacks for these subcommands directly.
//      * @type {Array}
//      */
//     const __subcommands = [];

//     /**
//      * An example of the syntax of this command, preferably in general form (like is presented in 
//      * UNIX-style man pages).
//      * @type {string}
//      */
//     const __syntax = syntax;

//   // Public Functions

//     /**
//      * @function
//      * Add an alias signature to enable another signature to call this command by.
//      * @param  {string} alias The signature of the alias to add.
//      */
//     function addAlias ( alias ) {
      
//       // Validate for invalid aliases.
//       if ( typeof( alias ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'alias must be a valid string!' );
//       }
      
//       // Add the alias to the list, if it doesn't already exist.
//       if ( !__aliases.find( alias ) ) {
//         __aliases
//           .push( alias )
//           .sort();
//       }

//     }

//     /**
//      * @function
//      * Adds a subcommand to extend the behaviour of this command.
//      * @param  {Command} command The Command object representing the command to add as a subcommand.
//      */
//     function addSubcommand ( command ) {

//       // Validate for invalid commands.
//       if ( !( command instanceof CLIMachs.type.Command ) ) {
//         throw new CLIMachs.type.ArgumentError( 'command must be a valid Command object!' );
//       }

//       // Check for conflicting aliases. This is a broad test to test if there is any reason at all 
//       // that we might encounter a name conflict, although a name conflict of this kind MIGHT not 
//       // be serious -- just annoying for certain users that use particular aliases.
//       const allAliases       = __aliases.concat( __signature );
//       const commandAliases   = command.aliases.concat( command.signature );
//       const duplicateAliases = commandAliases
//         .filter( alias => allAliases.find( alias ) );

//       if ( duplicateAliases.length > 0 ) {
//         log( `Warning! The ${ command.signature } subcommand contains conflicting command and/or 
//           alias signatures! ${ duplicateAliases }` );
//       }

//       // Add the command to the __subcommands array. This will automatically overwrite any existing 
//       // subcommand with the same signature, but a warning will be printed if so.
//       __subcommands.addSortedByKey( 'signature', command );

//     }

//     /**
//      * @function
//      * Remove an alias signature to disable another signature to call this command by.
//      * @param  {string}  alias The signature of the alias to remove.
//      * @return {Boolean}       Whether or not the alias was found and removed.
//      */
//     function removeAlias ( alias ) {
      
//       // Validate for invalid aliases.
//       if ( typeof( alias ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'alias must be a valid string!' );
//       }

//       // Find the alias in the list. If it isn't found, return false.
//       const aliasIndex = __aliases.findIndex( alias );
//       if ( aliasIndex < 0 ) {
//         return false;
//       }

//       // Remove the alias from the list and return true for success.
//       __aliases.splice( aliasIndex, 1 );
//       return true;
      
//     }

//     /**
//      * @function
//      * Removes a subcommand from this command by its signature (relative to this command).
//      * @param  {string}  signature The signature of the command to be removed.
//      * @return {Boolean}           Whether or not the command was found and removed.
//      */
//     function removeSubcommand ( signature ) {
      
//       // Validate for invalid signature.
//       if ( typeof( signature ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'signature must be a valid string!' );
//       }

//       // Look up the command by its signature.
//       const command = __subcommands
//         .find( command => command.signature === signature );

//       // Reject invalid signatures.
//       if ( !command ) {
//         throw new CLIMachs.type.CommandError( 'No subcommands match that signature!' );
//       }

//       // Try to remove the group and return the result.
//       return __subcommands.removeByKey( signature, false );

//     }

//   // External Property Definitions

//     let result = {};
//     Object.defineProperties( result, {

//       // Fields

//         aliases: {
//           enumerable: true,
//           get: () => __aliases.slice()
//         },

//         callback: {
//           enumerable: true,
//           get: () => __callback
//         },

//         description: {
//           enumerable: true,
//           get: () => __description
//         },

//         permissions: {
//           enumerable: true,
//           get: () => __permissions.slice()
//         },

//         signature: {
//           enumerable: true,
//           get: () => __signature
//         },

//         subcommands: {
//           enumerable: true,
//           get: () => __subcommands.slice()
//         },

//         syntax: {
//           enumerable: true,
//           get: () => __syntax
//         },

//       // Functions

//         addAlias: {
//           enumerable: true,
//           value: addAlias
//         },

//         addSubcommand: {
//           enumerable: true,
//           value: addSubcommand
//         },

//         removeAlias: {
//           enumerable: true,
//           value: removeAlias
//         },

//         removeSubcommand: {
//           enumerable: true,
//           value: removeSubcommand
//         }

//     } );
//     Object.seal( result );

//   return result;

// };


/**
 * Constructor for CLI objects. The CLI is effectively a singleton, as it is the entrypoint for all 
 * chat message commands to interface with the CLI and cause the execution of commands.
 * @return {CLI} A CLI instance.
 */
// CLIMachs.type.CLI = function CLI () {

//   // Fields
  
//     /**
//      * The top-level list of commands available to users of the CLI.
//      * @type {Array}
//      */
//     const __commands = [];


//     /**
//      * A complete list of the valid permission groups that the CLI will use to validate messages.
//      * @type {Array}
//      */
//     const __permissionGroups = [];

//     /**
//      * An ordered list of middleware callbacks that run when any command is executed, just before 
//      * the matched command is executed. These will only run if a command is matched.
//      * @type {Array}
//      */
//     const __preCommandMiddleware = [];

//     /**
//      * An ordered list of middleware callbacks that run when any command is executed, just before 
//      * the tokens are passed to the routing system. These will run if there are 1 or more tokens.
//      * @type {Array}
//      */
//     const __preRoutingMiddleware = [];

//   // Public Functions

//     /**
//      * Adds a command to the CLI lexicon. This will automatically overwrite any command that 
//      * matches the same signature, but will log a warning if an overwrite takes place.
//      * @param  {Command} The Command object representing the command to add as a subcommand.
//      */
//     function addCommand ( command ) {

//       // Validate for invalid commands.
//       if ( !( command instanceof CLIMachs.type.Command ) ) {
//         throw new CLIMachs.type.ArgumentError( 'command must be a valid Command object!' );
//       }

//       // TODO

//     }

//     /**
//      * Adds a permission group to the set of available groups. This will automatically overwrite 
//      * any group that has the same key, but will log a warning if an overwrite takes place.
//      * @param  {string}   groupName The name of the new group to add.
//      * @param  {Function} callback  A callback function to test whether a message belongs to this 
//      *                              group, of the form: ( message ) => {}.
//      */
//     function addPermissionGroup ( groupName, callback ) {
      
//       // Validate inputs.
//       if ( typeof( groupName ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
//       }
//       if ( typeof( callback ) !== 'function' ) {
//         throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
//       }

//       // TODO

//     }
     
//     /**
//      * Add a middleware callback to run immediately before the matched command is executed. If 
//      * beforeIndex is supplied, the middleware will be spliced into the middleware order 
//      * at the given index, pushing all items after it ahead one place.
//      * @param {string}   key      The identifier to use later to remove the callback.
//      * @param {Function} callback The middleware callback function of the signature
//      *                            ( tokens, message, Command ) => {}.
//      * @param {Number}   atIndex  The index to insert the middleware at (default: -1).
//      */
//     function addPreCommandMiddleware ( key, callback, atIndex = -1 ) {
      
//       // Validate inputs.
//       if ( typeof( key ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
//       }
//       if ( typeof( callback ) !== 'function' ) {
//         throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
//       }
//       if ( typeof( atIndex ) !== 'number' ) {
//         throw new CLIMachs.type.ArgumentError( 'atIndex must be a valid string!' );
//       }
//       if ( atIndex < -1 || atIndex >= __preCommandMiddleware.length ) {
//         throw new CLIMachs.type.ArgumentError( 'atIndex is out of range!' );
//       }

//       // TODO

//     }
        
//     /**
//      * Add a middleware callback to run immediately before message routing is processed. If 
//      * beforeIndex is supplied, the middleware will be spliced into the middleware order 
//      * at the given index, pushing all items after it ahead one place.
//      * @param {string}   key      The identifier to use later to remove the callback.
//      * @param {Function} callback The middleware callback function of the signature
//      *                            ( tokens, message ) => {}.
//      * @param {Number}   atIndex  The index to insert the middleware at (default: -1).
//      */
//     function addPreRoutingMiddleware ( key, callback, atIndex = -1 ) {
      
//       // Validate inputs.
//       if ( typeof( key ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
//       }
//       if ( typeof( callback ) !== 'function' ) {
//         throw new CLIMachs.type.ArgumentError( 'callback must be a valid function!' );
//       }
//       if ( typeof( atIndex ) !== 'number' ) {
//         throw new CLIMachs.type.ArgumentError( 'atIndex must be a valid string!' );
//       }
//       if ( atIndex < -1 || atIndex >= __preCommandMiddleware.length ) {
//         throw new CLIMachs.type.ArgumentError( 'atIndex is out of range!' );
//       }

//       // TODO

//     }

//     /**
//      * Perform configuration tasks dependent upon the Roll20 ready event.
//      */
//     function onReady () {

//       // TODO

//     }

//     /**
//      * Removes a command from the CLI lexicon by its signature.
//      * @param  {string}  signature The signature of the command to be removed.
//      * @return {Boolean}           Whether or not the Command was found and removed.
//      */
//     function removeCommand ( signature ) {
      
//       // Validate for invalid signatures.
//       if ( typeof( signature ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'signature must be a valid string!' );
//       }

//       // TODO

//     }

//     *
//      * Removes a permission group from the set of available groups.
//      * @param  {string}  groupName The key identifying the group to remove.
//      * @return {Boolean}           Whether or not the Group was found and removed.
     
//     function removePermissionGroup ( groupName ) {
      
//       // Validate for invalid groupNames.
//       if ( typeof( groupName ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
//       }

//       // TODO

//     }
        
//     /**
//      * Remove a middleware that would run before before command execution using its key. 
//      * @param  {string}  key The key identifying the middleware to remove.
//      * @return {Boolean}     Whether or not the Middleware was found and removed.
//      */
//     function removePreCommandMiddleware ( key ) {
      
//       // Validate for invalid keys.
//       if ( typeof( key ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
//       }

//       // TODO

//     }
     
//     /**
//      * Remove a middleware that would run before before message routing using its key. 
//      * @param  {string}  key The key identifying the middleware to remove.
//      * @return {Boolean}     Whether or not the Middleware was found and removed.
//      */
//     function removePreRoutingMiddleware ( key ) {
      
//       // Validate for invalid keys.
//       if ( typeof( key ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
//       }

//       // TODO

//     }

//     /**
//      * Given a tokenized command message, determine the command intended to be run and execute it.
//      * @param  {Array}   tokens An array containing a command and any passed arguments.
//      * @param  {Array}   head   Used for recursive calling. Stores tokens that have already been 
//      *                          processed so they aren't lost as the tokens array shrinks.
//      * @return {Command}        The matching Command, or null if no commands matched the input.
//      */
//     function route ( tokens, head = [] ) {
      
//       // Validate inputs.
//       if ( !( tokens instanceof Array ) ) {
//         throw new CLIMachs.type.ArgumentError( 'tokens must be a valid Array!' );
//       }
//       if ( tokens.filter( token => typeof( token ) !== 'string' ) > 0 ) {
//         throw new CLIMachs.type.ArgumentError( 'tokens must contain only strings!' );
//       }
//       if ( !( head instanceof Array ) ) {
//         throw new CLIMachs.type.ArgumentError( 'head must be a valid Array!' );
//       }
//       if ( head.filter( token => typeof( token ) !== 'string' ) > 0 ) {
//         throw new CLIMachs.type.ArgumentError( 'head must contain only strings!' );
//       }

//       // TODO

//     }

//     /**
//      * Given a Roll20 Message object received as chat input, break in into an array containing a 
//      * command and any passed arguments.
//      * @param  {string} str The message contents of the Roll20 Message object.
//      * @return {Array}      A series of string tokens representing a command and any passed 
//      *                      arguments that were parsed from the input string.
//      */
//     function tokenize ( str ) {
      
//       // Validate for invalid strs.
//       if ( typeof( str ) !== 'string' ) {
//         throw new CLIMachs.type.ArgumentError( 'str must be a valid string!' );
//       }

//       // Tokenize the message by splitting by arguments then stripping starting and ending quotes 
//       // from the matched tokens individually.
//       // The String.match() pattern identifies arguments as (regex): 
//       //    a) Any number of characters not containing spaces, single-quotes or double-quotes.
//       //    b) Any number of characters (lazy) between single-quotes.
//       //    c) Any number of characters (lazy) between double-quotes.
//       return str
//         .match( /([^ '"]+|'.*?'|".*?")/g )
//         .map( token => token.replace( /^['"]/g, '' ) )
//         .map( token => token.replace( /['"]$/g, '' ) );

//     }

//   // External Property Definitions

//     let result = {};
//     Object.defineProperties( result, {

//       // Fields

//         commands: {
//           enumerable: true,
//           get: () => __commands.slice()
//         },

//         permissionGroups: {
//           enumerable: true,
//           get: () => __permissionGroups.slice()
//         },

//         preCommandMiddleware: {
//           enumerable: true,
//           get: () => __preCommandMiddleware.slice()
//         },

//         preRoutingMiddleware: {
//           enumerable: true,
//           get: () => __preRoutingMiddleware.slice()
//         },

//       // Functions

//         addCommand: {
//           enumerable: true,
//           value: addCommand
//         },

//         addPermissionGroup: {
//           enumerable: true,
//           value: addPermissionGroup
//         },

//         addPreCommandMiddleware: {
//           enumerable: true,
//           value: addPreCommandMiddleware
//         },

//         addPreRoutingMiddleware: {
//           enumerable: true,
//           value: addPreRoutingMiddleware
//         },

//         onReady: {
//           enumerable: true,
//           value: onReady
//         },

//         removeCommand: {
//           enumerable: true,
//           value: removeCommand
//         },

//         removePermissionGroup: {
//           enumerable: true,
//           value: removePermissionGroup
//         },

//         removePreCommandMiddleware: {
//           enumerable: true,
//           value: removePreCommandMiddleware
//         },

//         removePreRoutingMiddleware: {
//           enumerable: true,
//           value: removePreRoutingMiddleware
//         },

//         route: {
//           enumerable: true,
//           value: route
//         },

//         tokenize: {
//           enumerable: true,
//           value: tokenize
//         }

//     } );
//     Object.seal( result );

//   return result;

// };
