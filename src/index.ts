/*

SPACE INVADERS

You are in charge of protecting the earth. Enemies appear from space and you need to shoot them before they get through your defense line.

Gameplay

You control a sprite who can move side to side using the keyboard keys '←' '→'. You can shoot by pressing '↑' or 'space'.
Enemies enter from the top of the screen and defend. It's your job to shoot them before they reach the bottom of the screen!
You have 10 lives (each enemy that gets through will deplete you one life).

*/
import {Application} from "./controllers";
import {Game} from "./models";
import {UserInterface} from "./views";

const game = new Game();
const ui = new UserInterface(game);

const App = new Application(game, ui);

App.StartGame();
