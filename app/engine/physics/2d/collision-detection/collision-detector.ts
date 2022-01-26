import { Box2 } from "three";
import { CollisionHit } from "../constraints/collision-hit";
import { Shape } from "../shapes/shape";
import { Body } from "../bodies/body";

export interface CollisionDetector{

    getCollisions(): CollisionHit[];

    insert(body: Body): void;

    update(): void;
    
    query(bounds: Box2): Shape[];
}