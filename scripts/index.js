/* global CLIMachs: true */

/**
 * [CLIMachs description]
 * @type {[type]}
 */
const CLIMachs = CLIMachs || {

  type: {

    /**
     * ArgumentError is a subclass of Error for semantic purposes so denote problems with arguments 
     * passed to functions. It doesn't do anything new, it's just to distinguish error types.
     */
    ArgumentError: class ArgumentError extends Error {

      constructor ( message ) {
        super( message );
      }

    }

  },

  decorator: {

    describe: ( key ) => ( value ) => {

      return ( target, name, descriptor ) => {
        descriptor[ key ] = value;
        return descriptor;
      };

    },

    configurable: describe( 'configurable' ),

    enumerable: describe( 'enumerable' ),

    value: describe( 'value' ),

    writable: describe( 'writable' ),

    private: ( target, name, descriptor ) => {
      descriptor.configurable = false;
      descriptor.enumerable = false;
      descriptor.writable = false;
      return descriptor;
    },

    propG: ( target, name, descriptor ) => {
      descriptor.configurable = false;
      descriptor.enumerable = true;
      descriptor.writable = false;
      return descriptor;
    },

    public: ( target, name, descriptor ) => {
      descriptor.configurable = false;
      descriptor.enumerable = true;
      descriptor.writable = true;
      return descriptor;
    },

    dynamic: ( target, name, descriptor ) => {
      descriptor.configurable = true;
      descriptor.enumerable = true;
      descriptor.writable = true;
      return descriptor;
    }

  },

  fn: {

    /**
     * A sorting function to order objects alphabetically by a given property.
     * @param  {Boolean}  caseSensitive Whether or not this sort should be case sensistive
     *                                  (default = true).
     * @return {Function}               A predicate function of the form ( a, b ) => {}.
     */
    currySortAlphabetical: ( caseSensitive = false ) => {

      return ( a, b ) => {
        var aLower = caseSensitive ? a : a.toLowerCase();
        var bLower = caseSensitive ? b : b.toLowerCase();
        if ( aLower < bLower ) {
          return -1;
        }
        else if ( aLower > bLower ) {
          return 1;
        }
        else {
          return 0; 
        }
      };

    },

    /**
     * A sorting function to order objects alphabetically by a given property.
     * @param  {string}   sortKey       The property on which the sort should operate.
     * @param  {Boolean}  caseSensitive Whether or not this sort should be case sensistive
     *                                  (default = true).
     * @return {Function}               A predicate function of the form ( a, b ) => {}.
     */
    currySortAlphabeticalByKey: ( sortKey, caseSensitive = false ) => {

      return ( a, b ) => {
        var aLower = caseSensitive ? a[ sortKey ] : a[ sortKey ].toLowerCase();
        var bLower = caseSensitive ? b[ sortKey ] : b[ sortKey ].toLowerCase();
        if ( aLower < bLower ) {
          return -1;
        }
        else if ( aLower > bLower ) {
          return 1;
        }
        else {
          return 0; 
        }
      };

    },

    /**
     * Try to get the player ID given a name to look up. This function will attempt to find a 
     * player matching this name, and if nothing is found, it will search for characters instead 
     * and then attempt to look up the controlling player from there.
     * @param  {[type]} name    The name of the player to search for.
     * @param  {[type]} options Search options to be passed to the Roll20 findObjs function.
     * @return {Number}         The player ID associated with the player searched by name.
     */
    getPlayerIdByName: ( playerName ) => { 

      // Try to use the name to find a player that matches.
      const queriedPlayers = findObjs( 
        { type: 'player', displayname: playerName }, 
        { caseInsensitive: true } 
      );
      if ( queriedPlayers && queriedPlayers.length > 0 ) {
        return queriedPlayers[ 0 ].id;
      }
      
      // If a player wasn't found, look for characters by that name and use the 0th player in 
      // control of the found character as a match.
      const queriedCharacters = findObjs( 
        { type: 'character', name: playerName }, 
        { caseInsensitive: true } 
      );
      if ( queriedCharacters && queriedCharacters.length > 0 ) {
        if ( queriedCharacters.controlledby.length > 0 ) {
          return queriedCharacters[ 0 ].controlledby[ 0 ].id;
        }
      }

      // If you come up with nothing, return -1 to indicate failure.
      return -1;

    },

    /**
     * [description]
     * @param  {[type]} textUnescaped [description]
     * @return {[type]}               [description]
     */
    htmlEscape: ( textUnescaped ) => {
      return String( textUnescaped )
        .replace( /\n/g, '<br />' )
        .replace( /"/g,  '&quot;' )
        .replace( /'/g,  '&#39;'  )
        .replace( /&/g,  '&amp;'  )
        .replace( /</g,  '&lt;'   )
        .replace( />/g,  '&gt;'   );
    },

    /**
     * [description]
     * @param  {[type]} textEscaped [description]
     * @return {[type]}             [description]
     */
    htmlUnescape: ( textEscaped ) => {
      return String( textEscaped )
        .replace( /<br \/>/g, '\n' )
        .replace( /&quot;/g,  '"'  )
        .replace( /&#39;/g,   '\'' )
        .replace( /&amp;/g,   '&'  )
        .replace( /&lt;/g,    '<'  )
        .replace( /&gt;/g,    '>'  );
    }

  }

};


/**
 * Extension of the Array prototype to include a function for inserting objects into an array that 
 * is sorted by key. Using the key of the object to be inserted, check for a duplicate key and 
 * remove it before inserting the new element and resorting. Log a warning for the replacement.
 * @param  {string} key   The key at which to add the value.
 * @param  {object} value The object to add to the array.
 * @return {Array}        Returns the modified Array to support chaining of function calls.
 */
Array.prototype.addSortedByKey = ( key, value ) => {

  // Remove the existing key (if any, push the new command onto the array and sort it 
  // alphabetically on the key.
  return this
    .push( value )
    .sort( CLIMachs.currySortAlphabeticalByKey( key ) );

};


/**
 * Extension of the Array prototype to include a function for removing object by finding a property 
 * with a particular value and splicing it out.
 * @param  {string}  key   The property in which to look to match the value.
 * @param  {string}  value The value to look for to remove from the array.
 * @return {Array}         Returns the modified Array to support chaining of function calls.
 */
Array.prototype.removeByKey = ( key, value ) => {

  // Try to remove the item with the property key: value from the array.
  const index = this.findIndex( item => item[ key ] === value );
  if ( index > -1 ) {
    return this.splice( index, 1 );
  }

  // Return this to support chaining if nothing is removed.
  return this;

};