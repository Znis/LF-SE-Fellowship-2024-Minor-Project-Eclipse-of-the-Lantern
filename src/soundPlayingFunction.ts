import { voice } from "./sounds";
import { GameState, stateVariables } from "./stateVariables";
import { distance } from "./utils/util";

interface sound{
    audio: HTMLAudioElement,
    hasPlayed: boolean,
    canPlayAgain: boolean,
}

export function playSound(sound: sound, probability: number) {
    if (!sound.audio.paused) return;
    if(sound.hasPlayed && !sound.canPlayAgain) return;
    if(Math.random() < probability){
    if (sound.audio) {
      sound.audio.pause();
      sound.audio.currentTime = 0;
    }
    sound.audio.play();
    sound.hasPlayed = true;
  }
  }

export function playSoundandVoice(){
    if(stateVariables.player.health < 30 && stateVariables.gameState == GameState.running){
        playSound(voice.idontfeelsogood, 0.01);
      }

    if(distance(stateVariables.player.startPoint, stateVariables.boss.startPoint) < 200){
        playSound(voice.isthatboss, 0.01);
    }
    if(stateVariables.lantern.maxRadiusInnerCircle < 80 && stateVariables.gameState == GameState.running){
        playSound(voice.lanternrunningout, 0.01);
        }
    if(stateVariables.gameState == GameState.running){
        playSound(voice.wind, 1);
    }
}