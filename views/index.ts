const ask = require("prompt-sync")();
import {Game} from "../models";

export class UserInterface {
  game: Game;

  constructor(game:Game) {
    this.game = game;
  }
}
