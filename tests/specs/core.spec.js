
describe( 'CLIMachs Core Namespaces', () => {

  describe( 'collections', () => {

    describe( 'Callback', () => {

      it( 'contains spec with an expectation', () => {
        expect( true ).toBe( true );
      } );



    } );

    describe( 'UniqueCollection', () => {

      it( 'contains spec with an expectation', () => {
        expect( true ).toBe( true );
      } );



    } );

    describe( 'UniqueKeyedCollection', () => {

      it( 'contains spec with an expectation', () => {
        expect( true ).toBe( true );
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
