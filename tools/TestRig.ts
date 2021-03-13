import {
  CharStreams,
  CommonToken,
  CommonTokenStream,
  Recognizer,
  Token,
} from "antlr4ts";
import { ATNSimulator } from "antlr4ts/atn/ATNSimulator";
import { VelocityHtmlLexer } from "../src/parser/generated/VelocityHtmlLexer";
import { VelocityHtmlParser } from "../src/parser/generated/VelocityHtmlParser";
import * as fs from "fs";

function main(): void {
  if (process.argv.length < 3) {
    console.error("No file specified");
    process.exit(1);
  }
  const text = fs.readFileSync(process.argv[2], "utf-8");
  const inputStream = CharStreams.fromString(text.toString());
  const lexer = new VelocityHtmlLexer(inputStream);
  const tokens = new CommonTokenStream(lexer);
  tokens.fill();

  tokens.getTokens().forEach((token) => {
    if (token instanceof CommonToken) {
      console.log(token.toString(lexer));
    } else {
      console.log(token.toString());
    }
  });
  //   const errors: Error[] = [];
  //   lexer.removeErrorListeners();
  //   lexer.addErrorListener({
  //     syntaxError(
  //       recognizer: Recognizer<Token, ATNSimulator>,
  //       offendingSymbol,
  //       line,
  //       charPositionInLine,
  //       msg,
  //       e
  //     ) {
  //       errors.push(new Error(msg));
  //     },
  //   });
  //   const tokenStream = new CommonTokenStream(lexer);
  //   console.log(tokenStream);
  //   const parser = new VelocityHtmlParser(tokenStream);
  //   parser.removeErrorListeners();
  //   parser.addErrorListener({
  //     syntaxError(
  //       recognizer: Recognizer<Token, ATNSimulator>,
  //       offendingSymbol,
  //       line,
  //       charPositionInLine,
  //       msg,
  //       e
  //     ) {
  //       errors.push(new Error(msg));
  //     },
  //   });
  //   const jsonContext = parser.document();
  //   if (errors.length > 0) {
  //     throw errors[0];
  //   }
}

main();
