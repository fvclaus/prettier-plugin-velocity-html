lexer grammar VelocityHtmlLexer;

@lexer::header { 
   import { Interval } from 'antlr4ts/misc/Interval';
} 
//@lexer::members { function memberHello() {console.log("hello, Member!");}}
@lexer::members {
   private isNotStartOfVtlReference(offset: number = 0): boolean {
      const currentPosition = this._tokenStartCharIndex + offset;
      const nextTwoCharacters = this.inputStream.getText(Interval.of(currentPosition, currentPosition + 1));
      this.debug('nextCharacters', nextTwoCharacters);
      // Curly braces break formatting of antlr4 plugin
      return nextTwoCharacters !== '$\u007B';
   }

   public isVtlReferenceInsideString = false;

   private makeVtlReferenceInsideToken(): void {
   }

   public isDebugEnabled = false;

   private debug(...something: any[]): void {
     if (this.isDebugEnabled) {
       console.log.apply(undefined, something);
     }
   }
}

TAG_START_OPEN: '<' { this.debug('after TAG_START_OPEN') } -> pushMode(INSIDE_TAG);

TAG_END_OPEN: '<' '/' { this.debug('after TAG_END_OPEN') }-> pushMode(INSIDE_TAG);

HTML_OUTSIDE_TAG_VTL_REFERENCE: VTL_REFERENCE_START  -> skip, pushMode(INSIDE_VELOCITY_REFERENCE);

HTML_TEXT        : {this.isNotStartOfVtlReference()}? ~[ \t\n\r<]+  { this.debug('after HTML_TEXT') };

WS
   : [ \t\n\r] +
   ;

fragment VTL_REFERENCE_START: '$' '{';

mode INSIDE_VELOCITY_REFERENCE;

VTL_IDENTIFIER: [a-zA-Z][a-zA-Z0-9_]* { this.makeVtlReferenceInsideToken() };

VTL_DOT: '.';

VTL_METHOD_OPEN: '(';

VTL_METHOD_CLOSE: ')';

VTL_INSIDE_REFERENCE: '$' VTL_IDENTIFIER;

VTL_VALUE
   : VTL_STRING
   | VTL_NUMBER
   | VTL_INSIDE_REFERENCE;

VTL_STRING
   : '"' (('\\' ~[\\\u0000-\u001F]) |  ~ ["\\\u0000-\u001F])* '"'
   | '\'' (('\\' ~[\\\u0000-\u001F]) |  ~ ['\\\u0000-\u001F])* '\''
   ;

VTL_NUMBER
   : [1-9][0-9]*;

VTL_CLOSE
   : '}' '"'? -> skip, popMode;

VTL_WS
   : [ ] + 
   ;

mode INSIDE_TAG;
HTML_NAME: [a-zA-Z0-9]+ { this.debug('after HTML_NAME') };
EQUAL: '=';
// \- since - means "range" inside [...]

HTML_STRING
   : {this.isNotStartOfVtlReference(1)}?  '"' ( VALID_ESCAPES |  ~ ["\\\u0000-\u001F])* '"'
   // Unescaped one must not contain spaces
   | {this.isNotStartOfVtlReference(1)}? '\'' ( VALID_ESCAPES |  ~ ['\\\u0000-\u001F])* '\''
   ;

// Just allow everything to be escaped.
fragment VALID_ESCAPES: '\\' ~[\\\u0000-\u001F];

HTML_INSIDE_TAG_STRING_VTL_REFERENCE: '"' VTL_REFERENCE_START { this.isVtlReferenceInsideString = true} -> skip, pushMode(INSIDE_VELOCITY_REFERENCE);

TAG_CLOSE: '>' { this.debug('after TAG_CLOSE') } -> popMode;
SELF_CLOSING_TAG_CLOSE :'/' '>' -> popMode;

HTML_TAG_VTL:  VTL_REFERENCE_START -> skip, pushMode(INSIDE_VELOCITY_REFERENCE);

HTML_WS
   : [ \t\n\r] + -> skip
   ;

// handle characters which failed to match any other token
ErrorCharacter : . ;