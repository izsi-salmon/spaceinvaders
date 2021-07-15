import {UserInterface} from "../views";
import {Game} from "../models";

type MyConsole = {log: (input: string) => void};

export class Application {
  ui: UserInterface;
  game: Game;

  constructor(output: MyConsole, game:Game, ui:UserInterface) {
    this.game = game;
    this.ui = ui;
  }

}
