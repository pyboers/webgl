import { Box2, MathUtils, Vector2 } from "three";
import { Body } from "../../physics/2d/bodies/body";
import { CollisionDetector } from "../../physics/2d/collision-detection/collision-detector";

export interface ParticleBehaviour {
    attraction: number,
    radius: number,
    orbitter: boolean
}
export class ParticleComponent extends Body{
    collisionDetector: CollisionDetector;
    behaviours: ParticleBehaviour[];
    particleType: number;
    maxRadius: number;
    overloadCount: number;
    inactiveTime: number;
    constructor(particleType: number, overloadChance: number, behaviours: ParticleBehaviour[], collisionDetector: CollisionDetector){
        super(1, 0);
        this.particleType = particleType;
        this.collisionDetector = collisionDetector;
        this.maxRadius = 0;
        for(let b of behaviours)
            this.maxRadius = this.maxRadius < b.radius ? b.radius : this.maxRadius;
        this.behaviours = behaviours;
        this.overloadCount = 50 + (overloadChance * 100);
        this.inactiveTime = 0;
    }

    update(dt: number){
        super.update(dt);
        if(this.position.x < -1){
            this.position.x = 1;
        }

        if(this.position.x > 1){
            this.position.x = -1;
        }
        const aspect = window.innerHeight/window.innerWidth;
        if(this.position.y < -aspect){
            this.position.y = aspect;
        }

        if(this.position.y > aspect){
            this.position.y = -aspect;
        }

        if(this.inactiveTime > 0){
            this.inactiveTime -= dt;
            this.inactiveTime = Math.max(0, this.inactiveTime);

            const inactiveFriction = 0.999;
            this.velocity.multiplyScalar(inactiveFriction);
            return;
        }

        const friction = 0.9;
        this.velocity.multiplyScalar(friction);

        const hits = this.collisionDetector.query(new Box2(new Vector2(-this.maxRadius, -this.maxRadius).add(this.position), 
        new Vector2(this.maxRadius, this.maxRadius).add(this.position)));

        let bodies = hits.map(h => h.body);
        bodies = bodies.filter((h, index) => ((bodies.indexOf(h) === index) && (h != this)));

        let f = new Vector2(0, 0);
        let interactionCount = 0;
        for(let body of bodies){
            const particle = body as ParticleComponent;
            if(particle.particleType != undefined){
                const diff = particle.position.clone().sub(this.position);
                const rad = this.behaviours[particle.particleType].radius;
                const attr = this.behaviours[particle.particleType].attraction;
                const orbitter = this.behaviours[particle.particleType].orbitter;
                if(diff.lengthSq() <= rad * rad){
                    interactionCount++;
                    if(orbitter){
                        const dist = diff.length();
                        const orbitalAttr = attr < 0 ? 1 : Math.sin(((dist/rad) * Math.PI * 2) - (Math.PI/2));
                        f.add(diff.normalize().multiplyScalar(attr * orbitalAttr));
                    }else{
                        f.add(diff.normalize().multiplyScalar(attr));
                    }
                }
            }
        }
        if(interactionCount > this.overloadCount){
            // this.applyImpulse(new Vector2(MathUtils.randFloat(-1, 1), MathUtils.randFloat(-1, 1)).normalize() .multiplyScalar(0.3));
            this.inactiveTime = MathUtils.randFloat(0.5, 2);
        }
            // this.applyForces(f.normalize() .multiplyScalar(2));
        this.applyForces(f);

    }
}