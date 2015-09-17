
// init command module.
function Init () {

  /**
   * This function registers the init command as a valid command in the CommandShell module.
   */
  function registerToCommandShell () {

    if ( !Shell ) {
      log( 'ERROR >>> Missing dependency: CommandShell (https://wiki.roll20.net/Script:Command_Shell). Cannot register init as a shell command!' );
      return;
    }

    if ( Shell.registerCommand ) {
      Shell.registerCommand( COMMAND, SYNTAX, DESCRIPTION, CLIMachs.init.onChatCommand );
    }

    if ( Shell.write ) {
      CLIMachs.init.write = Shell.write;
    }

  }

  /**
   * This function checks if the state of the script has been saved, and if so, revives it back 
   * into memory. Otherwise, it initializes the state to a safe set of defaults.
   */
  function reviveOrInitState () {

    if ( !state.hasOwnProperty( 'CLIMachs' ) ) {
      state.CLIMachs = {};
    } 
    if ( !state.CLIMachs.hasOwnProperty( 'init' ) ) {
      state.CLIMachs.init = {
        announceRounds: true,
        announceTurns: true
      };
    }
    if ( !state.CLIMachs.init.hasOwnProperty( 'roundCounter' ) ) {
      state.CLIMachs.init.roundCounter = 0;
    }
    if ( !state.CLIMachs.init.hasOwnProperty( 'turnCounter' ) ) {
      state.CLIMachs.init.turnCounter = 0;
    }
    if ( !state.CLIMachs.init.hasOwnProperty( 'turnOrder' ) ) {
      state.CLIMachs.init.turnOrder = [];
    }

  }

  /**
   * This function handles tokenized commands/arguments by requesting the appropriate behaviour.
   * @param  {Array} tokens    An array of the form [command, arg, arg, arg, ...]
   * @param  {String} message  The chat message received by the script.
   */
  function onChatCommand ( tokens, message ) {



  }

  /**
   * This function acts as a fallback in case the CommandShell script hasn't been included as a 
   * dependency. It checks to see if the command was provided in the input and tokenizes the 
   * command arguments on spaces before passing the output to onChatCommand.
   * @param  {String} message  The chat message received by the script.
   */
  function onChatMessage ( message ) {

    if ( message.type !== 'api' ) {
      // If this isn't an API command, return.
      return;
    }
    else if ( message.content.trim().indexOf( COMMAND + ' ' ) !== 0 ) {
      // If the command doesn't match, return.
      return;
    }

    // Tokenize the message by splitting by arguments then stripping quotes from matched arguments.
    // The String.match() pattern identifies arguments as (regex): 
    //    a) Any number of characters not containing spaces, single-quotes or double-quotes.
    //    b) Any number of characters between single-quotes.
    //    c) Any number of characters between double-quotes.
    var tokens = message
      .content
      .match( /([^ '"]+|'.*?'|".*?")/g )
      .map( function ( x ) { return x.replace( /['"]/g, '' ); } );
    
    // Pass the tokenized command and arguments into onChatCommand.
    return CLIMachs.init.onChatCommand( tokens, message );

  }

  /**
   * This function starts up the script in response to the sandbox' ready event.
   */
  function onReady () {

    if ( Shell ) {
      registerToCommandShell();
    }
    else {
      log( 'WARNING >>> Missing dependency: CommandShell (https://wiki.roll20.net/Script:Command_Shell). This script will function with degraded capabilities without this dependency included.' );
      on( 'chat:message', CLIMachs.init.onChatMessage );
    }

    reviveOrInitState();

    on( 'change:campaign:turnorder', CLIMachs.init.onChangeCampaignTurnorder );

  }

  // State
  var commands    = {};

  // Constants
  var COMMAND     = '!init';
  var SYNTAX      = '!init[-<command> [args] ...] [--help|-h] [--version|v]';
  var DESCRIPTION = 'A simple and powerful initiative order command set.';

  // Externals
  return {

    // Eternals
    
  };

}

// Store the command's state in the CLIMachs global.
CLIMachs.init = CLIMachs.init || Init();

// Start up the command when the sandbox ready event is emitted.
on( 'ready', CLIMachs.init.onReady );