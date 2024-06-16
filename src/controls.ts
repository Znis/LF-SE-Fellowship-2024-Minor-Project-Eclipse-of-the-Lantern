import { stateVariables } from './stateVariables';

export const keyup =  window.addEventListener("keyup", () => {
  stateVariables.player.frameToShow = 0;
});

export const keydown = window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "d": {
        stateVariables.player.moveRight();

        break;
      }
      case "a": {
        stateVariables.player.moveLeft();
        break;
      }
      case "w": {
        stateVariables.player.moveUp();
        break;
      }
      case "s": {
        stateVariables.player.moveDown();
        break;
      }
     
    }
  });