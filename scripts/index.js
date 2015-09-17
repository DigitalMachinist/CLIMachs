
var CLIMachs = CLIMachs || {

  utilities: {

    htmlEscape: function htmlEscape( str ) {
      return String( str )
        .replace( /\n/g, '<br />' )
        .replace( /"/g,  '&quot;' )
        .replace( /'/g,  '&#39;'  )
        .replace( /&/g,  '&amp;'  )
        .replace( /</g,  '&lt;'   )
        .replace( />/g,  '&gt;'   );
    },

    htmlUnescape: function htmlUnescape( value ) {
      return String( value )
        .replace( /<br \/>/g, '\n' )
        .replace( /&quot;/g,  '"'  )
        .replace( /&#39;/g,   "'"  )
        .replace( /&amp;/g,   '&'  )
        .replace( /&lt;/g,    '<'  )
        .replace( /&gt;/g,    '>'  );
    },

    rawWrite: function ( s, to, style, from ) {
      s = s.replace( /\n/g, "<br>" );
      s = "<div style=\"white-space: pre-wrap; padding: 0px; margin: 0px" + ( style ? "; " + style : "" ) + "\">" + s +
        "</div>";
      if ( to ) {
        s = "/w " + to.split( " ", 1 )[ 0 ] + " " + s;
      }
      sendChat( ( typeof ( from ) == typeof ( "" ) ? from : "Shell" ), s );
    },

    write: function ( s, to, style, from ) {
      CLIMachs.utilities.rawWrite( CLIMachs.utilities.htmlEscape( s ), to, style, from );
    },

    writeAndLog: function ( s, to ) {
      CLIMachs.utilities.write( s, to );
      _.each( s.split( '\n' ), log );
    },

    writeErr: function ( s ) {
      Shell.writeAndLog( s, "gm" );
    }

  }

};
