import {  Vector2 } from "three";
import { Component } from "../../../internal/component";
import { GameObject } from "../../../internal/game-object";
import { Shape } from "../shapes/shape";


export class Body implements Component{
    obj: GameObject | undefined;

    position: Vector2;
    velocity: Vector2;
    forces: Vector2;

    invMass: number;
    restitution: number;

    shapes: Shape[];

    constructor(mass: number, restitution: number){
        this.position = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.forces = new Vector2(0, 0);
        this.invMass = mass > 0 ? 1/mass : 0;
        this.shapes = [];
        this.restitution = restitution;
    }
    update(dt: number): void {
        this.obj!.position.set(this.position.x, this.position.y, this.obj!.position.z);
    }

    init(object: GameObject): void {
       this.obj = object;
       this.position.set(object.position.x, object.position.y);
    }

    integrate(dt: number){
        this.velocity.addScaledVector(this.forces, this.invMass * dt);
        this.forces.set(0, 0);
    }

    step(dt: number){
        this.position.addScaledVector(this.velocity, dt);
        
        for(let shape of this.shapes){
            shape.position = this.position;
        }
    }

    applyForces(f: Vector2){
        this.forces.add(f);
    }

    applyImpulse(i: Vector2){
        this.velocity.addScaledVector(i, this.invMass);
    }
}