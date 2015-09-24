/* exported findObjs, log, on, playerIsGM, sendChat, trigger */
/* global console:    false */
/* global findObjs:   true  */
/* global log:        true  */
/* global on:         true  */
/* global playerIsGM: true  */
/* global sendChat:   true  */
/* global trigger:    true  */

var events = {};

function findObjs ( attrs, options ) {

  if ( attrs.type === 'player' && attrs.displayname === 'test' ) {
    return [
      { get: ( prop ) => 1 },
      { get: ( prop ) => 2 }
    ];
  }
  else if ( attrs.type === 'character' && attrs.name === 'test' ) {
    return [
      { get: ( prop ) => [ 1, 2 ] },
      { get: ( prop ) => [ 3, 4 ] }
    ];
  }

}

function log ( message ) { 

  var result = `log(): ${ message }`;
  console.log( result );
  return result;

}

function on ( eventString, callback ) {

  if ( typeof( events[ eventString ] ) === 'undefined' ) {
    events[ eventString ] = [];
  }
  events[ eventString ]
    .push( callback );

}

function playerIsGM ( playerId ) {

  return ( playerId === 1 );

}

function sendChat ( message, sendAs ) {

  var result = `sendChat(): ${ message }`;
  console.log( result );
  return result;

}

function trigger ( eventString, ...args ) {

  if ( typeof( events[ eventString ] ) === 'undefined' ) {
    events[ eventString ] = [];
  }
  events[ eventString ]
    .forEach( callback => callback( ...args ) );

}
