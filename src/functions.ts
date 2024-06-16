import { stateVariables } from './stateVariables';
import { Character } from './character';
import {Maps} from './maps';

export function preload(){
     stateVariables.player = new Character();
     stateVariables.player.initialiseImages("assets/character/images/",4);
     stateVariables.player.direction = 'r';
     stateVariables.player.startPoint.x=stateVariables.windowWidth/2;
     stateVariables.player.startPoint.y=stateVariables.windowHeight/2;
     
     stateVariables.bgImage = new Maps("main-map.jpg");

    }