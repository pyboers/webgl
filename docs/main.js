(()=>{"use strict";var e,n={790:(e,n,t)=>{var i,o,s,r,a,l=t(212);class c{constructor(e,n,t,i,o){this.normal=e,this.distance=n,this.point=t,this.bodyA=i,this.bodyB=o,this.normalImpulseSum=0,this.divisorN=1/(i.invMass+o.invMass)}getBiasImpulse(e){const n=this.distance-.001;return.1/e*Math.max(0,n)}solve(e){let n=(this.bodyB.velocity.clone().sub(this.bodyA.velocity).dot(this.normal.clone())-this.getBiasImpulse(e))*this.divisorN;const t=this.normalImpulseSum;this.normalImpulseSum+=n,this.normalImpulseSum=Math.min(this.normalImpulseSum,0),n=this.normalImpulseSum-t;const i=this.normal.clone().multiplyScalar(n);this.bodyA.applyImpulse(i),this.bodyB.applyImpulse(i.clone().negate())}}function u(e,n){switch(e.getShapeType()){case i.circle:switch(n.getShapeType()){case i.circle:return function(e,n){const t=n.position.clone().sub(e.position),i=t.lengthSq();if(i>(e.radius+n.radius)*(e.radius+n.radius))return null;const o=t.clone().normalize(),s=e.radius+n.radius-Math.sqrt(i),r=o.clone().multiplyScalar(e.radius-s);return new c(o,s,r,e.body,n.body)}(e,n);case i.aabb:return h(n,e)}case i.aabb:switch(n.getShapeType()){case i.circle:return h(e,n);case i.aabb:return null}}return null}function h(e,n){const t=n.position.clone().sub(e.position),i=t.clone();i.x<-e.hwidth?i.setX(-e.hwidth):i.x>e.hwidth&&i.setX(e.hwidth),i.y<-e.hheight?i.setY(-e.hheight):i.y>e.hheight&&i.setY(e.hheight);const o=i.clone(),s=t.clone().sub(i).lengthSq();if(s<n.radius*n.radius){if(0==s)Math.abs(e.hwidth-Math.abs(i.x))<Math.abs(e.hheight-Math.abs(i.y))?(i.x>0?i.setX(e.hwidth-i.x+n.radius):i.setX(-e.hwidth-i.x-n.radius),i.setY(0)):(i.y>0?i.setY(e.hheight-i.y+n.radius):i.setY(-e.hheight-i.y-n.radius),i.setX(0));else{i.setX(t.x-i.x),i.setY(t.y-i.y);const e=n.radius-i.length();i.normalize().multiplyScalar(e)}return new c(i.clone().normalize().negate(),i.length(),o.add(e.position),n.body,e.body)}return null}!function(e){e.circle=0,e.aabb=1}(i||(i={}));class d{constructor(e,n){this.cellSize=e,this.cellCountW=Math.trunc((n.max.x-n.min.x)/e+1),this.cellCountH=Math.trunc((n.max.y-n.min.y)/e+1),this.cellCount=this.cellCountW*this.cellCountH,this.cells=[];for(let e=0;e<this.cellCount;e++)this.cells.push([]);this.shapes=[],this.bounds=n}clear(){this.cells=[];for(let e=0;e<this.cellCount;e++)this.cells.push([])}hashPoint(e,n){return Math.abs((e+n*this.cellCountW)%this.cellCount)}getCollisions(){const e=[];for(let n of this.cells)for(let t=0;t<n.length-1;t++)for(let i=t+1;i<n.length;i++){const o=u(n[t],n[i]);null!=o&&e.push(o)}return e}insert(e){for(let n of e.shapes)this.shapes.push(n)}update(){this.clear();for(let e of this.shapes){const n=e.getBounds(),t=Math.floor((n.min.x-this.bounds.min.x)/this.cellSize),i=Math.ceil((n.max.x-this.bounds.min.x)/this.cellSize),o=Math.floor((n.min.y-this.bounds.min.y)/this.cellSize),s=Math.ceil((n.max.y-this.bounds.min.y)/this.cellSize);for(let n=t;n<i;n++)for(let t=o;t<s;t++){const i=this.hashPoint(n,t);this.cells[i].push(e)}}}query(e){const n=Math.floor((e.min.x-this.bounds.min.x)/this.cellSize),t=Math.ceil((e.max.x-this.bounds.min.x)/this.cellSize),i=Math.floor((e.min.y-this.bounds.min.y)/this.cellSize),o=Math.ceil((e.max.y-this.bounds.min.y)/this.cellSize),s=[];for(let r=n;r<=t;r++)for(let n=i;n<=o;n++)for(let t of this.cells[this.hashPoint(r,n)])t.getBounds().intersectsBox(e)&&s.push(t);return s}}!function(e){e.solve=function(e,n,t){for(let i=0;i<t;i++)for(let t of e)t.solve(n)}}(o||(o={}));class p{constructor(e){this.bodies=[],this.collisionDetector=new d(.05,new l.TUj(new l.FM8(-1.5,-1.5),new l.FM8(1.5,1.5))),this.frequency=e}update(e){this.collisionDetector.update(),e/=this.frequency;for(let n=0;n<this.frequency;n++){for(let n of this.bodies)n.integrate(e);o.solve(this.collisionDetector.getCollisions(),e,16);for(let n of this.bodies)n.step(e)}}addBody(e){this.bodies.push(e),this.collisionDetector.insert(e)}}class v extends l.Tme{constructor(){super(),this.components=[]}update(e){for(let n of this.components)n.update(e)}attachComponent(e){this.components.push(e),e.init(this)}}class m extends class{constructor(e){this.position=e.position,this.body=e,e.shapes.push(this)}}{constructor(e,n){super(n),this.radius=e}getSupportPoint(e){return this.position.clone().add(e.clone().multiplyScalar(this.radius))}getNearestPoint(e){return e.clone().sub(this.position).normalize()}getShapeType(){return i.circle}boundsIntersect(e){const n=this.getBounds();return e.intersectsBox(n)}getBounds(){const e=new l.FM8(this.radius,this.radius).add(this.position),n=new l.FM8(-this.radius,-this.radius).add(this.position);return new l.TUj(n,e)}}class f extends class{constructor(e,n){this.position=new l.FM8(0,0),this.velocity=new l.FM8(0,0),this.forces=new l.FM8(0,0),this.invMass=e>0?1/e:0,this.shapes=[],this.restitution=n}update(e){this.obj.position.set(this.position.x,this.position.y,this.obj.position.z)}init(e){this.obj=e,this.position.set(e.position.x,e.position.y)}integrate(e){this.velocity.addScaledVector(this.forces,this.invMass*e),this.forces.set(0,0)}step(e){this.position.addScaledVector(this.velocity,e);for(let e of this.shapes)e.position=this.position}applyForces(e){this.forces.add(e)}applyImpulse(e){this.velocity.addScaledVector(e,this.invMass)}}{constructor(e,n,t,i){super(1,0),this.particleType=e,this.collisionDetector=i,this.maxRadius=0;for(let e of t)this.maxRadius=this.maxRadius<e.radius?e.radius:this.maxRadius;this.behaviours=t,this.overloadCount=50+100*n,this.inactiveTime=0}update(e){if(super.update(e),this.inactiveTime>0){this.inactiveTime-=e,this.inactiveTime=Math.max(0,this.inactiveTime);const n=.999;return void this.velocity.multiplyScalar(n)}this.velocity.multiplyScalar(.9);let n=this.collisionDetector.query(new l.TUj(new l.FM8(-this.maxRadius,-this.maxRadius).add(this.position),new l.FM8(this.maxRadius,this.maxRadius).add(this.position))).map((e=>e.body));n=n.filter(((e,t)=>n.indexOf(e)===t&&e!=this));let t=new l.FM8(0,0),i=0;for(let e of n){const n=e;if(null!=n.particleType){const e=n.position.clone().sub(this.position),o=this.behaviours[n.particleType].radius,s=this.behaviours[n.particleType].attraction,r=this.behaviours[n.particleType].orbitter;if(e.lengthSq()<=o*o)if(i++,r){const n=e.length(),i=s<0?1:Math.sin(n/o*Math.PI*2-Math.PI/2);t.add(e.normalize().multiplyScalar(s*i))}else t.add(e.normalize().multiplyScalar(s))}}i>this.overloadCount&&(this.inactiveTime=l.M8C.randFloat(.5,2)),this.applyForces(t),this.position.x<-1&&(this.velocity.x+=-this.velocity.x-10*(this.position.x- -1)),this.position.x>1&&(this.velocity.x+=-this.velocity.x-10*(this.position.x-1));const o=window.innerHeight/window.innerWidth;this.position.y<-o&&(this.velocity.y+=-this.velocity.y-10*(this.position.y- -o)),this.position.y>o&&(this.velocity.y+=-this.velocity.y-10*(this.position.y-o))}}!function(e){e.countNeighbours=function(){return"\n            int countNeighbours(vec2 texel, sampler2D b){\n                int count = 0;\n                vec2 texSize = vec2(textureSize(b, 0));\n                count += int(texture(b, ((texel) + vec2(0, 1)) / texSize).x >= 0.5);\n                count += int(texture(b, ((texel) + vec2(1, 1)) / texSize).x >= 0.5);\n                count += int(texture(b, ((texel) + vec2(1, 0)) / texSize).x >= 0.5);\n                count += int(texture(b, ((texel) + vec2(1, -1)) / texSize).x >= 0.5);\n                count += int(texture(b, ((texel) + vec2(0, -1)) / texSize).x >= 0.5);\n                count += int(texture(b, ((texel) + vec2(-1, -1)) / texSize).x >= 0.5);\n                count += int(texture(b, ((texel) + vec2(-1, 0)) / texSize).x >= 0.5);\n                count += int(texture(b, ((texel) + vec2(-1, 1)) / texSize).x >= 0.5);\n                \n                return count;\n            }\n        "},e.setupRules=function(e){const n=e.split("/"),t=n[0].replace("B",""),i=n[1].replace("S",""),o=[0,0,0,0,0,0,0,0,0];for(let e of t)o[parseInt(e)]=1;const s=[0,0,0,0,0,0,0,0,0];for(let e of i)s[parseInt(e)]=1;return`\n            const int aliveRules[9] = int[9](${s.join(",")});\n            const int deadRules[9] = int[9](${o.join(",")});\n        `},e.cellularAutomata=function(){return"\n            int cellularAutomata(int alive, int neighbours){\n                return (int(alive > 0) * aliveRules[neighbours]) + (int(alive == 0) * deadRules[neighbours]);\n            }\n        "},e.sphericalBillboardMatrix=function(){return"\n            mat4 sphericalBillboardMatrix(mat4 modelview){\n                mat4 ModelView = modelview;\n                // Column 0:\n                ModelView[0][0] = 1.0;\n                ModelView[0][1] = 0.0;\n                ModelView[0][2] = 0.0;\n                // Column 1:\n                ModelView[1][0] = 0.0;\n                ModelView[1][1] = 1.0;\n                ModelView[1][2] = 0.0;\n                // Column 2:\n                ModelView[2][0] = 0.0;\n                ModelView[2][1] = 0.0;\n                ModelView[2][2] = 1.0;\n                \n                return ModelView;\n            }\n        "},e.sphereIntersect=function(){return"\n            float sphereIntersect(vec3 origin, vec3 dir, vec3 center, float radius)\n            {\n                vec3 oc = origin - center;\n                float a = dot(dir, dir);\n                float b = 2.0 * dot(oc, dir);\n                float c = dot(oc,oc) - radius*radius;\n                float discriminant = b*b - 4.0*a*c;\n                if(discriminant < 0.0){\n                    return -1.0;\n                }\n                else{\n                    return (-b - sqrt(discriminant)) / (2.0*a);\n                }\n            }\n        "},e.planeIntersect=function(){return"\n            float planeIntersect(vec3 origin, vec3 dir, vec3 plane, vec3 planePoint){\n                vec3 diff = origin - planePoint;\n                float distNorm = dot(plane, diff);\n                float rayDot = dot(dir, plane);\n                return distNorm/rayDot;\n            }\n        "},e.nearestCubePoint=function(){return"\n            struct HitValue{\n                vec3 position;\n                vec3 normal;\n            };\n\n            HitValue nearestCubePoint(vec3 origin, vec3 dir){\n                float closestX = origin.x;\n                float closestY = origin.y;\n                float closestZ = origin.z;\n\n                if(dir.x > 0.0){\n                    closestX = ceil(origin.x / cubeSize) * cubeSize;\n                }else if (dir.x < 0.0){\n                    closestX = floor(origin.x / cubeSize) * cubeSize;\n                }\n\n                if(dir.y > 0.0){\n                    closestY = ceil(origin.y / cubeSize) * cubeSize;\n                }else if (dir.y < 0.0){\n                    closestY = floor(origin.y / cubeSize) * cubeSize;\n                }\n\n                if(dir.z > 0.0){\n                    closestZ = ceil(origin.z / cubeSize) * cubeSize;\n                }else if (dir.z < 0.0){\n                    closestZ = floor(origin.z / cubeSize) * cubeSize;\n                }\n\n                float xCloseness = (closestX - origin.x) / dir.x;\n                float yCloseness = (closestY - origin.y) / dir.y;\n                float zCloseness = (closestZ - origin.z) / dir.z;\n\n                HitValue hv;\n                \n                if(yCloseness <= xCloseness && yCloseness <= zCloseness){\n                    hv.position = vec3(origin.x + dir.x * yCloseness, closestY, origin.z + dir.z * yCloseness);\n                    hv.normal = vec3(0.0, -sign(dir.y), 0.0);\n                } else if(xCloseness <= yCloseness && xCloseness <= zCloseness){\n                    hv.position = vec3(closestX, origin.y + dir.y * xCloseness, origin.z + dir.z * xCloseness);\n                    hv.normal = vec3(-sign(dir.x), 0.0, 0.0);\n                } else{\n                    hv.position = vec3(origin.x + dir.x * zCloseness, origin.y + dir.y * zCloseness, closestZ);\n                    hv.normal = vec3(0.0, 0.0, -sign(dir.z));\n                }\n\n                return hv;\n            }\n        "}}(s||(s={})),function(e){e.circleVertex=function(){return"\n            out vec3 worldPosition;\n            out vec3 circlePos;\n\n            void main(){\n                circlePos = (modelMatrix * vec4(0, 0, 0, 1)).xyz;\n                worldPosition = (modelMatrix * vec4(position, 1)).xyz;\n                \n                gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1);\n            }\n        "},e.circleFragment=function(){return"\n            uniform float radius;\n            uniform vec3 color;\n\n            in vec3 worldPosition;\n            in vec3 circlePos;\n\n            out vec4 fragColor;\n            void main(){\n                fragColor = vec4(color, 1) * float(length(worldPosition.xy - circlePos.xy) <= radius);\n            }\n\n        "},e.circleVertexInstanced=function(){return"\n            out vec3 worldPosition;\n            out vec3 circlePos;\n            out vec3 circleColor;\n\n            void main(){\n                circlePos = (modelMatrix * instanceMatrix * vec4(0, 0, 0, 1)).xyz;\n                worldPosition = (modelMatrix * instanceMatrix * vec4(position, 1)).xyz;\n                circleColor = instanceColor;\n                \n                gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1);\n            }\n        "},e.circleFragmentInstanced=function(){return"\n            uniform float radius;\n\n            in vec3 worldPosition;\n            in vec3 circlePos;\n            in vec3 circleColor;\n\n            out vec4 fragColor;\n            void main(){\n                fragColor = vec4(circleColor, 1) * float(length(worldPosition.xy - circlePos.xy) <= radius);\n            }\n\n        "},e.cubedSphereVertex=function(){return`\n\n            varying mat4 invMVP;\n\n            ${s.sphericalBillboardMatrix()}\n\n            void main(){\n                // mat4 ModelView = sphericalBillboardMatrix(modelViewMatrix);\n                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);\n            }\n        `},e.mandelbrotFragment=function(){return"\n        uniform vec2 resolution;\n    \n        out vec4 color;\n    \n        int getMandelbrot(float base_x, float base_y){\n            float x = 0.0;\n            float y = 0.0;\n    \n            int iteration = 0;\n    \n            while(x*x + y * y <= 4.0 && iteration < 1000){\n                float tmp = x*x - y*y + base_x;\n                y = 2.0*x*y + base_y;\n                x = tmp;\n                iteration += 1;\n            }\n    \n            return iteration;\n        }\n    \n        void main(){\n            vec4 uv = gl_FragCoord;\n            uv.xy /= resolution;\n            uv.xy = uv.xy * 2.0 - 1.0;\n            \n            float mandelbrot = float(getMandelbrot(uv.x, uv.y));\n            color = vec4(mandelbrot/1000.0, mandelbrot/1000.0, mandelbrot/1000.0, 1.0);\n        }\n        "},e.cubedSphereFragment=function(){return`\n            uniform vec2 resolution;\n            uniform vec3 camPos;\n            uniform mat4 camView;\n            uniform mat4 camProjection;\n            uniform vec3 lightPos;\n            uniform vec3 spherePos;\n            uniform float sphereRadius;\n    \n    \n            uniform float cubeSize;\n    \n            out vec4 color;\n    \n            ${s.planeIntersect()}\n    \n            ${s.sphereIntersect()}\n    \n            ${s.nearestCubePoint()}\n\n            void main(){\n               vec4 uv = gl_FragCoord;\n                uv.xy /= resolution;\n                uv.xy = uv.xy * 2.0 - 1.0;\n\n                vec4 camRay = uv;\n                camRay.z = -1.0;\n                camRay.w = 1.0;\n                camRay = camProjection * camRay;\n                camRay.w = 0.0;\n                camRay = camView * (camRay);\n    \n                vec3 ray = normalize(camRay.xyz);\n    \n                float dist = sphereIntersect(camPos, ray, spherePos, sphereRadius);\n                vec3 sphereHit = ray * dist + camPos;\n    \n                sphereHit = (sphereHit * float(length(camPos - spherePos) > sphereRadius)) + (camPos * float(length(camPos - spherePos) <= sphereRadius));\n                dist = (dist * float(length(camPos - spherePos) > sphereRadius)) + (0.001 * float(length(camPos - spherePos) <= sphereRadius));\n                \n                gl_FragDepth = ((1000.0+0.1)/(1000.0-0.1)) + (((1.0/(dist)) * ((-2.0*1000.0*0.1)/(1000.0-0.1))));\n\n                if(dist < 0.0){\n                    discard;\n                }\n                \n                // vec3 hit = ray * dist;\n                HitValue hit = nearestCubePoint(sphereHit, ray);\n    \n                vec3 lightRay = normalize(hit.position - lightPos);\n                float lightDist = sphereIntersect(lightPos, lightRay, spherePos, sphereRadius);\n                vec3 lSphereHit = lightRay * lightDist + lightPos;\n                HitValue lightHit = nearestCubePoint(lSphereHit, lightRay);\n                float lightHitDist = length(lightHit.position - lightPos);\n    \n                float hitLightDist = length(hit.position - lightPos);\n    \n                vec3 lightColor = abs(hit.normal) * float(lightHitDist - hitLightDist >= -0.0001) * clamp(dot(hit.normal, -lightRay), 0.0, 1.0);\n                color = vec4((abs(hit.normal)) * 0.1 + lightColor, 1) * float(dist >= 0.0);\n            }\n        `},e.squaredCircleFragment=function(){return"\n            uniform vec2 resolution;\n            uniform vec3 camPos;\n            uniform mat4 camView;\n            uniform mat4 camProjection; \n    \n    \n            uniform float cubeSize;\n    \n            float radius = 0.3;\n    \n            out vec4 color;\n    \n            void main(){\n                vec2 circlePos = vec2(cubeSize/2.0, cubeSize/2.0);\n    \n                vec2 uv = gl_FragCoord.xy;\n                uv.xy /= resolution;\n                uv.xy = uv.xy * 2.0 - 1.0;\n                \n                uv.y *= resolution.y/resolution.x;\n    \n                vec2 uvRadius = uv - circlePos;\n    \n                uvRadius.x = float(int((uv.x + (sign(uv.x) * cubeSize))/cubeSize)) * cubeSize;\n                uvRadius.y = float(int((uv.y + (sign(uv.y) * cubeSize))/cubeSize)) * cubeSize;\n    \n                float gridX = float(int(uv.x/cubeSize) % 2 == 0);\n                float gridY = float(int((uv.y - cubeSize)/cubeSize) % 2 == 0);\n    \n                vec2 normal = normalize(uvRadius);\n                color = vec4(normal.x * 0.5 + 0.5, normal.y * 0.5 + 0.5, 0, 1) * float(length(uvRadius) <= radius);\n            }\n        "},e.blitVert=function(){return"\n        out vec2 frag_uv;\n\n        void main(){\n            frag_uv = position.xy * 0.5 + 0.5;\n            gl_Position = vec4(position, 1);\n        }\n    "},e.blitFragment=function(){return"\n            uniform sampler2D prevBuffer;\n\n            in vec2 frag_uv;\n\n            out vec4 color;\n\n            void main(){\n                vec4 lastColor = texelFetch(prevBuffer, ivec2(gl_FragCoord.xy), 0);\n\n                color = lastColor;\n            }\n        "},e.randPassFragment=function(){return"\n            out vec4 color;\n\n            // Gold Noise ©2015 dcerisano@standard3d.com\n            // - based on the Golden Ratio\n            // - uniform normalized distribution\n            // - fastest static noise generator function (also runs at low precision)\n            // - use with indicated seeding method. \n            \n            float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   \n            \n            float gold_noise(in vec2 xy, in float seed){\n                   return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);\n            }\n\n            void main(){\n                float rand = float(gold_noise(gl_FragCoord.xy, 1.0) >= 0.52);\n                color = vec4(vec3(rand), 1.0);\n            }\n        "},e.pass1PowderFragment=function(){return"\n            uniform sampler2D prevBuffer;\n\n            in vec2 frag_uv;\n\n            out vec4 color;\n\n            void main(){\n                vec4 lastColor = texelFetch(prevBuffer, ivec2(gl_FragCoord.xy), 0);\n\n                color = lastColor;\n            }\n        "},e.pass2PowderFragment=function(){return`\n            uniform sampler2D prevBuffer;\n\n            in vec2 frag_uv;\n\n            out vec4 color;\n\n            ${s.countNeighbours()}\n\n            ${s.setupRules("B3/S23")}\n\n            ${s.cellularAutomata()}\n\n            void main(){\n                vec4 lastColor = texture(prevBuffer, (gl_FragCoord.xy) / vec2(textureSize(prevBuffer, 0)));\n                int lastCount = countNeighbours(gl_FragCoord.xy, prevBuffer);\n\n                int alive = cellularAutomata(int(lastColor.x >= 0.5), lastCount);\n                color = vec4(vec3(alive), 1);\n            }\n        `}}(r||(r={}));class x{constructor(e,n){this.instanceId=e,this.position=new l.Pa4,this.radius=.5,this.instancer=n}init(e){this.position=e.position}update(e){this.instancer.setMatrixAt(this.instanceId,(new l.yGw).makeTranslation(this.position.x,this.position.y,this.position.z).multiply((new l.yGw).makeScale(2*this.radius,2*this.radius,1))),this.instancer.instanceMatrix.needsUpdate=!0}setColor(e){this.instancer.setColorAt(this.instanceId,e),this.instancer.instanceColor.needsUpdate=!0}}class y extends l.SPe{constructor(e,n){super(new l.BKK(2*e,2*e),new l.jyz({uniforms:{radius:{value:e}},vertexShader:r.circleVertexInstanced(),fragmentShader:r.circleFragmentInstanced(),glslVersion:l.LSk,side:l.ehD,transparent:!0}),n),this.shaderMat=this.material}getInstance(e){return new x(e,this)}}(a={clock:new l.SUY,delta:0}).clock.autoStart=!0;const g=document.querySelector("#glCanvas"),b=new l.CP7({canvas:g});var w;b.autoClear=!1,b.autoClearColor=!1,b.autoClearDepth=!1,b.autoClearStencil=!1,b.setSize(window.innerWidth,window.innerHeight),b.setPixelRatio(1),w=new class extends class{constructor(){}}{constructor(e){super(),this.scene=new l.xsS;const n=window.innerHeight/window.innerWidth;this.camera=new l.iKG(-1,1,1*n,-1*n,-1,1),this.physics=new p(1),this.gameObjects=[]}start(){const e=20,n=[],t=[],i=[];for(let o=0;o<e;o++){const o=[];for(let n=0;n<e;n++)o.push({attraction:.5*l.M8C.randFloat(-1,1),radius:l.M8C.randFloat(.01,.1),orbitter:l.M8C.randFloat(0,1)<.4});t.push(new l.Ilk(l.M8C.randFloat(0,1),l.M8C.randFloat(0,1),l.M8C.randFloat(0,1))),i.push(l.M8C.randFloat(0,1)),n.push(o)}const o=new y(.002,1e3);this.scene.add(o);for(let s=0;s<o.count;s++){const r=new v;r.position.set(l.M8C.randFloat(-.4,.4),l.M8C.randFloat(-.2,.2),0);const a=o.getInstance(s);a.setColor(t[s%e]),r.attachComponent(a);const c=new f(s%e,i[s%e],n[s%e],this.physics.collisionDetector);new m(.002,c),r.attachComponent(c),this.physics.addBody(c),r.visible=!1,this.scene.add(r),this.gameObjects.push(r)}}onResize(e,n){const t=window.innerHeight/window.innerWidth;this.camera=new l.iKG(-1,1,1*t,-1*t,-1,1)}update(e){this.physics.update(e);for(let n of this.gameObjects)n.update(e)}render(e){e.setRenderTarget(null),e.render(this.scene,this.camera)}stop(){}}(g),w.start(),window.onresize=function(){b.setSize(window.innerWidth,window.innerHeight),w.onResize(new l.FM8(window.innerWidth,window.innerHeight),new l.FM8(0,0))},function e(){a.delta=l.M8C.clamp(a.clock.elapsedTime,.016,1),b.clear(!0,!0,!0),w.render(b),w.update(a.delta),requestAnimationFrame(e)}()}},t={};function i(e){var o=t[e];if(void 0!==o)return o.exports;var s=t[e]={exports:{}};return n[e](s,s.exports,i),s.exports}i.m=n,e=[],i.O=(n,t,o,s)=>{if(!t){var r=1/0;for(u=0;u<e.length;u++){for(var[t,o,s]=e[u],a=!0,l=0;l<t.length;l++)(!1&s||r>=s)&&Object.keys(i.O).every((e=>i.O[e](t[l])))?t.splice(l--,1):(a=!1,s<r&&(r=s));if(a){e.splice(u--,1);var c=o();void 0!==c&&(n=c)}}return n}s=s||0;for(var u=e.length;u>0&&e[u-1][2]>s;u--)e[u]=e[u-1];e[u]=[t,o,s]},i.d=(e,n)=>{for(var t in n)i.o(n,t)&&!i.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},i.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),(()=>{var e={179:0};i.O.j=n=>0===e[n];var n=(n,t)=>{var o,s,[r,a,l]=t,c=0;if(r.some((n=>0!==e[n]))){for(o in a)i.o(a,o)&&(i.m[o]=a[o]);if(l)var u=l(i)}for(n&&n(t);c<r.length;c++)s=r[c],i.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return i.O(u)},t=self.webpackChunk=self.webpackChunk||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))})();var o=i.O(void 0,[212],(()=>i(790)));o=i.O(o)})();