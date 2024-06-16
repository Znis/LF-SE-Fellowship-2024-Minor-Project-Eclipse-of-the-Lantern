import { Point } from "../shapes/point";
export function distance(a: Point, b:Point){
const dx = b.x - a.x;
const dy = b.y - a.y;
const dist = Math.sqrt(dx**2 + dy**2);
return dist;
}