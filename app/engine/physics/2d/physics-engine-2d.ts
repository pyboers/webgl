import { Box2, Vector2 } from "three";
import { Body } from "./bodies/body";
import { BruteForce } from "./collision-detection/brute-force";
import { CollisionDetector } from "./collision-detection/collision-detector";
import { SpatialHash } from "./collision-detection/spatial-hash";
import { IterativeSolver } from "./constraints/solver";

export class PhysicsEngine2D {
    bodies: Body[];
    collisionDetector: CollisionDetector;
    frequency: number;

    constructor(frequency: number){
        this.bodies = [];
        this.collisionDetector = new SpatialHash(0.05, new Box2(new Vector2(-1.5, -1.5), new Vector2(1.5, 1.5)));
        // this.collisionDetector = new BruteForce();
        this.frequency = frequency;
    }


    update(dt: number){
        this.collisionDetector.update();
        dt/= this.frequency;
        for(let step = 0; step < this.frequency; step++){
    
            for(let body of this.bodies){
                body.integrate(dt);
            }
    
            IterativeSolver.solve(this.collisionDetector.getCollisions(), dt, 16);
    
            for(let body of this.bodies){
                body.step(dt);
            }
        }
    }

    addBody(b: Body){
        this.bodies.push(b);
        this.collisionDetector.insert(b);
    }
}