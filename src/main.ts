import { GameState, stateVariables } from "./stateVariables";
import "./style.css";
import "./controls";
import {
  adjustCanvasSize,
  checkHitToBoss,
  checkHitToEnemy,
  checkPlayerHealthAndLanternLuminosity,
  debugColliderMode,
  displayCursorImage,
  drawChannelledAnimation,
  handleBoss,
  handleEnemies,
  handlePickupItems,
  handleProjectiles,
  preload,
  renderInventory,
  renderMainMenu,
  renderUi,
} from "./functions";
import { handleControls } from "./controls";
import { playSound, playSoundandVoice } from "./soundPlayingFunction";
import { voice } from "./sounds";

export const canvas = document.querySelector(
  "#gameCanvas"
) as HTMLCanvasElement;
stateVariables.ctx = canvas.getContext("2d")!;

canvas.width = stateVariables.windowWidth;
canvas.height = stateVariables.windowHeight;

preload();

function draw() {
  adjustCanvasSize();
  stateVariables.bgImage.show();


playSoundandVoice();

  if (stateVariables.gameState == GameState.running) {
    if (stateVariables.rain) stateVariables.ui.renderRainParticles();
    handlePickupItems();
    checkHitToEnemy();
    stateVariables.player.show();
    handleEnemies();
    handleBoss();
    checkHitToBoss();
    stateVariables.bgImage.showDepth();
    stateVariables.lantern.showLuminosity();
    stateVariables.lantern.changeLuminosity();
    handleProjectiles();
    renderUi();
    renderInventory();
    handleControls();

    if (
      stateVariables.enemiesArray.length == 0 &&
      !stateVariables.boss.isAlive
    ) {
      playSound(voice.wedidit, 1);
      stateVariables.gameState = GameState.gameFinish;
    }

    stateVariables.axe.calculateShockPoint();

    if (
      stateVariables.isHoldingRefuelKey &&
      stateVariables.refuelStart != null
    ) {
      drawChannelledAnimation();
    }

    if (stateVariables.isHoldingHealKey && stateVariables.healStart != null) {
      drawChannelledAnimation();
    }
    checkPlayerHealthAndLanternLuminosity();
  }

  if (
    stateVariables.gameState == GameState.menuScreen ||
    stateVariables.gameState == GameState.retryScreen
  ) {
    stateVariables.lantern.showLuminosity();
    stateVariables.ui.renderBloodOverlay();
    stateVariables.lantern.maxRadiusInnerCircle = 10;
    renderMainMenu();
  }

  if (stateVariables.gameState == GameState.paused) {
    stateVariables.lantern.showLuminosity();
    stateVariables.ui.renderBloodOverlay();
    renderMainMenu();
  }

  if (stateVariables.debugCollider) {
    debugColliderMode();
  }

  displayCursorImage();

  stateVariables.reqAnimFrame = requestAnimationFrame(draw);
}
stateVariables.reqAnimFrame = requestAnimationFrame(draw);
