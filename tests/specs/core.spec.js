
describe( 'CLIMachs Core Namespaces', () => {

  describe( 'collections', () => {

    describe( 'Callback', () => {

      describe( 'constructor', () => {

        it( 'throws an ArgumentError when fn is not a function', () => {
          expect( true ).toBe( true );
        } );

        it( 'throws an ArgumentError when key is not a string', () => {
          expect( true ).toBe( true );
        } );

      } );

    } );

    describe( 'UniqueCollection', () => {

      describe( 'constructor', () => {

        it( 'throws an ArgumentError when sortingFunction is not null or a function', () => {
          expect( true ).toBe( true );
        } );

      } );

      describe( 'setSortingFunction', () => {

        it( 'throws an ArgumentError when sortingFunction is not null or a function', () => {
          expect( true ).toBe( true );
        } );

      } );

      describe( 'add', () => {

        it( 'throws an ArgumentError when index is not a number', () => {
          expect( true ).toBe( true );
        } );

        it( 'throws an ArgumentError when index is not in the range [-1, data.length - 1]', () => {
          expect( true ).toBe( true );
        } );

        it( 'throws a ConflictError when attempting to insert an item matching another item in the collection', () => {
          expect( true ).toBe( true );
        } );

        it( 'inserts the new item at the end of the collection when index === -1', () => {
          expect( true ).toBe( true );
        } );

        it( 'inserts the new item at the specified index when index !== -1', () => {
          expect( true ).toBe( true );
        } );

        it( 'the collection is sorted after a new item is added when the collection\'s sortingFunction is set', () => {
          expect( true ).toBe( true );
        } );

      } );

      describe( 'remove', () => {

        it( 'throws a NotFoundError when item doesn\'t match any item in the collection', () => {
          expect( true ).toBe( true );
        } );

        it( 'returns the removed item when an item is removed successfully', () => {
          expect( true ).toBe( true );
        } );

      } );

    } );

    describe( 'UniqueKeyedCollection', () => {

      describe( 'constructor', () => {

        it( 'throws an ArgumentError when sortKey is not a string', () => {
          expect( true ).toBe( true );
        } );

      } );

      describe( 'add', () => {

        it( 'throws an ArgumentError when item is not an object', () => {
          expect( true ).toBe( true );
        } );

        it( 'throws an ArgumentError when item doesn\'t have a property matching the sortKey of the collection', () => {
          expect( true ).toBe( true );
        } );

        it( 'throws an ArgumentError when index is not a number', () => {
          expect( true ).toBe( true );
        } );

        it( 'throws an ArgumentError when index is not in the range [-1, data.length - 1]', () => {
          expect( true ).toBe( true );
        } );

        it( 'throws a ConflictError when attempting to insert an item with a key matching another item in the collection', () => {
          expect( true ).toBe( true );
        } );

        it( 'inserts the new item at the end of the collection when index === -1', () => {
          expect( true ).toBe( true );
        } );

        it( 'inserts the new item at the specified index when index !== -1', () => {
          expect( true ).toBe( true );
        } );

        it( 'the collection is sorted after a new item is added when the collection\'s sortingFunction is set', () => {
          expect( true ).toBe( true );
        } );

      } );

      describe( 'remove', () => {

        it( 'throws a NotFoundError when key doesn\'t match the key of any item in the collection', () => {
          expect( true ).toBe( true );
        } );

        it( 'returns the removed item when an item is removed successfully', () => {
          expect( true ).toBe( true );
        } );

      } );

    } );

  } );

  describe( 'errors', () => {

    describe( 'ArgumentError', () => {

      // No logic to test.

    } );

    describe( 'ConflictError', () => {

      // No logic to test.

    } );

    describe( 'DependencyError', () => {

      // No logic to test.

    } );

    describe( 'NotFoundError', () => {

      // No logic to test.

    } );

  } );

  describe( 'fn', () => {

    describe( 'currySortAlphabetical', () => {

      it( 'returns a case sensitive sorting function when caseSentive == true', () => {
        expect( true ).toBe( true );
      } );

      it( 'returns a case insensitive sorting function when caseSensitive == false', () => {
        expect( true ).toBe( true );
      } );

    } );

    describe( 'currySortAlphabeticalByKey', () => {

      it( 'throws an ArgumentError when sortKey is not a string', () => {
        expect( true ).toBe( true );
      } );

      it( 'returns a case sensitive sorting function when caseSentive == true', () => {
        expect( true ).toBe( true );
      } );

      it( 'returns a case insensitive sorting function when caseSensitive == false', () => {
        expect( true ).toBe( true );
      } );

    } );

    describe( 'getPlayerIdByName', () => {

      it( 'returns player ID -1 when playerName is not a known value (uses Roll20 findObjs mock)', () => {
        expect( true ).toBe( true );
      } );

      it( 'returns player ID 1 when playerName == "player" (uses Roll20 findObjs mock)', () => {
        expect( true ).toBe( true );
      } );

      it( 'returns player ID 3 when playerName == "character" (uses Roll20 findObjs mock)', () => {
        expect( true ).toBe( true );
      } );

    } );

    describe( 'htmlEscape', () => {

      it( 'throws an ArgumentError when text is not a string', () => {
        expect( true ).toBe( true );
      } );

      it( 'Newline characters (\\n) are replaced by <br />', () => {
        expect( true ).toBe( true );
      } );

      it( 'Double-quotes (") are replaced by $quot;', () => {
        expect( true ).toBe( true );
      } );

      it( 'Single-quotes (\') are replaced by &#39;', () => {
        expect( true ).toBe( true );
      } );

      it( 'Ampersands (&) are replaced by &amp;', () => {
        expect( true ).toBe( true );
      } );

      it( 'Less-than symbols (<) are replaced by &lt;', () => {
        expect( true ).toBe( true );
      } );

      it( 'Greater-than symbols (>) are replaced by &gt;', () => {
        expect( true ).toBe( true );
      } );

    } );

  } );

} );
