import { Color, DoubleSide, GLSL3, MathUtils, Matrix4, Mesh, NearestFilter, OrthographicCamera, PlaneGeometry, RepeatWrapping, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer, WebGLRenderTarget } from "three";
import { RaytracedCircle } from "../../rendering/shapes/raytraced-circle";
import { View } from "../view";
import { Body } from "../../physics/2d/bodies/body";
import { PhysicsEngine2D } from "../../physics/2d/physics-engine-2d";
import { GameObject } from "../../internal/game-object";
import { Circle } from "../../physics/2d/shapes/circle";
import { AABB } from "../../physics/2d/shapes/aabb";
import { ParticleComponent, ParticleBehaviour } from "./particle-component";
import { InstancedRTCircle } from "../../rendering/shapes/instanced-rt-circle";

export class ParticleLifeView extends View {
    camera: OrthographicCamera;
    scene: Scene;
    physics: PhysicsEngine2D;
    gameObjects: GameObject[];

    constructor(canvas: any){
        super();
        this.scene = new Scene();

        const aspect = window.innerHeight/window.innerWidth;
        this.camera = new OrthographicCamera(-1, 1, 1 * aspect, -1 * aspect, -1, 1);
        this.physics = new PhysicsEngine2D(1);
        this.gameObjects = [];
    }

    start(): void {
        // const wall1 = new GameObject();
        // wall1.position.set(-1.1, 0, 0);
        // const wall1Body = new Body(0, 0.5);
        // const wall1Shape = new AABB(0.1, 1, wall1Body);
        // wall1.attachComponent(wall1Body);

        // this.physics.addBody(wall1Body);
        // this.scene.add(wall1);
        // this.gameObjects.push(wall1);

        // const wall2 = new GameObject();
        // wall2.position.set(1.1, 0, 0);
        // const wall2Body = new Body(0, 0.5);
        // const wall2Shape = new AABB(0.1, 1, wall2Body);
        // wall2.attachComponent(wall2Body);

        // this.physics.addBody(wall2Body);
        // this.scene.add(wall2);
        // this.gameObjects.push(wall2);

        // const wall3 = new GameObject();
        // wall3.position.set(0, window.innerHeight/window.innerWidth + 0.1, 0);
        // const wall3Body = new Body(0, 0.5);
        // const wall3Shape = new AABB(1, 0.1, wall3Body);
        // wall3.attachComponent(wall3Body);

        // this.physics.addBody(wall3Body);
        // this.scene.add(wall3);
        // this.gameObjects.push(wall3);

        // const wall4 = new GameObject();
        // wall4.position.set(0, -window.innerHeight/window.innerWidth - 0.1, 0);
        // const wall4Body = new Body(0, 0.5);
        // const wall4Shape = new AABB(1, 0.1, wall4Body);
        // wall4.attachComponent(wall4Body);

        // this.physics.addBody(wall4Body);
        // this.scene.add(wall4);
        // this.gameObjects.push(wall4);

        // for(let i = 0; i < 10; i++){
        //     const obstacle1 = new GameObject();
        //     const rayCircle = new RaytracedCircle(new Color(0.3, 0.3, 0.3));
        //     rayCircle.setRadius(0.01);
        //     obstacle1.add(rayCircle);
        //     obstacle1.position.set(MathUtils.randFloat(-0.5, 0.5), MathUtils.randFloat(-0.5, 0.5), 0);
        //     const obstacle1Body = new Body(1000, 0.3);
        //     const obstacle1Shape = new Circle(0.01, obstacle1Body);
        //     obstacle1.attachComponent(obstacle1Body);
    
        //     this.physics.addBody(obstacle1Body);
        //     this.scene.add(obstacle1);
        //     this.gameObjects.push(obstacle1);
        // }
        
        
        const typeCount = 20;
        const particleBehaviours: ParticleBehaviour[][] = [];
        const typeColors: Color[] = [];
        const typeOverloads: number[] = []
        const maxVelocity = 0.5;

        for(let i = 0; i < typeCount; i++){
            const behaviours: ParticleBehaviour[] = [];
            for(let j = 0; j < typeCount; j++){
                if(i == j){
                    behaviours.push({attraction: MathUtils.randFloat(-1, 1) * maxVelocity,
                        radius: MathUtils.randFloat(0.01, 0.1),
                        orbitter: MathUtils.randFloat(0, 1) < 0.4
                    });
                }else{
                    behaviours.push({attraction: MathUtils.randFloat(-1, 1) * maxVelocity,
                        radius: MathUtils.randFloat(0.01, 0.1),
                        orbitter: MathUtils.randFloat(0, 1) < 0.4
                    });
                }
            }
            typeColors.push(new Color(MathUtils.randFloat(0, 1), MathUtils.randFloat(0, 1), MathUtils.randFloat(0, 1)));
            typeOverloads.push(MathUtils.randFloat(0, 1));
            particleBehaviours.push(behaviours);
        }

        const circleInstancer = new InstancedRTCircle(0.002, 1000);
        this.scene.add(circleInstancer);
        for(let i = 0; i < circleInstancer.count; i ++){
            const obj = new GameObject();
            obj.position.set(MathUtils.randFloat(-0.4, 0.4), MathUtils.randFloat(-0.2, 0.2), 0);

            const circle = circleInstancer.getInstance(i);
            circle.setColor(typeColors[i%typeCount]);
            
            obj.attachComponent(circle);

            const body = new ParticleComponent(i % typeCount, typeOverloads[i%typeCount], particleBehaviours[i % typeCount], this.physics.collisionDetector);
            const shape = new Circle(0.002, body);
            obj.attachComponent(body);
            
            this.physics.addBody(body);

            obj.visible = false;
            this.scene.add(obj);
            this.gameObjects.push(obj);
        }
    }

    onResize(resolution: Vector2, offset: Vector2): void {
        const aspect = window.innerHeight/window.innerWidth;
        this.camera = new OrthographicCamera(-1, 1, 1 * aspect, -1 * aspect, -1, 1);
    }

    update(dt: number): void {
        this.physics.update(dt);
        for(let obj of this.gameObjects){
            obj.update(dt);
        }
    }

    render(renderer: WebGLRenderer): void {
        renderer.setRenderTarget(null);
        renderer.render(this.scene, this.camera);
    }

    stop(): void {
        
    }
}