import { Box2, Vector2 } from "three";
import { CollisionHit } from "../constraints/collision-hit";
import { Shape, ShapeTypes } from "./shape";
import { Body } from "../bodies/body";
import { AABB } from "./aabb";

export class Circle extends Shape{
    radius: number;

    constructor(radius: number, body: Body){
        super(body);
        this.radius = radius;
    }

    getSupportPoint(dir: Vector2): Vector2 {
        return this.position.clone().add(dir.clone().multiplyScalar(this.radius));
    }

    getNearestPoint(point: Vector2): Vector2 {
        return (point.clone().sub(this.position)).normalize();
    }

    getShapeType() {
        return ShapeTypes.circle;
    }

    boundsIntersect(bounds: Box2): boolean {
        const b = this.getBounds();
        return bounds.intersectsBox(b);
    }

    getBounds(): Box2 {
        const max = new Vector2(this.radius, this.radius).add(this.position);
        const min = new Vector2(-this.radius, -this.radius).add(this.position);

        return new Box2(min, max);
    }

}