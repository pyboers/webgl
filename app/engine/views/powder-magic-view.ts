import { DoubleSide, GLSL3, Matrix4, Mesh, NearestFilter, OrthographicCamera, PlaneGeometry, RepeatWrapping, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer, WebGLRenderTarget } from "three";
import { Shader } from "../rendering/shaders";
import { View } from "./view";

export class PowderMagicView extends View {
    camera: OrthographicCamera;
    init: boolean;

    randPass: {
        buffer: WebGLRenderTarget | null,
        postMat: THREE.ShaderMaterial,
        scene: Scene
    };

    pass1: {
        buffer: WebGLRenderTarget | null,
        postMat: THREE.ShaderMaterial,
        scene: Scene
    };
    
    pass2: {
        buffer: WebGLRenderTarget | null,
        postMat: THREE.ShaderMaterial,
        scene: Scene
    };

    pass3: {
        buffer: WebGLRenderTarget | null,
        postMat: THREE.ShaderMaterial,
        scene: Scene
    };

    constructor(canvas: any){
        super();
        this.init = true;

        const buffer1 = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {magFilter: NearestFilter, minFilter: NearestFilter, wrapS: RepeatWrapping, wrapT: RepeatWrapping});
        const buffer2 = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {magFilter: NearestFilter, minFilter: NearestFilter, wrapS: RepeatWrapping, wrapT: RepeatWrapping});
        this.pass1 = {
            buffer: buffer1,
            postMat: new ShaderMaterial({
                uniforms: {
                    resolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
                    prevBuffer: {value: buffer2.texture }
                },
                vertexShader: Shader.blitVert(),
                fragmentShader: Shader.pass1PowderFragment(),
                glslVersion: GLSL3,
                side: DoubleSide
            }),
            scene: new Scene()
        };
        this.pass1.scene.add(new Mesh(new PlaneGeometry(2, 2), this.pass1.postMat));

        this.pass2 = {
            buffer: buffer2,
            postMat: new ShaderMaterial({
                uniforms: {
                    resolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
                    prevBuffer: {value: buffer1.texture }
                },
                vertexShader: Shader.blitVert(),
                fragmentShader: Shader.pass2PowderFragment(),
                glslVersion: GLSL3,
                side: DoubleSide
            }),
            scene: new Scene()
        };
        this.pass2.scene.add(new Mesh(new PlaneGeometry(2, 2), this.pass2.postMat));

        this.pass3 = {
            buffer: null,
            postMat: new ShaderMaterial({
                uniforms: {
                    resolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
                    prevBuffer: {value: buffer2.texture }
                },
                vertexShader: Shader.blitVert(),
                fragmentShader: Shader.blitFragment(),
                glslVersion: GLSL3,
                side: DoubleSide
            }),
            scene: new Scene()
        };
        this.pass3.scene.add(new Mesh(new PlaneGeometry(2, 2), this.pass3.postMat));

                
        this.randPass = {
            buffer: buffer2,
            postMat: new ShaderMaterial({
                uniforms: {
                },
                vertexShader: Shader.blitVert(),
                fragmentShader: Shader.randPassFragment(),
                glslVersion: GLSL3,
                side: DoubleSide
            }),
            scene: new Scene()
        };
        this.randPass.scene.add(new Mesh(new PlaneGeometry(2, 2), this.randPass.postMat));

        this.pass1.postMat.uniforms.prevBuffer.value = this.pass2.buffer?.texture;
        this.pass2.postMat.uniforms.prevBuffer.value = this.pass1.buffer?.texture;
        this.pass3.postMat.uniforms.prevBuffer.value = this.pass2.buffer?.texture;

        this.camera = new OrthographicCamera(-1, -1, 1, 1);
    }

    start(): void {
        this.init = true;
    }

    onResize(resolution: Vector2, offset: Vector2): void {
        this.pass1.buffer = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {magFilter: NearestFilter, minFilter: NearestFilter, wrapS: RepeatWrapping, wrapT: RepeatWrapping});
        this.pass2.buffer = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {magFilter: NearestFilter, minFilter: NearestFilter, wrapS: RepeatWrapping, wrapT: RepeatWrapping});
        this.pass3.buffer = null;

        this.pass1.postMat.uniforms.prevBuffer.value = this.pass2.buffer?.texture;
        this.pass2.postMat.uniforms.prevBuffer.value = this.pass1.buffer?.texture;
        this.pass3.postMat.uniforms.prevBuffer.value = this.pass2.buffer?.texture;
    }

    update(dt: number): void {
        
    }

    render(renderer: WebGLRenderer): void {
        if(this.init){
            renderer.setRenderTarget(this.randPass.buffer);
            renderer.render(this.randPass.scene, this.camera);

            renderer.setRenderTarget(this.pass1.buffer);
            renderer.render(this.pass1.scene, this.camera);
            
            renderer.setRenderTarget(this.pass2.buffer);
            renderer.render(this.pass2.scene, this.camera);

            renderer.setRenderTarget(this.pass3.buffer);
            renderer.render(this.pass3.scene, this.camera);
            this.init = false;
            return;
        }

        renderer.setRenderTarget(this.pass1.buffer);
        renderer.render(this.pass1.scene, this.camera);
        
        renderer.setRenderTarget(this.pass2.buffer);
        renderer.render(this.pass2.scene, this.camera);

        renderer.setRenderTarget(this.pass3.buffer);
        renderer.render(this.pass3.scene, this.camera);
    }

    stop(): void {
        
    }
}