const ask = require("prompt-sync")();
import {Game} from "../models";

export class UserInterface {
  game: Game;

  constructor(game:Game) {
    this.game = game;
  }


  WelcomeUser(){
    console.log("Welcome to space invaders!");
    console.log("Protect the Earth by shooting the enemy invaders! Use the mouse keys to move side to side, press space to fire. You have 7 lives... if 7 invaders pass through your defences, the earth will be destroyed!");
  }
}
