import { TokenType } from "./types";

export const keywords: Record<string, TokenType> = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
};

export function lookupIdentifier(identifier: string): TokenType {
  return keywords[identifier] || TokenType.IDENT;
}
