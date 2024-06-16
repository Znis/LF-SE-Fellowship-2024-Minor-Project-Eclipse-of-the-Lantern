import { stateVariables } from './stateVariables';
import './style.css';
import './controls';
import { preload } from './functions';

const canvas = document.querySelector("#gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = stateVariables.windowWidth;
canvas.height = stateVariables.windowHeight;

preload();

function draw(){
    stateVariables.bgImage.show(ctx);
    stateVariables.player.show(ctx);


    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
