import { Box2, Vector2 } from "three";
import { Body } from "../bodies/body";
import { CollisionHit } from "../constraints/collision-hit";
import { Shape, ShapeType, ShapeTypes } from "./shape";

export class AABB extends Shape{
    hwidth: number;
    hheight: number;

    constructor(hwidth: number, hheight: number, body: Body){
        super(body);
        this.hwidth = hwidth;
        this.hheight = hheight;
    }

    getSupportPoint(dir: Vector2): Vector2 {
        throw new Error("Method not implemented.");
    }
    getNearestPoint(point: Vector2): Vector2 {
        throw new Error("Method not implemented.");
    }
    
    getShapeType(): ShapeType {
        return ShapeTypes.aabb;
    }

    boundsIntersect(bounds: Box2): boolean {
        const b = this.getBounds();

        return bounds.intersectsBox(b);
    }

    getBounds(): Box2 {
        const max = new Vector2(this.hwidth, this.hheight).add(this.position);
        const min = new Vector2(-this.hwidth, -this.hheight).add(this.position);

        return new Box2(min, max);
    }

}