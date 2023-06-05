import readline from "readline";
import process from "process";
import { Lexer } from "../lexer/lexer";

export class Repl {
  constructor(private readonly prompt = ">> ") {}

  public start(): void {
    // Read from stdin, using the REPL_PROMPT as a prompt for the user.
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.prompt,
    });

    // Display the prompt.
    rl.prompt();

    // Read a line from stdin.
    rl.on("line", (line) => {
      // Display the prompt.

      // Create a lexer for the line.
      const lexer = new Lexer(line);

      // Read all the tokens from the lexer.
      for (
        let token = lexer.nextToken();
        token.type !== "EOF";
        token = lexer.nextToken()
      ) {
        console.log(
          `token.literal = "${token.literal}" | token.type = "${token.type}"`
        );
      }
      console.log("lexer.nextToken() = ", lexer.nextToken());

      rl.prompt();
    });

    // Close the REPL.
    rl.on("close", () => {
      console.log("bye!");
      process.exit(0);
    });
  }
}
