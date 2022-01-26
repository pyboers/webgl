import { Vector3 } from "three";
import { CollisionHit } from "../collision-detection/collision-hit";

export type ShapeType = 0 | 1;
export namespace ShapeTypes{
    export var Sphere: ShapeType = 0;
    export var Cube: ShapeType = 1;
}

export abstract class Shape{
    position: Vector3;

    constructor(position: Vector3){
        this.position = position;
    }

    abstract getSupportPoint(dir: Vector3): Vector3;

    abstract getNearestPoint(point: Vector3): Vector3;

    abstract getCollisionInfo(other: Shape): CollisionHit | null;

    abstract getShapeType(): ShapeType;
}