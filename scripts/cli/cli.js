
/**
 * @class
 * CommandError is a subclass of Error for semantic purposes so denote problems with processing 
 * commands that may be expected behaviour, but that need to be handled as errors for consistency. 
 * It doesn't do anything new, it's just to distinguish error types.
 */
CLIMachs.type.CommandError = 
  class extends Error {

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
 * CommandPermissions objects are used to define a whitelist of conditions under which a message is 
 * allowed to execute a command belonging to the CLI.
 */
CLIMachs.type.CommandPermissions = 
  class {

    // Constructor

      /**
       * @constructor
       * Constructor for CommandPermissions objects. These are used to define a whitelist of 
       * conditions under under which a message is allowed to execute a command belonging to the CLI.
       * @return {CommandPermissions} A CommandPermissions instance.
       */
      constructor ( command ) {

        if ( !( command instanceof CLIMachs.type.Command ) ) {
          throw new CLIMachs.type.ArgumentError( 'command must be a valid Command object!' );
        }

        this.command = command;
        this.groups  = new CLIMachs.type.UniqueKeyedCollection( 
          'key', CLIMachs.fn.currySortAlphabeticalByKey( 'key' ) 
        );
        this.players = new CLIMachs.type.UniqueCollection( 
          CLIMachs.fn.currySortAlphabetical() 
        );

      }

    // Fields

      /**
       * The Command object guarded by this CommandPermissions object.
       * @type {Command}
       */
      get command () { return this.command; }

      /**
       * A list of PermissionGroups that are permitted to execute this command. Each PermissionGroup 
       * defines a callback that is tested when a user attempts to execute the relevant command, and 
       * if any PermissionGroup's callback returns true, then the user is permitted to execute the 
       * command. The GM is not included in this list as the GM is permitted to execute any command at 
       * any time. Note: This getter returns a shallow copy of the data array, so operating on it will 
       * not affect the collection.
       * @type {Array}
       */
      get groups () { return this.groups.data; }

      /**
       * A list of player IDs that represent players who have been granted full-time exclusive access 
       * to this command. This kind of permission granting should be reserved for co-GMs or helpers 
       * that need higher-level access to CLI commands than players do. Note: This getter returns a 
       * shallow copy of the data array, so operating on it will not affect the collection.
       * @type {Array}
       */
      get players () { return this.players.data; }

    // Public Functions

      /**
       * @function
       * Add a new (or overwrite an existing) permission group.
       * @param  {string}             groupName The name of the group to add permissions for.
       * @return {CommandPermissions}           Returns itself to support function call chaining.
       */
      addGroup ( groupName ) {
        
        if ( typeof( groupName ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
        }

        // Reject invalid group names.
        const groupCallback = CLIMachs.cli.permissionGroups.find( x => x.key === groupName );
        if ( !groupCallback ) {
          throw new CLIMachs.type.CommandError( 'No permission group exists by that name!' );
        }

        // Create a new Callback object and try to add it to the groups array. 
        const group = CLIMachs.type.Callback( groupName, groupCallback.callback );
        try { 
          this.groups.add( group ); 
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.ConflictError ) {
            e.message = `The "${ groupName }" group already has permission to execute the ` +
             `"${ this.command.fullSignature }" command, so it cannot be added.`;
          }
          throw e;
        }

        // Return this to support function call chaining.
        return this;

      }


      /**
       * @function
       * Add a new (or overwrite an existing) player permission.
       * @param  {string}             playerName The name of the player to add permissions for.
       * @return {CommandPermissions}            Returns itself to support function call chaining.
       */
      addPlayer ( playerName ) {
        
        if ( typeof( playerName ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'playerName must be a valid string!' );
        }

        // Find the player ID for the given name. If no match exists, throw an Error.
        const playerId = CLIMachs.fn.getPlayerIdByName( playerName );
        if ( playerId < 0 ) {
          throw new CLIMachs.type.CommandError( `No player exists by that name (${ playerName }).` ); 
        }

        // Try to add the player ID to the players array.
        try {
          this.players.add( playerId );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.ConflictError ) {
            e.message = `${ playerName } already has permission to execute the ` +
             `"${ this.command.fullSignature }" command, so they cannot be added.`;
          }
          throw e;
        }

        // Return this to support function call chaining.
        return this;

      }

      /**
       * @function
       * Remove an existing permission group. This will result in messages matching the removed group 
       * being disallowed from invoking the protected command unless the message matches something else.
       * @param  {string}             groupName The name of the group to remove permissions for.
       * @return {CommandPermissions}           Returns itself to support function call chaining.
       */
      removeGroup ( groupName ) {
        
        if ( typeof( groupName ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'groupName must be a valid string!' );
        }

        // Reject invalid group names.
        const groupCallback = CLIMachs.cli.permissionGroups.find( x => x.key === groupName );
        if ( !groupCallback ) {
          throw new CLIMachs.type.CommandError( `No permission group exists by that name ` + 
            `(${ groupName }).` );
        }

        // Try to remove the group.
        try {
          this.groups.remove( groupName );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.NotFoundError ) {
            e.message = `The "${ groupName }" doesn't have permission to execute the ` + 
              `"${ this.command.fullSignature }" command, so it cannot be removed.`;
          }
          throw e;
        }

        // Return this to support function call chaining.
        return this;

      }

      /**
       * @function
       * Remove an existing player permission. This will result in messages from the given user being 
       * disallowed from invoking the protected command unless the message matches something else.
       * @param  {string}             playerName The name of the player to remove permissions for.
       * @return {CommandPermissions}            Returns itself to support function call chaining.
       */
      removePlayer ( playerName ) {
        
        if ( typeof( playerName ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'playerName must be a valid string!' );
        }
        
        // Find the player ID for the given name. If no match exists, throw an Error.
        const playerId = CLIMachs.fn.getPlayerIdByName( playerName );
        if ( playerId < 0 ) {
          throw new CLIMachs.type.NotFoundError( `No player exists by that name (${ playerName }).` ); 
        }

        // Try to remove the player.
        try {
          this.players.remove( playerId );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.NotFoundError ) {
            e.message = `${ playerName } doesn't have permission to execute the ` + 
              `"${ this.command.fullSignature }" command, so they cannot be removed.`;
          }
          throw e;
        }

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
        
        if ( !message || message.type !== 'api' ) {
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
          .reduce( ( allow, group ) => allow = allow || group.fn( message ), false );

      }

  };


/**
 * @class
 * CommandResponse objects are used to structure chat message responses when commands either 
 * complete or fail. They contain information such as text, who to send it to, who to send it as, 
 * and potentially special styling information for HTML-formatted chat messages.
 */
CLIMachs.type.CommandResponse = 
  class {

    // Constructor

      /**
       * Creates a new CommandResponse.
       * @param  {Message}         message   The Roll20 chat message that this CommandResponse 
       *                                     is responding to.
       * @param  {string|Array}    text      The text of the response (can contain HTML or 
       *                                     or markdown as per the Roll20 chat docs). If an 
       *                                     array is passed, each string in the array is a 
       *                                     line of text, separated by line breaks.
       * @param  {string}          recipient The intended recipient(s) of this message. Valid 
       *                                     options are: [ 'gm', 'all', 'self' ] or a player's
       *                                     name to whisper to.
       * @param  {string}          style     Inline style rules to be used in HTML output.
       * @param  {string}          speaker   A name for the response text to be spoken as.
       * @return {CommandResponse}           A CommandResponse instance.
       */
      constructor ( message, text, recipient, style = '', speaker = 'CLIMachs' ) {

        if ( !message || message.type !== 'api' ) {
          throw new CLIMachs.type.ArgumentError( 'message must be a valid Roll20 chat message!' );
        }
        if ( typeof( recipient ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'recipient must be a valid string!' );
        }
        if ( typeof( speaker ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'speaker must be a valid string!' );
        }
        if ( typeof( style ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'style must be a valid string!' );
        }
        if ( typeof( text ) !== 'string' && !( text instanceof Array ) ) {
          throw new CLIMachs.type.ArgumentError( 'text must be a valid string or Array!' );
        }

        this.message   = message;
        this.recipient = recipient;
        this.speaker   = speaker;
        this.style     = style;
        this.text      = text;

      }

    // Fields

      /**
       * The Roll20 message to which this CommandResponse is responding.
       * @type {Message}
       */
      get message () { return this.message; }

      /**
       * The intended recipient of this message. Valid options are: [ 'gm', 'all', 'self' ] or a 
       * player's name to whisper to.
       * @type {string}
       */
      get recipient () { return this.recipient; }
      set recipient ( value ) { 
        if ( typeof( recipient ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'recipient must be a valid string!' );
        }
        this.recipient = value; 
      }

      /**
       * A name for the response text to be spoken as.
       * @type {string}
       */
      get speaker () { return this.speaker; }
      set speaker ( value ) { 
        if ( typeof( speaker ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'speaker must be a valid string or Array!' );
        }
        this.speaker = value; 
      }

      /**
       * Inline style rules to be used in HTML output.
       * @type {string}
       */
      get style () { return this.style; }
      set style ( value ) { 
        if ( typeof( style ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'style must be a valid string!' );
        }
        this.style = value; 
      }

      /**
       * The text of the response (can contain HTML or or markdown as per the Roll20 chat docs).
       * @type {string|Array}
       */
      get text () { return this.text; }
      set text ( value ) { 
        if ( typeof( value ) !== 'string' && !( value instanceof Array ) ) {
          throw new CLIMachs.type.ArgumentError( 'text must be a valid string or Array!' );
        }
        this.text = value; 
      }

  };


/**
 * @class
 * Command objects are used to define all aspects of a command that can be executed by a chat 
 * command through the CLI.
 */
CLIMachs.type.Command = 
  class {

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
        if ( !/['"]/g.test( signature ) ) {
          throw new CLIMachs.type.ArgumentError( 'signature must not contain any ' + 
            'single-quotes or double-quotes!' );
        }
        if ( typeof( syntax ) !== 'string' ) {
          throw new CLIMachs.type.ArgumentError( 'syntax must be a valid string!' );
        }

        this.aliases     = new CLIMachs.type.UniqueCollection(
          CLIMachs.fn.currySortAlphabetical()
        );
        this.callback    = callback;
        this.description = description;
        this.parent      = null;
        this.permissions = new CLIMachs.type.CommandPermissions();
        this.signature   = signature;
        this.subcommands = new CLIMachs.type.UniqueKeyedCollection(
          'signature', CLIMachs.fn.currySortAlphabeticalByKey( 'signature' )
        );
        this.syntax      = syntax;

      }

    // Fields

      /**
       * A list of aliases that will match for this command. While the signature of the command is 
       * the idiomatic name to call it by, any of the aliases will match it to allow the caller to
       * use short forms or allow the CLI to handle common misspellings. Note: This getter returns 
       * a shallow copy of the data array, so operating on it will not affect the collection.
       * @type {Array}
       */
      get aliases () { return this.aliases.data; }

      /**
       * The callback function it called by the CLI when this command when it is matched and executed.
       * Expects a function of the form: ( argumentTokens, message ) => {} : string.
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
       * @type {CommandPermissions}
       */
      get parent () { return this.parent; }
      set parent ( value ) {
        if ( !( value instanceof CLIMachs.type.Command ) ) {
          throw new CLIMachs.type.ArgumentError( 'parent must be a valid Command object!' );
        }
        this.parent = value;
      }

      /**
       * The CommandPermissions object that defines who is permitted to execute this command and when.
       * @type {CommandPermissions}
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
       * Note: This getter returns a shallow copy of the data array, so operating on it will not 
       * affect the collection.
       * @type {Array}
       */
      get subcommands () { return this.subcommands.data; }

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
          .sort( CLIMachs.fn.currySortAlphabetical() ); 
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
      get fullSignatureTokens () {
        const result = [ this.signature ];
        if ( this.parent ) {
          result.unshift( this.parent.fullSignature );
        }
        return result;
      }

    // Public Functions

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
        if ( !/['"]/g.test( alias ) ) {
          throw new CLIMachs.type.ArgumentError( 'alias must not contain any ' + 
            'single-quotes or double-quotes!' );
        }

        // Try to add the alias to the list.
        try {
          this.aliases.add( alias );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.ConflictError ) {
            e.message = `The ${ alias } alias already exists, so it cannot be added.`;
          }
          throw e;
        }

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

        if ( !( command instanceof CLIMachs.type.Command ) ) {
          throw new CLIMachs.type.ArgumentError( 'command must be a valid Command object!' );
        }

        // Check for any subcommand signatures and/or aliases that collide with the command to add.
        const collisions = this.subcommands
          .map( subcommand => subcommand.allAliases )
          .reduce( ( acc, sigArr ) => acc.concat( sigArr ), [] )
          .filter( signature => command.allAliases.find( signature ) )
          .sort( CLIMachs.fn.currySortAlphabetical() );

        if ( collisions.length > 0 ) {
          throw new CLIMachs.type.ConflictError( `The "${ command.signature }" subcommand collides` +  
            `with some existing command signatures/aliases, so it cannot be added! Commands: ` + 
            `${ collisions }` );
        }

        // Assign this command as the parent of the subcommand to be added. This VERY IMPORTANT to 
        // make it possible to trace back up the tree for other commands.
        command.parent = this;

        // Try to add the command to the subcommands array.
        try {
          this.subcommands.add( command );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.ConflictError ) {
            e.message = `The "${ command.signature }" subcommand already exists, so it cannot ` + 
              `be added.`;
          }
          throw e;
        }

        // Return this to support function call chaining.
        return this;

      }

      /**
       * @function
       * Tests the message's permissions to execute this command, then calls the callback if the 
       * CommandPermissions object grants access.
       * @param  {Array}           argumentTokens A tokenized array of arguments for the command to 
       *                                          process.
       * @param  {Message}         message        The Roll20 API Message object received from chat 
       *                                          input.
       * @return {CommandResponse}                The response to send via the chat system.
       */
      execute ( argumentTokens, message ) {

        // Test permissions.
        if ( !this.permissions.test( message ) ) {
          throw new CLIMachs.test.CommandError( 'You do not have permission to execute the ' + 
            'requsted command.' );
        }

        // Execute the command and return a Response.
        return this.callback( arguments, message );

      }

      /**
       * @function
       * Remove an alias signature to disable another signature to call this command by.
       * @param  {string}  alias The signature of the alias to remove.
       * @return {Command}       Returns itself to support function call chaining.
       */
      removeAlias ( alias ) {

        // Try to remove the alias from the list.
        try {
          this.aliases.remove( alias );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.NotFoundError ) {
            e.message = `The ${ alias } alias could not be found, so it cannot be removed.`;
          }
          throw e;
        }
        
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

        // Try to remove the subcommand from the list.
        try {
          this.subcommands.remove( signature );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.NotFoundError ) {
            e.message = `The ${ signature } subcommand could not be found, so it cannot be ` + 
              `removed.`;
          }
          throw e;
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
CLIMachs.type.CLI = 
  class {

    // Constructors

      /**
       * Constructor for CLI objects. The CLI is effectively a singleton, as it is the entrypoint for 
       * all chat message commands to interface with the CLI and cause the execution of commands.
       * @return {CLI} A CLI instance.
       */
      constructor () {

        this.commands = new CLIMachs.type.UniqueKeyCollection(
          'signature', CLIMachs.fn.currySortAlphabeticalByKey( 'signature' ) 
        );
        this.permissionGroups = new CLIMachs.type.UniqueKeyCollection(
          'key', CLIMachs.fn.currySortAlphabeticalByKey( 'key' )
        );
        this.preCommandMiddleware  = new CLIMachs.type.UniqueKeyCollection( 'key', null );
        this.preResponseMiddleware = new CLIMachs.type.UniqueKeyCollection( 'key', null );
        this.preRoutingMiddleware  = new CLIMachs.type.UniqueKeyCollection( 'key', null );

      }

    // Fields
    
      /**
       * The top-level list of commands available to users of the CLI. Note: This getter returns a 
       * shallow copy of the data array, so operating on it will not affect the collection.
       * @type {Array}
       */
      get commands () { return this.commands.data; }

      /**
       * A complete list of the valid permission groups that the CLI will use to validate messages. 
       * Note: This getter returns a shallow copy of the data array, so operating on it will not 
       * affect the collection.
       * @type {Array}
       */
      get permissionGroups () { return this.permissionGroups.data; }

      /**
       * An ordered list of middleware callbacks that run when any command is executed, just before 
       * the matched command is executed. These will only run if a command is matched. Note: This 
       * getter returns a shallow copy of the data array, so operating on it will not affect the 
       * collection.
       * @type {Array}
       */
      get preCommandMiddleware () { return this.preCommandMiddleware.data; }

      /**
       * An ordered list of middleware callbacks that run when any command is executed, just before 
       * a response is returned to the caller. These will run only if the command executes to 
       * completion without errors. Note: This getter returns a shallow copy of the data array, so 
       * operating on it will not affect the collection.
       * @type {Array}
       */
      get preResponseMiddleware () { return this.preResponseMiddleware.data; }

      /**
       * An ordered list of middleware callbacks that run when any command is executed, just before 
       * the tokens are passed to the routing system. These will run if there are 1 or more tokens.
       * Note: This getter returns a shallow copy of the data array, so operating on it will not 
       * affect the collection.
       * @type {Array}
       */
      get preRoutingMiddleware () { return this.preRoutingMiddleware.data; }

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

    // Public Functions

      /**
       * @function
       * Adds a subcommand to extend the behaviour of this command.
       * @param  {Command} command The Command object to add as a command.
       * @return {CLI}             Returns itself to support function call chaining.
       */
      addCommand ( command ) {

        if ( !( command instanceof CLIMachs.type.Command ) ) {
          throw new CLIMachs.type.ArgumentError( 'command must be a valid Command object!' );
        }

        // Check for any subcommand signatures and/or aliases that collide with the command to add.
        const collisions = this.commands
          .map( subcommand => subcommand.allAliases )
          .reduce( ( acc, sigArr ) => acc.concat( sigArr ), [] )
          .filter( signature => command.allAliases.find( signature ) )
          .sort( CLIMachs.fn.currySortAlphabetical() );

        if ( collisions.length > 0 ) {
          throw new CLIMachs.type.ConflictError( `The ${ command.signature } command collides` +  
            `with existing command signatures/aliases, so it cannot be added! Commands: ` + 
            `${ collisions }` );
        }

        // Assign this parent of the command null, since it's being added at the top-level. 
        // This VERY IMPORTANT to make it possible to trace back up the tree for other commands.
        command.parent = null;

        // Try to add the command to the commands array.
        try {
          this.commands.add( command );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.ConflictError ) {
            e.message = `The "${ command.signature }" subcommand already exists, so it cannot ` + 
              `be added.`;
          }
          throw e;
        }

        // Return this to support function call chaining.
        return this;

      }

      /**
       * @function
       * Adds a permission group to the set of available groups.
       * @param  {string}   groupName The name of the new group to add.
       * @param  {Function} callback  A callback function to test whether a message belongs to this 
       *                              group, of the form: ( message ) => {} : Boolean.
       */
      addPermissionGroup ( groupName, callback ) {
        
        // Create a new Callback object and try to add it to the pre-command middleware collection.
        try {
          const middleware = new CLIMachs.type.Callback( groupName, callback );
          this.permissionGroup.add( middleware );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.ConflictError ) {
            e.message = `The "${ groupName }" permission group already exists, so it cannot be ` + 
              `added.`;
          }
          throw e;
        }

        // Return this to support function chaining.
        return this;

      }
       
      /**
       * @function
       * Add a middleware callback to run immediately before the matched command is executed. If 
       * index is supplied, the middleware will be spliced into the middleware order at the given 
       * index, pushing all items after it ahead one place.
       * @param  {string}   key      The identifier to use later to remove the callback.
       * @param  {Function} callback The middleware callback function of the signature
       *                             ( Command, Array<tokens>, Message ) => {} : Boolean.
       * @param  {Number}   index    The index to insert the middleware at. Default: -1, 
       *                             interpreted as "add this middleware at the tail of the array".
       * @return {CLI}               Returns itself to support function chaining.
       */
      addPreCommandMiddleware ( key, callback, index = -1 ) {
        
        // Create a new Callback object and try to add it to the pre-command middleware collection.
        try {
          const middleware = new CLIMachs.type.Callback( key, callback );
          this.preCommandMiddleware.add( middleware, index );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.ConflictError ) {
            e.message = `The "${ key }" pre-command middleware already exists, so it cannot be ` + 
              `added.`;
          }
          throw e;
        }

        // Return this to support function chaining.
        return this;

      }
          
      /**
       * @function
       * Add a middleware callback to run immediately before a response is returned for a command. 
       * If index is supplied, the middleware will be spliced into the middleware order at the 
       * given index, pushing all items after it ahead one place.
       * @param  {string}   key      The identifier to use later to remove the callback.
       * @param  {Function} callback The middleware callback function of the signature
       *                             ( Command, Array<tokens>, CommandResponse ) => {} : Boolean.
       * @param  {Number}   index    The index to insert the middleware at. Default: -1, 
       *                             interpreted as "add this middleware at the tail of the array".
       * @return {CLI}               Returns itself to support function chaining.
       */
      addPreResponseMiddleware ( key, callback, index = -1 ) {
        
        // Create a new Callback object and try to add it to the pre-response middleware collection.
        try {
          const middleware = new CLIMachs.type.Callback( key, callback );
          this.preResponseMiddleware.add( middleware, index );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.ConflictError ) {
            e.message = `The "${ key }" pre-response middleware already exists, so it cannot be ` + 
              `added.`;
          }
          throw e;
        }

        // Return this to support function chaining.
        return this;

      }
          
      /**
       * @function
       * Add a middleware callback to run immediately before message routing is processed. If 
       * index is supplied, the middleware will be spliced into the middleware order at the given 
       * index, pushing all items after it ahead one place.
       * @param  {string}   key      The identifier to use later to remove the callback.
       * @param  {Function} callback The middleware callback function of the signature
       *                             ( Array<tokens>, Message ) => {} : Boolean.
       * @param  {Number}   index    The index to insert the middleware at. Default: -1, 
       *                             interpreted as "add this middleware at the tail of the 
       *                             array".
       * @return {CLI}               Returns itself to support function chaining.
       */
      addPreRoutingMiddleware ( key, callback, index = -1 ) {
        
        // Create a new Callback object and try to add it to the pre-routing middleware collection.
        try {
          const middleware = new CLIMachs.type.Callback( key, callback );
          this.preRoutingMiddleware.add( middleware, index );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.ConflictError ) {
            e.message = `The "${ key }" pre-routing middleware already exists, so it cannot be ` + 
              `added.`;
          }
          throw e;
        }

        // Return this to support function chaining.
        return this;

      }

      /**
       * @function
       * Evaluate the given message by tokenizing the message, 
       * @param  {Message}               message The Roll20 API Message object received from chat 
       *                                         input.
       * @return {CommandResponse|Array}         A Response object containing a message, recipients, 
       *                                         a name to send the message as, and potentially 
       *                                         special styling data, or an array of them.
       */
      evaluate ( message ) {

        let response = null;
        try {

          if ( !message || message.type !== 'api' ) {
            throw new CLIMachs.type.ArgumentError( 'message must be a Roll20 API chat message!' );
          }

          // Tokenize the message contents and attempt to route/execute the command.
          response = this.route( this.tokenize( message.contents ), message );

        }
        catch ( e ) {
          // If an Error is thrown during the above process, handle it here. CommandErrors get 
          // special treatment because they denote errors within the expected behaviour of the 
          // commands being processed.
          if ( e instanceof CLIMachs.type.CommandError ) {
            response = new CLIMachs.type.CommandResponse( 
              message, e.message, 'self' 
            ); 
          }
          else {
            log( e );
            response = new CLIMachs.type.CommandResponse( 
              message, 'An unexpected error occurred! See the script execution log.', 'self'
            ); 
          }
        }

        // Return the response to the caller.
        return response;

      }

      /**
       * @function
       * Removes a command from the CLI lexicon by its signature.
       * @param  {string}  signature The signature of the command to be removed.
       * @return {Command}           Returns itself to support function call chaining.
       */
      removeCommand ( signature ) {

        // Try to remove the command from the list.
        try {
          this.commands.remove( signature );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.NotFoundError ) {
            e.message = `The ${ signature } command could not be found, so it cannot be removed.`;
          }
          throw e;
        }
        
        // Return this to support function call chaining.
        return this;

      }

      /**
       * @function
       * Removes a permission group from the set of available groups.
       * @param  {string}  groupName The key identifying the group to remove.
       * @return {Command}           Returns itself to support function call chaining.
       */
      removePermissionGroup ( groupName ) {

        // Scour commands recursively for any references to this group.
        const dependentCommands = this.allCommands
          .filter( command => command.permissions.groups.find( groupName ) );

        if ( dependentCommands.length > 0 ) {
          throw new Error( `The ${ groupName } permission group cannot not be removed because ` +
            `one or more commands depend upon it. Commands: ${ dependentCommands }` );
        }

        // Try to remove the permission group from the list.
        try {
          this.permissionGroups.remove( groupName );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.NotFoundError ) {
            e.message = `The "${ groupName }" group command could not be found, so it cannot ` + 
              `be removed.`;
          }
          throw e;
        }
        
        // Return this to support function call chaining.
        return this;

      }
          
      /**
       * @function
       * Remove a middleware that would run before command execution using its key. 
       * @param  {string}  key The key identifying the middleware to remove.
       * @return {Command}     Returns itself to support function call chaining.
       */
      removePreCommandMiddleware ( key ) {

        // Try to remove the middleware from the list.
        try {
          this.preCommandMiddleware.remove( key );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.NotFoundError ) {
            e.message = `The "${ key }" pre-command middleware could not be found, so it ` + 
              `cannot be removed.`;
          }
          throw e;
        }
        
        // Return this to support function call chaining.
        return this;

      }
       
      /**
       * @function
       * Remove a middleware that would run before returning a response using its key. 
       * @param  {string}  key The key identifying the middleware to remove.
       * @return {Command}     Returns itself to support function call chaining.
       */
      removePreResponseMiddleware ( key ) {

        // Try to remove the middleware from the list.
        try {
          this.preResponseMiddleware.remove( key );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.NotFoundError ) {
            e.message = `The "${ key }" pre-response middleware could not be found, so it ` + 
              `cannot be removed.`;
          }
          throw e;
        }
        
        // Return this to support function call chaining.
        return this;

      }
       
      /**
       * @function
       * Remove a middleware that would run before message routing using its key. 
       * @param  {string}  key The key identifying the middleware to remove.
       * @return {Command}     Returns itself to support function call chaining.
       */
      removePreRoutingMiddleware ( key ) {

        // Try to remove the middleware from the list.
        try {
          this.preRoutingMiddleware.remove( key );
        }
        catch ( e ) {
          if ( e instanceof CLIMachs.type.NotFoundError ) {
            e.message = `The "${ key }" pre-routing middleware could not be found, so it ` + 
              `cannot be removed.`;
          }
          throw e;
        }
        
        // Return this to support function call chaining.
        return this;

      }

      /**
       * @function
       * Given a tokenized command message, determine the command intended to be run and execute it.
       * @param  {Array}   tokens An array of chat message command tokens.
       * @return {Command}        The matching Command, or null if no commands matched the input.
       */
      route ( tokens, message ) {
        
        // Validate inputs.
        if ( !( tokens instanceof Array ) ) {
          throw new CLIMachs.type.ArgumentError( 'tokens must be a valid Array!' );
        }
        if ( tokens.length > 0 ) {
          throw new CLIMachs.type.ArgumentError( 'tokens must contain at least one element!' );
        }
        if ( tokens.filter( token => typeof( token ) !== 'string' ) > 0 ) {
          throw new CLIMachs.type.ArgumentError( 'tokens must contain only strings!' );
        }

        // This function is necessary to recurse through the command tree matching against tokens 
        // received from a chat message.
        function recurse ( tokens, command, subcommands ) {

          // Pop a token from the top of the list and try to match it with a subcommand.
          const currentToken = tokens.shift();
          const matches = subcommands.filter( x => x.signature === currentToken );

          // If a subcommand matched, recurse into it. If not, return the current command.
          if ( matches.length > 0 ) {
            return recurse( tokens, matches[ 0 ].subcommands );
          }
          else {
            return command;
          }

        }

        // Run each of the pre-routing middleware callbacks.
        const continueToRouting = this.preRoutingMiddleware
          .forEach( x => x.callback( tokens, message ) )
          .map( x => x.callback( tokens, message ) )
          .reduce( ( acc, result ) => acc = acc && result, true );
        if ( !continueToRouting ) {
          throw new Error( 'Operation aborted by middleware before message routing.' );
        }

        // Try to match the tokens with a command.
        // Note: recurse() will alter the tokens array by removing elements from the head of the 
        // array. This is an expected side-effect.
        const command = recurse( tokens, null, this.commands );
        if ( !command ) {
          throw new CLIMachs.type.NotFoundError( 'Command not found.' );
        }

        // Run each of the pre-command middleware callbacks.
        const continueToCommand = this.preCommandMiddleware
          .map( x => x.callback( command, tokens, message ) )
          .reduce( ( acc, result ) => acc = acc && result, true );
        if ( !continueToCommand ) {
          throw new Error( 'Operation aborted by middleware before command execution.' );
        }

        // Execute the matched Command's callback.
        const response = command.execute( tokens, message );

        // Run each of the pre-response middleware callbacks.
        const continueToResponse = this.preResponseMiddleware
          .map( x => x.callback( response, message ) )
          .reduce( ( acc, result ) => acc = acc && result, true );
        if ( !continueToResponse ) {
          throw new Error( 'Operation aborted by middleware before response.' );
        }

        // Return the CommandResponse.
        return response;

      }

      /**
       * @function
       * Send the text contents of a CommandResponse over Roll20 chat.
       * @param  {CommandResponse} response The CommandResponse to send over chat.
       */
      sendResponse ( response ) {

        // Recipients
        let recipients = '';
        switch ( response.recipient ) {
          case 'all':  /* No need to whisper to everyone! */        break;                               
          case 'gm':   recipients = '/w gm';                        break;
          case 'self': recipients = `/w ${ response.message.who }`; break;
          default:     recipients = `/w ${ response.recipient }`;   break;
        }

        // Style
        const style = `padding: 0; margin: 0; white-space: pre-wrap; ${ response.style }`;

        // Text
        const text = []
          .concat( response.text )
          .map( paragraph => `<p>${ paragraph }</p>` );

        // Send chat message.
        sendChat( 
          `${ recipients } <div style="${ style }>${ text }</div>"`, 
          response.speaker 
        );

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

    // Event Handlers

      /**
       * @function
       * Handle chat messages by evaluating them and sending out the response(s).
       */
      onChatMessage ( message ) {

        // Evaluate the message on the CLI.
        const response = this.evaulate( message );

        let failMessage;
        if ( response instanceof CLIMachs.type.CommandResponse ) {

          // Try to send out each of the responses.
          try { 
            this.sendResponse( response ); 
          }
          catch ( e ) { 
            failMessage = `A response could not be sent to chat: ${ response }`; 
          }

        }
        else if ( response instanceof Array ) {

          // Try to send out each of the responses.
          response.forEach( x => {
            try { 
              this.sendResponse( x ); 
            }
            catch ( e ) { 
              failMessage = `A response could not be sent to chat: ${ x }`; 
            }
          } );

        }
        else {

          // Log out the badly formatted message.
          failMessage = `A command must return a CommandResponse or an Array of ` + 
            `CommandResponses! Response: ${ response }`;

        }

        // If failMessage was set, send it out and log it.
        if ( failMessage ) {
          log( failMessage );
          sendChat(  );
        }

      }

      /**
       * @function
       * Perform configuration tasks dependent upon the Roll20 ready event.
       */
      onReady () {

        // Subscribe the CLI to chat message events.
        on( 'chat:message', this.onChatMessage );

      }

  };

// Store the CLI's state in the CLIMachs global.
CLIMachs.cli = CLIMachs.cli || new CLIMachs.type.CLI();

// Start up the CLI when the sandbox ready event is emitted.
on( 'ready', CLIMachs.cli.onReady );
