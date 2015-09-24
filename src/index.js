
// Start Up

  ( function startup() {

    // Store the CLI state by starting up a CLI instance.
    CLIMachs.state = new CLIMachs.cli.CLI();

    // Start up the CLI when the sandbox ready event is emitted.
    on( 'ready', CLIMachs.state.onReady );

  } )();