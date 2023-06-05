import { lookupIdentifier } from "../token/token";
import { Token, TokenType } from "../token/types";

export class Lexer {
  private position: number = 0;
  private readPosition: number = 0;
  private currentCharacter: string = "";

  constructor(private readonly input: string) {
    this.readCharacter();
  }

  private readCharacter(): void {
    if (this.readPosition >= this.input.length) {
      this.currentCharacter = "";
    } else {
      this.currentCharacter = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private isLetter(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private readIdentifier(): string {
    const previousPosition = this.position;

    while (this.isLetter(this.currentCharacter)) {
      this.readCharacter();
    }

    return this.input.substring(previousPosition, this.position);
  }

  private readNumber(): string {
    const previousPosition = this.position;
    while (this.isDigit(this.currentCharacter)) {
      this.readCharacter();
    }

    return this.input.substring(previousPosition, this.position);
  }

  private skipWhitespace(): void {
    while (
      this.currentCharacter === " " ||
      this.currentCharacter === "\t" ||
      this.currentCharacter === "\n" ||
      this.currentCharacter === "\r"
    ) {
      this.readCharacter();
    }
  }

  private peekCharacter(): string {
    if (this.readPosition >= this.input.length) {
      return "";
    }

    return this.input[this.readPosition];
  }

  public nextToken(): Token {
    this.skipWhitespace();

    let token: Token;

    switch (this.currentCharacter) {
      case "=":
        if (this.peekCharacter() === "=") {
          const currentCharacter = this.currentCharacter;
          this.readCharacter();
          const literal = currentCharacter + this.currentCharacter;
          token = { type: TokenType.EQ, literal };
        } else {
          token = { type: TokenType.ASSIGN, literal: "=" };
        }
        break;
      case ";":
        token = { type: TokenType.SEMICOLON, literal: ";" };
        break;
      case "(":
        token = { type: TokenType.LPAREN, literal: "(" };
        break;
      case ")":
        token = { type: TokenType.RPAREN, literal: ")" };
        break;
      case ",":
        token = { type: TokenType.COMMA, literal: "," };
        break;
      case "+":
        token = { type: TokenType.PLUS, literal: "+" };
        break;
      case "-":
        token = { type: TokenType.MINUS, literal: "-" };
        break;
      case "/":
        token = { type: TokenType.SLASH, literal: "/" };
        break;
      case "*":
        token = { type: TokenType.ASTERISK, literal: "*" };
        break;
      case "<":
        token = { type: TokenType.LT, literal: "<" };
        break;
      case ">":
        token = { type: TokenType.GT, literal: ">" };
        break;
      case "{":
        token = { type: TokenType.LBRACE, literal: "{" };
        break;
      case "}":
        token = { type: TokenType.RBRACE, literal: "}" };
        break;
      case "!":
        if (this.peekCharacter() === "=") {
          const literal = this.currentCharacter + this.peekCharacter();
          this.readCharacter();
          token = { type: TokenType.NOT_EQ, literal };
        } else {
          token = { type: TokenType.BANG, literal: "!" };
        }
        break;
      case "":
        token = { type: TokenType.EOF, literal: "" };
        break;
      default:
        if (this.isLetter(this.currentCharacter)) {
          const literal = this.readIdentifier();
          const type = lookupIdentifier(literal);

          return { type, literal };
        } else if (this.isDigit(this.currentCharacter)) {
          const literal = this.readNumber();

          return { type: TokenType.INT, literal };
        } else {
          token = { type: TokenType.ILLEGAL, literal: this.currentCharacter };
        }

        break;
    }

    this.readCharacter();

    return token;
  }
}
