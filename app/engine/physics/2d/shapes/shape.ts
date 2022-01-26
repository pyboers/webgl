import { Box2, Vector2, Vector3 } from "three";
import { Body } from "../bodies/body";
import { CollisionHit } from "../constraints/collision-hit";
import { AABB } from "./aabb";
import { Circle } from "./circle";

export type ShapeType = 0 | 1;
export namespace ShapeTypes{
    export var circle: ShapeType = 0;
    export var aabb: ShapeType = 1;
}

export function getCollisionInfo(a: Shape, b: Shape): CollisionHit | null{
    switch(a.getShapeType()){
        case ShapeTypes.circle:
            switch(b.getShapeType()){
                case ShapeTypes.circle:
                    return getCircleCircleCollisionInfo(a as Circle, b as Circle);
                case ShapeTypes.aabb:
                    
                    return getCircleAABBCollisionInfo(b as AABB, a as Circle);
            }
        case ShapeTypes.aabb:
            switch(b.getShapeType()){
                case ShapeTypes.circle:
                    return getCircleAABBCollisionInfo(a as AABB, b as Circle);
                case ShapeTypes.aabb:
                    return null;
            }
    }

    return null;
}


function getCircleCircleCollisionInfo(c1: Circle, c2: Circle): CollisionHit | null {
    const sphereDiff = c2.position.clone().sub(c1.position);
    const dist2 = sphereDiff.lengthSq();
    if(dist2 > ((c1.radius + c2.radius) * (c1.radius + c2.radius)))
        return null;
    
    const direction = sphereDiff.clone().normalize();
    const intersectionLength = (c1.radius + c2.radius)  - Math.sqrt(dist2);
    const point = direction.clone().multiplyScalar(c1.radius - intersectionLength);
    return new CollisionHit(direction, intersectionLength, point, c1.body, c2.body);
}

function getCircleAABBCollisionInfo(a: AABB, c: Circle) {
    const relativePosition = c.position.clone().sub(a.position);
    const d = relativePosition.clone();
    if (d.x < -a.hwidth) {
        d.setX(-a.hwidth);
    } else if (d.x > a.hwidth) {
        d.setX(a.hwidth);
    }
    if (d.y < -a.hheight) {
        d.setY(-a.hheight);
    } else if (d.y > a.hheight) {
        d.setY(a.hheight);
    }
    const point = d.clone();
    const sqdistance = relativePosition.clone().sub(d).lengthSq();;
    if (sqdistance < (c.radius * c.radius)) {
        if (sqdistance == 0) {
            if (Math.abs(a.hwidth - Math.abs(d.x)) < Math.abs(a.hheight - Math.abs(d.y))) {
                if (d.x > 0) {
                    d.setX((a.hwidth - d.x) + c.radius);
                } else {
                    d.setX((-a.hwidth - d.x) - c.radius);
                }

                d.setY(0);
            } else {
                if (d.y > 0) {
                    d.setY((a.hheight - d.y) + c.radius);
                } else {
                    d.setY((-a.hheight - d.y) - c.radius);
                }

                d.setX(0);
            }
        } else {
            d.setX(relativePosition.x - d.x);
            d.setY(relativePosition.y - d.y);
            const length = c.radius - d.length();
            d.normalize().multiplyScalar(length);
        }
        
        return new CollisionHit(d.clone().normalize().negate(), d.length(), point.add(a.position), c.body, a.body);
    }
    return null;
}

function getAABBAABBCollisionInfo(a: AABB, b: AABB){
    return null;
}

export abstract class Shape{
    position: Vector2;
    body: Body;

    constructor(body: Body){
        this.position = body.position;
        this.body = body;
        body.shapes.push(this);
    }

    abstract getSupportPoint(dir: Vector2): Vector2;

    abstract getNearestPoint(point: Vector2): Vector2;

    abstract boundsIntersect(bounds: Box2): boolean;

    abstract getBounds(): Box2;

    abstract getShapeType(): ShapeType;
}