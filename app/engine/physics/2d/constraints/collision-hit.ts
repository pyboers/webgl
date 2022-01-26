import { Vector2 } from "three";
import { Constraint } from "./constraint";
import { Body } from "../bodies/body";

export class CollisionHit implements Constraint{
    bodyA: Body;
    bodyB: Body;
    normal: Vector2;
    distance: number;
    point: Vector2;

    divisorN: number;

    normalImpulseSum: number;

    constructor(normal: Vector2, distance: number, point: Vector2, bodyA: Body, bodyB: Body){
        this.normal = normal;
        this.distance = distance;
        this.point = point
        this.bodyA = bodyA;
        this.bodyB = bodyB;
        this.normalImpulseSum = 0;

        this.divisorN = 1/(bodyA.invMass + bodyB.invMass);
    }

    getBiasImpulse(dt: number){
        const slop = 0.001;
        const strength = 0.1;
        const s = this.distance - slop;
        return (strength/dt) * Math.max(0, s);
    }

    solve(dt: number): void {
        const relativeVelocity = this.bodyB.velocity.clone().sub(this.bodyA.velocity);
        const normalVelocity = relativeVelocity.dot(this.normal.clone());
        let j = (((normalVelocity) - this.getBiasImpulse(dt)) * this.divisorN);

        const nIS = this.normalImpulseSum;
        this.normalImpulseSum += j;
        this.normalImpulseSum = Math.min(this.normalImpulseSum, 0);
        j = this.normalImpulseSum - nIS;

        const normalImpulse = this.normal.clone().multiplyScalar(j);
        this.bodyA.applyImpulse(normalImpulse);
        this.bodyB.applyImpulse(normalImpulse.clone().negate());

    }
}