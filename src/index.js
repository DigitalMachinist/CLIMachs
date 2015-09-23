/* global CLIMachs: true */

const CLIMachs = {

  /**
   * @namespace CLIMachs.collections
   */
  collections: {},

  /**
   * @namespace CLIMachs.errors
   */
  errors: {},

  /**
   * @namespace CLIMachs.fn
   */
  fn: {},

  // A serializable state object to store any CLI data required at runtime.
  state: {}

};


// CLIMachs.collections Namespace

  CLIMachs.collections.Callback = 
    class {

      // Constructor

        /**
         * @class CLIMachs.collections.Callback
         * 
         * @classdesc Callback objects are used to keep track of callbacks by giving them a key 
         * to identify them while stored in a UniqueKeyedCollection.
         * 
         * @param {string} key
         * The identifier given to this middleware callback.
         * 
         * @param {function} callback 
         * The callback function implementing some behaviour. Function signature may vary by 
         * context of usage.
         */
        constructor ( key, fn ) {

          if ( typeof( fn ) !== 'function' ) {
            throw new CLIMachs.type.ArgumentError( 'fn must be a valid function!' );
          }
          if ( typeof( key ) !== 'string' ) {
            throw new CLIMachs.type.ArgumentError( 'key must be a valid string!' );
          }
            if ( !/['"]/g.test( key ) ) {
              throw new CLIMachs.type.ArgumentError( 'key must not contain any ' + 
                'single-quotes or double-quotes!' );
            }

          this.fn = fn;
          this.key = key;

        }

      // Fields

        /**
         * @member {function} fn
         * @instance
         * @memberof CLIMachs.collections.Callback
         * @description The callback function that implements the behaviour of the Callback.
         */
        get fn () { return this.fn; }

        /**
         * @member {string} key
         * @instance
         * @memberof CLIMachs.collections.Callback
         * @description The identifier used to look this Callback up in a UniqueKeyedCollection.
         */
        get key () { return this.key; }

    };

  CLIMachs.collections.UniqueCollection = 
    class {

      // Constructor

        /**
         * @class CLIMachs.collections.UniqueCollection
         * 
         * @classdesc A collection designed to maintain the uniqueness any items it contains.
         * 
         * @param  {function} [sortingFunction = null]
         * A function used to re-sort the data array after each time an item is added. A value of 
         * null indicates that no sorting is applied.
         */
        constructor ( sortingFunction = null ) {

          if ( sortingFunction !== null || typeof( sortingFunction ) !== 'function' ) {
            throw new CLIMachs.types.ArgumentError( 'sortingFunction must be a valid function!' );
          }

          this.data = [];
          this.sortingFunction = sortingFunction;

        }

      // Fields

        /**
         * @member {Array} data
         * @instance
         * @memberof CLIMachs.collections.UniqueCollection
         * @description The data array that contains all of the items belonging to the 
         * collection. Note: This getter returns a shallow copy of the data array, so operating on 
         * it will not affect the collection.
         */
        get data () { return this.data.slice(); }

        /**
         * @member {function} sortingFunction
         * @instance
         * @memberof CLIMachs.collections.UniqueCollection
         * @description A sorting function that will be used to automatically re-sort the data 
         * array by key any time a new item is added to the collection. If set to null, no sorting 
         * is applied to the data array.
         */
        get sortingFunction () { return this.sortingFunction; }
        set sortingFunction ( value ) {

          if ( value !== null || typeof( value ) !== 'function' ) {
            throw new CLIMachs.types.ArgumentError( 'sortingFunction must be a valid function!' );
          }
          this.sortingFunction = value;

        }

      // Public Functions

        /**
         * @method add
         * @instance
         * @memberof CLIMachs.collections.UniqueCollection
         * 
         * @description Adds a new item to the collection.
         * 
         * @param {object} item 
         * The item to add.
         * 
         * @param {number} [index = -1]
         * The index at which to add the item. All items currently at or after this index will be 
         * shifted ahead by one place. A value of -1 indicates to add the item at the end of the 
         * array.
         */
        add ( item, index = -1 ) {

          // Validate inputs.
          if ( typeof( item ) !== 'object' ) {
            throw new CLIMachs.types.ArgumentError( 'item must be a valid object!' );
          }
          if ( !item.key ) {
            throw new CLIMachs.types.ArgumentError( 'item must have a key property!' );
          }
          if ( typeof( index ) !== 'number' ) {
            throw new CLIMachs.types.ArgumentError( 'index must be a valid number!' );
          }
          if ( index < -1 || index >= this.data.length ) {
            throw new CLIMachs.types.ArgumentError( 'index out of range!' );
          }

          // Block items already in the data array from being re-added.
          const matchIndex = this.data.findIndex( item );
          if ( matchIndex > -1 ) {
            throw new CLIMachs.types.ConflictError( `An item already exists with a value of ` + 
              `${ item.key }.` );
          }

          // Insert the item into the data array at the requested index.
          if ( index === -1 ) {
            this.data.splice( index, 0, item );
          }
          else {
            this.data.push( item );
          }

          // If a sorting function has been assigned, re-sort the data array.
          if ( this.sortingFunction ) {
            this.data.sort( this.sortingFunction );
          }

        }

        /**
         * @method remove
         * @instance
         * @memberof CLIMachs.collections.UniqueCollection
         * 
         * @description Removes an item from the collection.
         * 
         * @param {*} item 
         * The item to remove from the collection.
         * 
         * @return {object} 
         * The item removed from the collection.
         */
        remove ( item ) {

          // Check if the given item matches any elements (it should only match one).
          const matchIndex = this.data.findIndex( item );
          if ( matchIndex < 0 ) {
            throw new CLIMachs.types.NotFoundError( `No item could be found with a value of` + 
              `${ item }.` );
          }

          // Remove the element from the collection and return it.
          return this.data.splice( matchIndex, 1 );

        }

    };

  CLIMachs.collections.UniqueKeyedCollection = 
    class extends CLIMachs.collections.UniqueCollection {

      // Constructor

        /**
         * @class CLIMachs.collections.UniqueKeyedCollection
         * @extends {CLIMachs.type.UniqueCollection}
         * 
         * @classdesc A simple collection designed to maintain the uniqueness of the "key" property 
         * of any items it contains.
         * 
         * @param {string} keyProp
         * The name of the property to use as the unique key for sorting the collection.
         * 
         * @param {function} [sortingFunction = null]
         * A function used to re-sort the data array after each time an item is added. A value of 
         * null indicates that no sorting is applied.
         */
        constructor ( keyProp, sortingFunction = null ) {

          if ( typeof( keyProp ) !== 'string' ) {
            throw new CLIMachs.types.ArgumentError( 'keyProperty must be a valid string!' );
          }

          super( sortingFunction );

          this.keyProp = keyProp;

        }

      // Fields

        /**
         * @member {string} keyProp
         * @instance
         * @memberof CLIMachs.collections.UniqueKeyedCollection
         * @description The name of the property to use as the unique key.
         */
        get keyProp () { return this.keyProp; }

      // Public Functions

        /**
         * @method add
         * @instance
         * @memberof CLIMachs.collections.UniqueKeyedCollection
         * 
         * @description Adds a new item to the collection.
         * 
         * @param {object} item
         * The item to add.
         * 
         * @param {Number} [index = -1]
         * The index at which to add the item. All items currently at or after this index will be 
         * shifted ahead by one place. A value of -1 indicates to add the item at the end of the 
         * array.
         */
        add ( item, index = -1 ) {

          // Validate inputs.
          if ( typeof( item ) !== 'object' ) {
            throw new CLIMachs.types.ArgumentError( 'item must be a valid object!' );
          }
          if ( typeof( item[ this.keyProperty ] ) !== 'undefined' ) {
            throw new CLIMachs.types.ArgumentError( `item must have a ${ this.keyProp }` + 
              `property!` );
          }
          if ( typeof( index ) !== 'number' ) {
            throw new CLIMachs.types.ArgumentError( 'index must be a valid number!' );
          }
          if ( index < -1 || index >= this.data.length ) {
            throw new CLIMachs.types.ArgumentError( 'index out of range!' );
          }

          // Block items with keys already in the data array from being re-added.
          const matches = this.data.filter( x => x[ this.keyProp ] === item[ this.keyProp ] );
          if ( matches.length > 0 ) {
            throw new CLIMachs.types.ConflictError( `An item already exists with a unique key` + 
              `of ${ item[ this.keyProp ] }.` );
          }

          // Insert the item into the data array at the requested index.
          if ( index === -1 ) {
            this.data.splice( index, 0, item );
          }
          else {
            this.data.push( item );
          }

          // If a sorting function has been assigned, re-sort the data array.
          if ( this.sortingFunction ) {
            this.data.sort( this.sortingFunction );
          }

        }

        /**
         * @method remove
         * @instance
         * @memberof CLIMachs.collections.UniqueKeyedCollection
         * 
         * @description Removes an item from the collection.
         * 
         * @param {string} key 
         * The key on the item to remove from the collection.
         * 
         * @return {object}
         * The item removed from the collection.
         */
        remove ( key ) {

          // Check if the given key matches any elements (it should only match one).
          const matches = this.data
            .map( ( x, i ) => { return { key: x[ this.keyProp ], index: i }; } )
            .filter( x => x[ this.keyProp ] === key );

          if ( matches.length === 0 ) {
            throw new CLIMachs.types.NotFoundError( `No item could be found with a unique key` + 
              `of ${ key }.` );
          }

          // Remove the element from the collection and return it.
          return this.data.splice( matches[ 0 ].index, 1 );

        }

    };


// CLIMachs.errors Namespace

  CLIMachs.errors.ArgumentError =
    class extends Error {

      // Constructor

        /**
         * @class CLIMachs.errors.ArgumentError
         * @extends {Error}
         * 
         * @classdesc ArgumentError is a subclass of Error for semantic purposes so denote problems 
         * with arguments passed to functions. It doesn't do anything new, it's just to distinguish 
         * error types.
         * 
         * @param {string} message 
         * A short description of the error.
         */
        constructor ( message ) {

          super( message );

        }

    };

  CLIMachs.errors.ConflictError = 
    class extends Error {

      // Constructor

        /**
         * @class CLIMachs.errors.ConflictError
         * @extends {Error}
         * 
         * @classdesc ConflictError is a subclass of Error for semantic purposes so denote a 
         * collision when attempting to map a command to a given signature because of existing 
         * subcommand signatures and/or aliases that are the same. It doesn't do anything new, 
         * it's just to distinguish error types.
         * 
         * @param {string} message 
         * A short description of the error.
         */
        constructor ( message ) {

          super( message );

        }

    };

  CLIMachs.errors.DependencyError = 
    class extends Error {

      // Constructor

        /**
         * @class CLIMachs.errors.DependencyError
         * @extends {Error}
         * 
         * @classdesc DependencyError is a subclass of Error for semantic purposes so denote that 
         * an action could not be completed because some other resource was expecting something to 
         * exist or otherwise not change. It doesn't do anything new, it's just to distinguish 
         * error types.
         * 
         * @param {string} message 
         * A short description of the error.
         */
        constructor ( message ) {

          super( message );

        }

    };

  CLIMachs.errors.NotFoundError = 
    class extends Error {

      // Constructor

        /**
         * @class CLIMachs.errors.NotFoundError
         * @extends {Error}
         * 
         * @classdesc NotFoundError is a subclass of Error for semantic purposes so denote a 
         * failure to find an item that was expected (often when attempting to delete an item by 
         * key). It doesn't do anything new, it's just to distinguish error types.
         * 
         * @param {string} message 
         * A short description of the error.
         */
        constructor ( message ) {

          super( message );

        }

    };


// CLIMachs.fn Namesapce

  /**
   * @function CLIMachs.fn.currySortAlphabetical
   * @memberof CLIMachs.fn
   * 
   * @description A sorting function to order objects alphabetically by a given property.
   * 
   * @param {boolean} [caseSensitive = false] 
   * Whether or not this sort should be case sensistive.
   * 
   * @return {function}
   * A predicate function of the form ( a, b ) => {}.
   */
  CLIMachs.fn.currySortAlphabetical = 
    function currySortAlphabetical ( caseSensitive = false ) {

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

    };

  /**
   * @function CLIMachs.fn.currySortAlphabeticalByKey
   * @memberof CLIMachs.fn
   * 
   * @description A sorting function to order objects alphabetically by a given property.
   * 
   * @param {string} sortKey       
   * The property on which the sort should operate.
   * 
   * @param {boolean} [caseSensitive = false] 
   * Whether or not this sort should be case sensistive.
   * 
   * @return {function}               
   * A predicate function of the form ( a, b ) => {}.
   */
  CLIMachs.fn.currySortAlphabeticalByKey = 
    function currySortAlphabeticalByKey ( sortKey, caseSensitive = false ) {

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

    };

  /**
   * @function CLIMachs.fn.getPlayerIdByName
   * @memberof CLIMachs.fn
   * 
   * @description Try to get the player ID given a name to look up. This function will attempt 
   * to find a player matching this name, and if nothing is found, it will search for characters 
   * instead and then attempt to look up the controlling player from there.
   * 
   * @param {string} name 
   * The name of the player to search for.
   * 
   * @param {object} options 
   * Search options to be passed to the Roll20 findObjs function.
   * 
   * @return {number}
   * The player ID associated with the player searched by name.
   */
  CLIMachs.fn.getPlayerIdByName = 
    function getPlayerIdByName ( playerName ) { 

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

    };

  /**
   * @function CLIMachs.fn.htmlEscape
   * @memberof CLIMachs.fn
   * 
   * @description Transform unescaped text into HTML-safe text.
   * 
   * @param {string} textUnescaped 
   * Unescaped text.
   * 
   * @return {string}
   * HTML-safe text.
   */ 
  CLIMachs.fn.htmlEscape = 
    function htmlEscape ( textUnescaped ) {
      return String( textUnescaped )
        .replace( /\n/g, '<br />' )
        .replace( /"/g,  '&quot;' )
        .replace( /'/g,  '&#39;'  )
        .replace( /&/g,  '&amp;'  )
        .replace( /</g,  '&lt;'   )
        .replace( />/g,  '&gt;'   );
    };

  /**
   * @function CLIMachs.fn.htmlUnescape
   * @memberof CLIMachs.fn
   * 
   * @description Transform HTML-safe text into unescaped text.
   * 
   * @param {string} textEscaped 
   * HTML-safe text.
   * 
   * @return {string}
   * Unescaped text.
   */ 
  CLIMachs.fn.htmlUnescape = 
    function htmlUnescape ( textEscaped ) {
      return String( textEscaped )
        .replace( /<br \/>/g, '\n' )
        .replace( /&quot;/g,  '"'  )
        .replace( /&#39;/g,   '\'' )
        .replace( /&amp;/g,   '&'  )
        .replace( /&lt;/g,    '<'  )
        .replace( /&gt;/g,    '>'  );
    };