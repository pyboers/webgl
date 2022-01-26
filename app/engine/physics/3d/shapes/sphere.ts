import { Vector3 } from "three";
import { CollisionHit } from "../collision-detection/collision-hit";
import { Shape, ShapeTypes } from "./shape";

export class Sphere extends Shape{
    radius: number;

    constructor(position: Vector3, radius: number){
        super(position);
        this.radius = radius;
    }

    getSupportPoint(dir: Vector3): Vector3 {
        return this.position.clone().add(dir.clone().multiplyScalar(this.radius));
    }

    getNearestPoint(point: Vector3): Vector3 {
        return (point.clone().sub(this.position)).normalize();
    }

    getSphereCollisionInfo(sphere: Sphere): CollisionHit | null {
        const sphereDiff = sphere.position.clone().sub(this.position);
        const dist2 = sphereDiff.lengthSq();
        if(dist2 > ((this.radius + sphere.radius) * (this.radius + sphere.radius)))
            return null;
        
        const direction = sphereDiff.clone().normalize();
        const intersectionLength = (this.radius + sphere.radius)  - Math.sqrt(dist2);

        return {
            mtv: direction.clone().multiplyScalar(intersectionLength), 
            point: direction.clone().multiplyScalar(this.radius - intersectionLength)
        };
    }

    getCollisionInfo(other: Shape): CollisionHit | null{
        switch(other.getShapeType()){
            case ShapeTypes.Sphere:
                return this.getSphereCollisionInfo(other as Sphere);
            default:
                return null;
        }
    }

    getShapeType() {
        return ShapeTypes.Sphere;
    }

}