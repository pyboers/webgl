import { Box2, Vector2 } from "three";
import { Body } from "../bodies/body";
import { CollisionHit } from "../constraints/collision-hit";
import { AABB } from "../shapes/aabb";
import { getCollisionInfo, Shape } from "../shapes/shape";
import { CollisionDetector } from "./collision-detector";

export class SpatialHash implements CollisionDetector{
    shapes: Shape[];
    cells: Shape[][];
    cellSize: number;
    cellCount: number;
    
    cellCountH: number;
    cellCountW: number;
    bounds: Box2;

    constructor(cellSize: number, bounds: Box2){
        this.cellSize = cellSize;
        this.cellCountW = Math.trunc(((bounds.max.x - bounds.min.x)/cellSize) + 1);
        this.cellCountH = Math.trunc(((bounds.max.y - bounds.min.y)/cellSize) + 1);
        this.cellCount = this.cellCountW * this.cellCountH;
        this.cells = [];
        for(let i = 0; i < this.cellCount; i++){
            this.cells.push([]);
        }
        this.shapes = [];
        this.bounds = bounds;
    }

    clear(){
        this.cells = [];
        for(let i = 0; i < this.cellCount; i++){
            this.cells.push([]);
        }
    }

    hashPoint(x: number, y: number){
        return (x + (y * this.cellCountW)) % (this.cellCount);
    }

    getCollisions(): CollisionHit[] {
        const hits: CollisionHit[] = [];
        for(let cell of this.cells){
            for(let i = 0; i < cell.length -1; i++){
                for(let j = i + 1; j < cell.length; j++){
                    const shapeHit = getCollisionInfo(cell[i], cell[j]);
                    if(shapeHit != null)
                        hits.push(shapeHit);
                }
            }
        }
        return hits;
    }

    insert(body: Body): void {
        for(let shape of body.shapes){
            this.shapes.push(shape);
        }
    }

    update(){
        this.clear();
        for (let shape of this.shapes){
            const bound = shape.getBounds();
            const minx = Math.floor((bound.min.x - this.bounds.min.x) / this.cellSize);
            const maxx = Math.ceil((bound.max.x - this.bounds.min.x) / this.cellSize);
            const miny = Math.floor((bound.min.y - this.bounds.min.y) / this.cellSize);
            const maxy = Math.ceil((bound.max.y - this.bounds.min.y) / this.cellSize);

            for(let i = minx; i < maxx; i++){
                for(let j = miny; j< maxy; j++){
                    const cellId = this.hashPoint(i, j);
                    this.cells[cellId].push(shape);
                }
            }
        }
    }

    query(bound: Box2): Shape[] {
        const minx = Math.floor((bound.min.x - this.bounds.min.x) / this.cellSize);
        const maxx = Math.ceil((bound.max.x - this.bounds.min.x) / this.cellSize);
        const miny = Math.floor((bound.min.y - this.bounds.min.y) / this.cellSize);
        const maxy = Math.ceil((bound.max.y - this.bounds.min.y) / this.cellSize);
        
        const shapes: Shape[] = [];
        for(let i = minx; i <= maxx; i++){
            for(let j = miny; j<= maxy; j++){
                for(let shape of this.cells[this.hashPoint(i, j)]){
                    if(shape.getBounds().intersectsBox(bound))
                        shapes.push(shape);
                }
                    
            }
        }
        return shapes;
    }

}