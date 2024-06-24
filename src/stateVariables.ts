import { AnimateEntity } from './animation.ts';
import { BloodParticle } from './particles/bloodParticle.ts';
import { BulletProjectile } from './weapons/bulletProjectile.ts';
import {Character} from './character.ts';
import { Enemy } from './enemy.ts';
import { Lantern } from './lantern.ts';
import { Maps } from './maps.ts';
import { Ui } from './ui.ts';
import { MenuScreen } from './menuScreen.ts';
import { PickupItems } from './pickupItems.ts';
import { Inventory } from './inventory.ts';
import { Axe } from './weapons/axe.ts';
import { Gun } from './weapons/gun.ts';
import { Boss } from './boss.ts';
import { FireProjectile } from './weapons/fireProjectile.ts';

type stateVariables = {
    refuelStart: number | null;
    healStart: number | null;
    ctx: CanvasRenderingContext2D;
    player: Character;
    bgImage: Maps;
    inventory: Inventory,
    windowWidth: number;
    windowHeight: number;
    debugCollider: boolean;
    adjustDeviceColliderX: number;
    adjustDeviceColliderY: number;
    bulletProjectileArray: BulletProjectile[];
    fireProjectileArray: FireProjectile[];
    lantern: Lantern;
    isHoldingRefuelKey: boolean;
    refuelDuration: number;
    isHoldingHealKey: boolean;
    healDuration: number;
    enemiesArray: Enemy[];
    animateEnemyArray: AnimateEntity[];
    bloodParticleArray: BloodParticle[];
    ui: Ui,
    rain: boolean,
    reqAnimFrame: number,
    keyState:  {[key: number]: boolean},
    mainMenu: MenuScreen;
    mouseCoords: {[key:string]: number},
    gameState: GameState,
    pickupItemsArray: PickupItems[],
    animatePickupItemsArray: AnimateEntity[],
    cursorImage: HTMLImageElement,
    axe: Axe,
    gun: Gun,
    boss: Boss,
    flameImages: HTMLImageElement[],

}


export const keyDown = {
    "Q": false,
    "F": false,
    "E": false,
    "R": false,
    "SPACE": false
}

export enum GameState {
    menuScreen = "welcomeScreen",
    running = "running",
    paused = "paused",
    resume = "resume",
    retryScreen = "retryScreen",
    restart = "restart",
    gameFinish = "gameFinish",
  }

type difficultySetting = {
[key: number]: {
    [key:string]: number,
};
}

export const difficultySetting: difficultySetting = {
    0: {
        enemySpeed: 2,
        enemyMinHealth: 1,
        enemyMaxHealth: 3,
        enemyAttackDamage: 0.5,

    },
    1: {
        enemySpeed: 2.5,
        enemyMinHealth: 2,
        enemyMaxHealth: 5,
        enemyAttackDamage: 1,

    },
    2: {
        enemySpeed: 3,
        enemyMinHealth: 3,
        enemyMaxHealth: 6,
        enemyAttackDamage: 1.5,

    }

}

export const pickupItemsTypes = {
    health_pack: { 
        itemName: "health_pack",
        images_path: "assets/pickups/health_pack/",
     },
    fuel: {
        itemName: "fuel",
    },
    ammo:{
        itemName: "ammo",
        count: 20,
    }
}

export const inventory = {
    medKit: 0,
    fuel: 0,
    ammo: 100,
    weapons: {
        "axe": {
            damage: 2,
        },
        "gun":{
            damage: 1,
        }
    }
}



export const gameOptions = {
difficultyLevel: 0,
character: "Ophelia",
}
// interface GameStateArgs{
    
// }
// class GameState{
//     constructor()
// }
export const stateVariables: stateVariables = {
    ctx: {} as CanvasRenderingContext2D,
    player: {} as Character,
    bgImage: {} as Maps,
    inventory: {} as Inventory,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    debugCollider: false,
    adjustDeviceColliderX: (window.innerWidth-1536)/2,
    adjustDeviceColliderY: (window.innerHeight-753)/2,
    bulletProjectileArray: [] as BulletProjectile[],
    fireProjectileArray: [] as FireProjectile[],
    lantern: {} as Lantern,
    refuelStart: 0,
    isHoldingRefuelKey: false,
    healStart: 0,
    isHoldingHealKey: false,
    refuelDuration: 2000,
    healDuration: 1000,
    enemiesArray: [] as Enemy[],
    animateEnemyArray: [] as AnimateEntity[],
    bloodParticleArray: [] as BloodParticle[],
    ui: {} as Ui,
    rain: true,
    reqAnimFrame: 0,
    keyState: {},
    mainMenu: {} as MenuScreen,
    mouseCoords: {x: 0, y:0},
    gameState: GameState.menuScreen,
    pickupItemsArray: [] as PickupItems[],
    animatePickupItemsArray: [] as AnimateEntity[],
    cursorImage: {} as HTMLImageElement,
    axe: {} as Axe,
    gun: {} as Gun,
    boss: {} as Boss,
    flameImages: [] as HTMLImageElement[],

}