import { Box2 } from "three";
import { Body } from "../bodies/body";
import { CollisionHit } from "../constraints/collision-hit";
import { getCollisionInfo, Shape } from "../shapes/shape";
import { CollisionDetector } from "./collision-detector";

export class BruteForce implements CollisionDetector{
    shapes: Shape[];

    constructor(){
        this.shapes = [];
    }
    update(): void {
        
    }

    query(bounds: Box2): Shape[] {
        const hits: Shape[] = [];
        for(let shape of this.shapes){
            if(shape.boundsIntersect(bounds)){
                hits.push(shape);
            }
        }

        return hits;
    }

    getCollisions(){
        const hits: CollisionHit[] = [];
        for(let i = 0 ; i < this.shapes.length -1; i++){
            for(let j = i + 1; j < this.shapes.length; j++){
                const collision = getCollisionInfo(this.shapes[i], this.shapes[j]);
                if(collision != null){
                    hits.push(collision);
                }
            }
        }

        return hits;
    }


    insert(body: Body): void{
        for(let shape of body.shapes){
            this.shapes.push(shape);
        }
    }
}