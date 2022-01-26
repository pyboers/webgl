import { Camera, Renderer, Scene, Vector2, WebGLRenderer } from 'three';

export abstract class View{

    constructor(){
        
    }

    abstract start(): void;

    abstract onResize(resolution: Vector2, offset: Vector2): void;

    abstract update(dt: number): void;
    abstract render(renderer: WebGLRenderer) : void;

    abstract stop(): void;
}

