import { ShaderUtils } from "./shader-utils";


export namespace Shader{

    export function circleVertex(){
        return `
            out vec3 worldPosition;
            out vec3 circlePos;

            void main(){
                circlePos = (modelMatrix * vec4(0, 0, 0, 1)).xyz;
                worldPosition = (modelMatrix * vec4(position, 1)).xyz;
                
                gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1);
            }
        `
    }

    export function circleFragment(){
        return `
            uniform float radius;
            uniform vec3 color;

            in vec3 worldPosition;
            in vec3 circlePos;

            out vec4 fragColor;
            void main(){
                fragColor = vec4(color, 1) * float(length(worldPosition.xy - circlePos.xy) <= radius);
            }

        `
    }

    export function circleVertexInstanced(){
        return `
            out vec3 worldPosition;
            out vec3 circlePos;
            out vec3 circleColor;

            void main(){
                circlePos = (modelMatrix * instanceMatrix * vec4(0, 0, 0, 1)).xyz;
                worldPosition = (modelMatrix * instanceMatrix * vec4(position, 1)).xyz;
                circleColor = instanceColor;
                
                gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1);
            }
        `
    }

    export function circleFragmentInstanced(){
        return `
            uniform float radius;

            in vec3 worldPosition;
            in vec3 circlePos;
            in vec3 circleColor;

            out vec4 fragColor;
            void main(){
                fragColor = vec4(circleColor, 1) * float(length(worldPosition.xy - circlePos.xy) <= radius);
            }

        `
    }


    export function cubedSphereVertex(){
        return `

            varying mat4 invMVP;

            ${ShaderUtils.sphericalBillboardMatrix()}

            void main(){
                // mat4 ModelView = sphericalBillboardMatrix(modelViewMatrix);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
            }
        `;
    }
    
    export function mandelbrotFragment(){
        return `
        uniform vec2 resolution;
    
        out vec4 color;
    
        int getMandelbrot(float base_x, float base_y){
            float x = 0.0;
            float y = 0.0;
    
            int iteration = 0;
    
            while(x*x + y * y <= 4.0 && iteration < 1000){
                float tmp = x*x - y*y + base_x;
                y = 2.0*x*y + base_y;
                x = tmp;
                iteration += 1;
            }
    
            return iteration;
        }
    
        void main(){
            vec4 uv = gl_FragCoord;
            uv.xy /= resolution;
            uv.xy = uv.xy * 2.0 - 1.0;
            
            float mandelbrot = float(getMandelbrot(uv.x, uv.y));
            color = vec4(mandelbrot/1000.0, mandelbrot/1000.0, mandelbrot/1000.0, 1.0);
        }
        `;
    }
    
    export function cubedSphereFragment(){
        return `
            uniform vec2 resolution;
            uniform vec3 camPos;
            uniform mat4 camView;
            uniform mat4 camProjection;
            uniform vec3 lightPos;
            uniform vec3 spherePos;
            uniform float sphereRadius;
    
    
            uniform float cubeSize;
    
            out vec4 color;
    
            ${ShaderUtils.planeIntersect()}
    
            ${ShaderUtils.sphereIntersect()}
    
            ${ShaderUtils.nearestCubePoint()}

            void main(){
               vec4 uv = gl_FragCoord;
                uv.xy /= resolution;
                uv.xy = uv.xy * 2.0 - 1.0;

                vec4 camRay = uv;
                camRay.z = -1.0;
                camRay.w = 1.0;
                camRay = camProjection * camRay;
                camRay.w = 0.0;
                camRay = camView * (camRay);
    
                vec3 ray = normalize(camRay.xyz);
    
                float dist = sphereIntersect(camPos, ray, spherePos, sphereRadius);
                vec3 sphereHit = ray * dist + camPos;
    
                sphereHit = (sphereHit * float(length(camPos - spherePos) > sphereRadius)) + (camPos * float(length(camPos - spherePos) <= sphereRadius));
                dist = (dist * float(length(camPos - spherePos) > sphereRadius)) + (0.001 * float(length(camPos - spherePos) <= sphereRadius));
                
                gl_FragDepth = ((1000.0+0.1)/(1000.0-0.1)) + (((1.0/(dist)) * ((-2.0*1000.0*0.1)/(1000.0-0.1))));

                if(dist < 0.0){
                    discard;
                }
                
                // vec3 hit = ray * dist;
                HitValue hit = nearestCubePoint(sphereHit, ray);
    
                vec3 lightRay = normalize(hit.position - lightPos);
                float lightDist = sphereIntersect(lightPos, lightRay, spherePos, sphereRadius);
                vec3 lSphereHit = lightRay * lightDist + lightPos;
                HitValue lightHit = nearestCubePoint(lSphereHit, lightRay);
                float lightHitDist = length(lightHit.position - lightPos);
    
                float hitLightDist = length(hit.position - lightPos);
    
                vec3 lightColor = abs(hit.normal) * float(lightHitDist - hitLightDist >= -0.0001) * clamp(dot(hit.normal, -lightRay), 0.0, 1.0);
                color = vec4((abs(hit.normal)) * 0.1 + lightColor, 1) * float(dist >= 0.0);
            }
        `; 
    }

    export function squaredCircleFragment(){
        return `
            uniform vec2 resolution;
            uniform vec3 camPos;
            uniform mat4 camView;
            uniform mat4 camProjection; 
    
    
            uniform float cubeSize;
    
            float radius = 0.3;
    
            out vec4 color;
    
            void main(){
                vec2 circlePos = vec2(cubeSize/2.0, cubeSize/2.0);
    
                vec2 uv = gl_FragCoord.xy;
                uv.xy /= resolution;
                uv.xy = uv.xy * 2.0 - 1.0;
                
                uv.y *= resolution.y/resolution.x;
    
                vec2 uvRadius = uv - circlePos;
    
                uvRadius.x = float(int((uv.x + (sign(uv.x) * cubeSize))/cubeSize)) * cubeSize;
                uvRadius.y = float(int((uv.y + (sign(uv.y) * cubeSize))/cubeSize)) * cubeSize;
    
                float gridX = float(int(uv.x/cubeSize) % 2 == 0);
                float gridY = float(int((uv.y - cubeSize)/cubeSize) % 2 == 0);
    
                vec2 normal = normalize(uvRadius);
                color = vec4(normal.x * 0.5 + 0.5, normal.y * 0.5 + 0.5, 0, 1) * float(length(uvRadius) <= radius);
            }
        `; 
    }

    export function blitVert(){
        return `
        out vec2 frag_uv;

        void main(){
            frag_uv = position.xy * 0.5 + 0.5;
            gl_Position = vec4(position, 1);
        }
    `;
    }

    export function blitFragment(){
        return `
            uniform sampler2D prevBuffer;

            in vec2 frag_uv;

            out vec4 color;

            void main(){
                vec4 lastColor = texelFetch(prevBuffer, ivec2(gl_FragCoord.xy), 0);

                color = lastColor;
            }
        `
    }

    export function randPassFragment(){
        return `
            out vec4 color;

            // Gold Noise ©2015 dcerisano@standard3d.com
            // - based on the Golden Ratio
            // - uniform normalized distribution
            // - fastest static noise generator function (also runs at low precision)
            // - use with indicated seeding method. 
            
            float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   
            
            float gold_noise(in vec2 xy, in float seed){
                   return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
            }

            void main(){
                float rand = float(gold_noise(gl_FragCoord.xy, 1.0) >= 0.52);
                color = vec4(vec3(rand), 1.0);
            }
        `;
    }

    export function pass1PowderFragment(){
        return `
            uniform sampler2D prevBuffer;

            in vec2 frag_uv;

            out vec4 color;

            void main(){
                vec4 lastColor = texelFetch(prevBuffer, ivec2(gl_FragCoord.xy), 0);

                color = lastColor;
            }
        `;
    }

    export function pass2PowderFragment(){
        return `
            uniform sampler2D prevBuffer;

            in vec2 frag_uv;

            out vec4 color;

            ${ShaderUtils.countNeighbours()}

            ${ShaderUtils.setupRules('B3/S23')}

            ${ShaderUtils.cellularAutomata()}

            void main(){
                vec4 lastColor = texture(prevBuffer, (gl_FragCoord.xy) / vec2(textureSize(prevBuffer, 0)));
                int lastCount = countNeighbours(gl_FragCoord.xy, prevBuffer);

                int alive = cellularAutomata(int(lastColor.x >= 0.5), lastCount);
                color = vec4(vec3(alive), 1);
            }
        `;
    }
}