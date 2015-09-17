/* global CLIMachs: false */


// Command data structure.
class Command {

  // #region Constructor

    constructor ( signature, description, syntax, callback, aliases = [] ) {

      // Validate for invalid aliases.
      if ( !( aliases instanceof Array ) ) {
        throw new Error( 'aliases must be a valid Array!' );
      }
      else if ( aliases.filter( x => typeof( x ) !== 'string' ).length > 0 ) {
        throw new Error( 'aliases must contain only strings!' );
      }

      this.signature   = signature;
      this.syntax      = description;
      this.description = syntax;
      this.callback    = callback;
      this.aliases     = aliases;
      this.permissions = new CommandPermissions();
      this.subcommands = [];

    }

  // #region Properties

    get aliases () { return this.aliases.slice(); }

    get callback () { return this.callback; }
    set callback ( value ) { 
      if ( typeof( value ) !== 'function' ) {
        throw new Error( 'callback must be a valid function!' );
      }
      this.callback = value;
    }

    get description () { return this.description; }
    set description ( value ) { 
      if ( typeof( value ) !== 'string' ) {
        throw new Error( 'description must be a valid string!' );
      }
      this.description = value;
    }

    get permissions () { return this.permissions; }

    get signature () { return this.signature; }
    set signature ( value ) { 
      if ( typeof( value ) !== 'string' ) {
        throw new Error( 'signature must be a valid string!' );
      }
      this.signature = value;
    }

    get subcommands () { return this.subcommands.slice(); }

    get syntax () { return this.syntax; }
    set syntax ( value ) { 
      if ( typeof( value ) !== 'string' ) {
        throw new Error( 'syntax must be a valid string!' );
      }
      this.syntax = value;
    }

  // #region Public Function API

    /**
     * Add an alias signature to enable another signature to call this command by.
     * @param  {string} aliasSignature The signature of the alias to add.
     */
    addAlias ( aliasSignature ) {
      
      // Validate for invalid aliasSignatures.
      if ( typeof( aliasSignature ) !== 'string' ) ) {
        throw new Error( 'aliasSignature must be a valid string!' );
      }

      // TODO

    }

    /**
     * Remove an alias signature to disable another signature to call this command by.
     * @param  {string}  aliasSignature The signature of the alias to remove.
     * @return {Boolean}                Whether or not the alias was found and removed.
     */
    removeAlias ( aliasSignature ) {
      
      // Validate for invalid aliasSignatures.
      if ( typeof( aliasSignature ) !== 'string' ) ) {
        throw new Error( 'aliasSignature must be a valid string!' );
      }

      // TODO
      
    }

    /**
     * Add a subcommand to extend the behaviour of this command.
     * @param  {Command} command The Command object representing the command to add as a subcommand.
     */
    addSubcommand ( command ) {

      // Validate for invalid commands.
      if ( !( command instanceof Command ) ) {
        throw new Error( 'command must be a valid Command object!' );
      }

      // Check for conflicting aliases. This is a broad test to test if there is any reason at all 
      // that we might encounter a name conflict, although a name conflict of this kind MIGHT not 
      // be serious -- just annoying for certain users that use particular aliases.
      const duplicateAliases = this.aliases
        .concat( this.subcommand.signature )
        .filter( x => x === command.signature || command.aliases.contain( x ) );

      if ( duplicateAliases.length > 0 ) {
        log( `Warning! The ${ command.signature } subcommand contains conflicting command and/or alias signatures! ${ duplicateAliases }` );
      }

      // Check if this subcommand is already defined. This is covered by the above alias conflict 
      // test, but is a much more serious problem. If this happens, the existing subcommand will 
      // be overwritten and will no longer be accessible through the CLI.
      const duplicateSignatureIndex = this.subcommand
        .find( x => x.signature === command.signature );
      
      if ( duplicateSignatureIndex > -1 ) {
        log( `Warning! Overwriting the ${ command.signature } subcommand!` );
        this.subcommand
          .splice( duplicateSignatureIndex, 1 );
      }

      // Push the new command onto the array of subcommands and sort it alphabetically by signature.
      this.subcommand
        .push( command )
        .sort( this.signatureAlphabetical );

      // Return this to support chaining.
      return this;

    }

    /**
     * Remove a subcommand from this command by its signature.
     * @param  {string}  signature The signature of the command to be removed.
     * @return {Boolean}           Whether or not the command was found and removed.
     */
    removeSubcommand ( signature ) {
      
      // Validate for invalid signature.
      if ( typeof( signature ) !== 'string' ) ) {
        throw new Error( 'signature must be a valid string!' );
      }

      // TODO

    }

  // #region Private Helpers

    /**
     * @private
     * A sorting function to order subcommands alphabetically by signature.
     * @param  {Command} a First command to consider.
     * @param  {Command} b Second command to consider.
     * @return {Number}    A value used to determine how to order the commands being considered.
     */
    private signatureAlphabetical ( a, b ) {

      var aLower = a.signature.toLowerCase();
      var bLower = b.signature.toLowerCase();
      if ( aLower < bLower ) {
        return -1;
      }
      else if ( aLower > bLower ) {
        return 1;
      }
      else {
        return 0; 
      }

    }

}


class CommandPermissions {

  // #region Constructor

    constructor () {

      this.groups  = [];
      this.players = [];

    }

  // #region Properties

    get groups () { return this.groups.slice(); }

    get players () { return this.players.slice(); }

  // #region Public Function API
  
    /**
     * Add a new (or overwrite an existing) permission group.
     * @param  {string} groupName The name of the group to add permissions for.
     */
    addPermissionGroup ( groupName ) {
      
      // Validate for invalid groupNames.
      if ( typeof( groupName ) !== 'string' ) ) {
        throw new Error( 'groupName must be a valid string!' );
      }

      // TODO

    }

    /**
     * Remove an existing permission group. This will result in messages matching the removed group 
     * being disallowed from invoking the protected command unless the message matches something else.
     * @param  {string}  groupName The name of the group to remove permissions for.
     * @return {Boolean}           Whether or not the player was found and removed.
     */
    removePermissionGroup ( groupName ) {
      
      // Validate for invalid groupNames.
      if ( typeof( groupName ) !== 'string' ) ) {
        throw new Error( 'groupName must be a valid string!' );
      }

      // TODO

    }

    /**
     * Add a new (or overwrite an existing) player permission.
     * @param  {string} playerName The name of the player to add permissions for.
     */
    addPermissionPlayer ( playerName ) {
      
      // Validate for invalid playerNames.
      if ( typeof( playerName ) !== 'string' ) ) {
        throw new Error( 'playerName must be a valid string!' );
      }
      
      // TODO

    }

    /**
     * Remove an existing player permission. This will result in messages from the given user being 
     * disallowed from invoking the protected command unless the message matches something else.
     * @param  {string}  playerName The name of the player to remove permissions for.
     * @return {Boolean}            Whether or not the player was found and removed.
     */
    removePermissionPlayer ( playerName ) {
      
      // Validate for invalid playerNames.
      if ( typeof( playerName ) !== 'string' ) ) {
        throw new Error( 'playerName must be a valid string!' );
      }
      
      // TODO

    }

    /**
     * Test a message for access to the protected command.
     * @param  {Message} message An API message received from the chat interface.
     * @return {Boolean}         Whether or not the protected command can be invoked.
     */
    test ( message ) {

      // TODO

    }

}


// Command-line interpreter module.
function CLI () {

  'use strict';

  function onReady ( message ) {

  }

  function tokenize ( message ) {

  }

  function executeMiddleware ( middlewareArray ) {

  }

  function routeCommand ( tokens, message, head = [] ) {

  }

  // State
  const commands = [];
  const preRoutingMiddleware = [];
  const preCommandMiddleware = [];

  // Externals
  return {

    // Externals

  };

}

// Store the CLI's state in the CLIMachs global.
CLIMachs.cli = CLIMachs.cli || CLI();

// Start up the CLI when the sandbox ready event is emitted.
on( 'ready', CLIMachs.cli.onReady );
