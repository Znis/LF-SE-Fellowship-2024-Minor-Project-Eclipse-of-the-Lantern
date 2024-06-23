import { GameState, inventory, stateVariables } from "./stateVariables";
import { getMouseCoords } from "./functions";
import { calculateAngle } from "./utils/util";
import { Point } from "./shapes/point";
import { FireProjectile } from "./weapons/fireProjectile";

window.addEventListener(
  "keydown",
  function (e) {
    stateVariables.keyState[e.keyCode || e.which] = true;
  },
  true
);
window.addEventListener(
  "keyup",
  function (e) {
    stateVariables.keyState[e.keyCode || e.which] = false;
  },
  true
);

window.addEventListener(
  "mousemove",
  function (e) {
    stateVariables.mouseCoords = getMouseCoords(e);
  },
  true
);

window.addEventListener(
  "click",
  function () {
    if (stateVariables.gameState != GameState.running) {
      stateVariables.mainMenu.handleSelect();
    }
  },
  true
);

export const mousepress = window.addEventListener("click", () => {
  if (
    stateVariables.gameState == GameState.running &&
    !stateVariables.player.isBlowingLantern &&
    stateVariables.player.health > 0
  ) {
    const angle =
      calculateAngle(
        new Point(stateVariables.mouseCoords.x, stateVariables.mouseCoords.y),
        stateVariables.player.startPoint
      ) *
      (180 / Math.PI);
    if (angle >= -45 && angle < 45) {
      stateVariables.player.direction = "r";
    } else if (angle >= 45 && angle < 135) {
      stateVariables.player.direction = "d";
    } else if (angle >= -135 && angle < -45) {
      stateVariables.player.direction = "u";
    } else {
      stateVariables.player.direction = "l";
    }
    if(stateVariables.player.abilityMode){
      stateVariables.player.useAbility("flame");
    }
    else if (stateVariables.player.currWeapon == "gun") {
      if (inventory.ammo > 0) {
        stateVariables.player.isAttacking = true;
        stateVariables.gun.fire();
      } else {
        stateVariables.inventory.displayMessage(stateVariables.ctx, "ammo");
      }
    } else if (stateVariables.player.currWeapon == "axe") {
      stateVariables.player.isAttacking = true;
      stateVariables.axe.calculateShockPoint();
    }
  }
});

let refuelTimeout: number | null = null;
let healTimeout: number | null = null;
export function handleControls() {
  if (stateVariables.keyState[87] && stateVariables.keyState[68]) {
    stateVariables.player.direction = "u";
    stateVariables.player.dirX = -0.72;
    stateVariables.player.dirY = 0.72;
    stateVariables.player.move();
  } else if (stateVariables.keyState[87] && stateVariables.keyState[65]) {
    stateVariables.player.direction = "u";
    stateVariables.player.dirX = 0.72;
    stateVariables.player.dirY = 0.72;
    stateVariables.player.move();
  } else if (stateVariables.keyState[83] && stateVariables.keyState[65]) {
    stateVariables.player.direction = "d";
    stateVariables.player.dirX = 0.72;
    stateVariables.player.dirY = -0.72;
    stateVariables.player.move();
  } else if (stateVariables.keyState[83] && stateVariables.keyState[68]) {
    stateVariables.player.direction = "d";
    stateVariables.player.dirX = -0.72;
    stateVariables.player.dirY = -0.72;
    stateVariables.player.move();
  } else if (stateVariables.keyState[65]) {
    stateVariables.player.direction = "l";
    stateVariables.player.dirX = 1;
    stateVariables.player.dirY = 0;
    stateVariables.player.move();
  } else if (stateVariables.keyState[68]) {
    stateVariables.player.direction = "r";
    stateVariables.player.dirX = -1;
    stateVariables.player.dirY = 0;
    stateVariables.player.move();
  } else if (stateVariables.keyState[83]) {
    stateVariables.player.direction = "d";
    stateVariables.player.dirX = 0;
    stateVariables.player.dirY = -1;
    stateVariables.player.move();
  } else if (stateVariables.keyState[87]) {
    stateVariables.player.direction = "u";
    stateVariables.player.dirX = 0;
    stateVariables.player.dirY = 1;
    stateVariables.player.move();
  } else {
    stateVariables.player.frameToShow = 0;
    stateVariables.player.dirX = 0;
    stateVariables.player.dirY = 0;
    stateVariables.player.isWalking = false;
  }

  if (stateVariables.keyState[76]) {
    stateVariables.debugCollider = true;
  } else {
    stateVariables.debugCollider = false;
  }

  if (stateVariables.keyState[69]) {
    stateVariables.player.useAbility("light");
  }
  if (stateVariables.keyState[82]) {
    if (stateVariables.inventory.abilities[1].cooldown == 0) {
    stateVariables.player.abilityMode = true;
    } else {
      stateVariables.inventory.displayMessage(
        stateVariables.ctx,
        "",
        "Ability on Cooldown!"
      );
    }
  }else{
    stateVariables.player.abilityMode = false;
  }
  if (stateVariables.keyState[16]) {
    stateVariables.player.frameTime = 2;
    stateVariables.player.increaseSpeed();
    stateVariables.player.isRunning = true;

  } else {
    stateVariables.player.movement_speed = stateVariables.player.default_speed;
    stateVariables.player.frameTime = 4;
    stateVariables.player.isRunning = false;

  }

  if (stateVariables.keyState[81]) {
    stateVariables.player.currWeapon =
      stateVariables.player.currWeapon == "axe" ? "gun" : "axe";
  }

  if (stateVariables.keyState[32]) {
    if (!healTimeout && stateVariables.player.health > 0) {
      if (inventory.medKit > 0) {
        stateVariables.healStart = new Date().getTime();
        stateVariables.isHoldingHealKey = true;
        stateVariables.player.isUsingMedkit = true;
        healTimeout = setTimeout(() => {
          stateVariables.player.increaseHealth();
          healTimeout = null;
          stateVariables.player.isUsingMedkit = false;
          stateVariables.isHoldingHealKey = false;
          stateVariables.healStart = null;
        }, stateVariables.healDuration);
      } else {
        stateVariables.inventory.displayMessage(
          stateVariables.ctx,
          "health_pack"
        );
      }
    }
  } else {
    if (healTimeout && stateVariables.player.health > 0) {
      clearTimeout(healTimeout);
      healTimeout = null;
      stateVariables.isHoldingHealKey = false;
      stateVariables.player.isUsingMedkit = false;
      stateVariables.healStart = null;
    }
  }

  if (stateVariables.keyState[70]) {
    if (!refuelTimeout && stateVariables.player.health > 0) {
      if (inventory.fuel > 0) {
        stateVariables.refuelStart = new Date().getTime();
        stateVariables.isHoldingRefuelKey = true;
        stateVariables.player.isBlowingLantern = true;
        refuelTimeout = setTimeout(() => {
          stateVariables.lantern.resetLuminosity();
          inventory.fuel--;
          refuelTimeout = null;
          stateVariables.player.isBlowingLantern = false;
          stateVariables.isHoldingRefuelKey = false;
          stateVariables.refuelStart = null;
        }, stateVariables.refuelDuration);
      } else {
        stateVariables.inventory.displayMessage(stateVariables.ctx, "fuel");
      }
    }
  } else {
    if (refuelTimeout && stateVariables.player.health > 0) {
      clearTimeout(refuelTimeout);
      refuelTimeout = null;
      stateVariables.isHoldingRefuelKey = false;
      stateVariables.player.isBlowingLantern = false;
      stateVariables.refuelStart = null;
    }
  }
}
