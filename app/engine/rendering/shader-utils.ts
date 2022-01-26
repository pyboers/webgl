
export namespace ShaderUtils{

    export function countNeighbours(){
        return `
            int countNeighbours(vec2 texel, sampler2D b){
                int count = 0;
                vec2 texSize = vec2(textureSize(b, 0));
                count += int(texture(b, ((texel) + vec2(0, 1)) / texSize).x >= 0.5);
                count += int(texture(b, ((texel) + vec2(1, 1)) / texSize).x >= 0.5);
                count += int(texture(b, ((texel) + vec2(1, 0)) / texSize).x >= 0.5);
                count += int(texture(b, ((texel) + vec2(1, -1)) / texSize).x >= 0.5);
                count += int(texture(b, ((texel) + vec2(0, -1)) / texSize).x >= 0.5);
                count += int(texture(b, ((texel) + vec2(-1, -1)) / texSize).x >= 0.5);
                count += int(texture(b, ((texel) + vec2(-1, 0)) / texSize).x >= 0.5);
                count += int(texture(b, ((texel) + vec2(-1, 1)) / texSize).x >= 0.5);
                
                return count;
            }
        `;
    }

    export function setupRules(rules: string){
        const da = rules.split('/');
        const d = da[0].replace('B', '');
        const a = da[1].replace('S', '');

        const deadRules = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for(let rule of d){
            deadRules[parseInt(rule)] = 1;
        }

        const aliveRules = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for(let rule of a){
            aliveRules[parseInt(rule)] = 1;
        }

        return `
            const int aliveRules[9] = int[9](${aliveRules.join(',')});
            const int deadRules[9] = int[9](${deadRules.join(',')});
        `;
    }

    export function cellularAutomata(){
        return `
            int cellularAutomata(int alive, int neighbours){
                return (int(alive > 0) * aliveRules[neighbours]) + (int(alive == 0) * deadRules[neighbours]);
            }
        `
    }

    export function sphericalBillboardMatrix(){
        return `
            mat4 sphericalBillboardMatrix(mat4 modelview){
                mat4 ModelView = modelview;
                // Column 0:
                ModelView[0][0] = 1.0;
                ModelView[0][1] = 0.0;
                ModelView[0][2] = 0.0;
                // Column 1:
                ModelView[1][0] = 0.0;
                ModelView[1][1] = 1.0;
                ModelView[1][2] = 0.0;
                // Column 2:
                ModelView[2][0] = 0.0;
                ModelView[2][1] = 0.0;
                ModelView[2][2] = 1.0;
                
                return ModelView;
            }
        `
    }

    export function sphereIntersect(){
        return `
            float sphereIntersect(vec3 origin, vec3 dir, vec3 center, float radius)
            {
                vec3 oc = origin - center;
                float a = dot(dir, dir);
                float b = 2.0 * dot(oc, dir);
                float c = dot(oc,oc) - radius*radius;
                float discriminant = b*b - 4.0*a*c;
                if(discriminant < 0.0){
                    return -1.0;
                }
                else{
                    return (-b - sqrt(discriminant)) / (2.0*a);
                }
            }
        `
    }

    export function planeIntersect(){
        return `
            float planeIntersect(vec3 origin, vec3 dir, vec3 plane, vec3 planePoint){
                vec3 diff = origin - planePoint;
                float distNorm = dot(plane, diff);
                float rayDot = dot(dir, plane);
                return distNorm/rayDot;
            }
        `
    }

    export function nearestCubePoint(){
        return `
            struct HitValue{
                vec3 position;
                vec3 normal;
            };

            HitValue nearestCubePoint(vec3 origin, vec3 dir){
                float closestX = origin.x;
                float closestY = origin.y;
                float closestZ = origin.z;

                if(dir.x > 0.0){
                    closestX = ceil(origin.x / cubeSize) * cubeSize;
                }else if (dir.x < 0.0){
                    closestX = floor(origin.x / cubeSize) * cubeSize;
                }

                if(dir.y > 0.0){
                    closestY = ceil(origin.y / cubeSize) * cubeSize;
                }else if (dir.y < 0.0){
                    closestY = floor(origin.y / cubeSize) * cubeSize;
                }

                if(dir.z > 0.0){
                    closestZ = ceil(origin.z / cubeSize) * cubeSize;
                }else if (dir.z < 0.0){
                    closestZ = floor(origin.z / cubeSize) * cubeSize;
                }

                float xCloseness = (closestX - origin.x) / dir.x;
                float yCloseness = (closestY - origin.y) / dir.y;
                float zCloseness = (closestZ - origin.z) / dir.z;

                HitValue hv;
                
                if(yCloseness <= xCloseness && yCloseness <= zCloseness){
                    hv.position = vec3(origin.x + dir.x * yCloseness, closestY, origin.z + dir.z * yCloseness);
                    hv.normal = vec3(0.0, -sign(dir.y), 0.0);
                } else if(xCloseness <= yCloseness && xCloseness <= zCloseness){
                    hv.position = vec3(closestX, origin.y + dir.y * xCloseness, origin.z + dir.z * xCloseness);
                    hv.normal = vec3(-sign(dir.x), 0.0, 0.0);
                } else{
                    hv.position = vec3(origin.x + dir.x * zCloseness, origin.y + dir.y * zCloseness, closestZ);
                    hv.normal = vec3(0.0, 0.0, -sign(dir.z));
                }

                return hv;
            }
        `;
    }
}