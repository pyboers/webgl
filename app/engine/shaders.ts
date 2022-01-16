

export function cubedSphereVertex(){
    return `
        void main(){
            gl_Position = vec4(position, 1);
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


        uniform float cubeSize;

        out vec4 color;

        float planeIntersect(vec3 origin, vec3 dir, vec3 plane, vec3 planePoint){
            vec3 diff = origin - planePoint;
            float distNorm = dot(plane, diff);
            float rayDot = dot(dir, plane);
            return distNorm/rayDot;
        }

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

        int pointInSphereCube(vec3 point, vec3 center, float radius){
            vec3 pointDir = point - center;
            pointDir = vec3(ivec3(pointDir - vec3(sign(pointDir.x) * cubeSize, sign(pointDir.y) * cubeSize, sign(pointDir.y) * cubeSize)))/cubeSize;
            return int(length(pointDir) <= radius);
        }

        vec3 nearestCubePoint(vec3 origin, vec3 dir){
            float closestX = float(int((origin.x + (cubeSize * sign(dir.x)))/cubeSize)) * cubeSize;
            float closestY = float(int((origin.y + (cubeSize * sign(dir.y)))/cubeSize)) * cubeSize;
            float closestZ = float(int((origin.z + (cubeSize * sign(dir.z)))/cubeSize)) * cubeSize;

            float xCloseness = abs((closestX - origin.x) / dir.x);
            float yCloseness = abs((closestY - origin.y) / dir.y);
            float zCloseness = abs((closestZ - origin.z) / dir.z);
            
            if(xCloseness <= yCloseness && xCloseness <= zCloseness){
                return vec3(-sign(dir.x), 0.0, 0.0);
                // return vec3(closestX, origin.y + dir.y * xCloseness, origin.z + dir.z * xCloseness);
            }else if(yCloseness <= xCloseness && yCloseness <= zCloseness){
                return vec3(0.0, -sign(dir.y), 0.0);
                // return vec3(origin.x + dir.x * yCloseness, closestY, origin.z + dir.z * yCloseness);
            }else{
                return vec3(0.0, 0.0, -sign(dir.z));
                // return vec3(origin.x + dir.x * zCloseness, origin.y + dir.y * zCloseness, closestZ);
            }
        }

        float cubesIntersect(vec3 origin, vec3 dir, vec3 center, float radius){
            float closestX = float(int((origin.x + (cubeSize * sign(dir.x)))/cubeSize)) * cubeSize;
            float closestY = float(int((origin.y + (cubeSize * sign(dir.y)))/cubeSize)) * cubeSize;
            float closestZ = float(int((origin.z + (cubeSize * sign(dir.z)))/cubeSize)) * cubeSize;

            return 0.0;
        }

        void main(){
            vec4 uv = gl_FragCoord;
            uv.xy /= resolution;
            uv.xy = uv.xy * 2.0 - 1.0;
            vec4 camRay = uv;
            camRay.z = 1.0;
            camRay.w = 1.0;
            camRay = camProjection * camRay;
            // camRay.w = 0.0;
            camRay = camView * (camRay/camRay.w);

            vec3 ray = normalize(camRay.xyz - camPos) ;

            float dist = sphereIntersect(camPos, ray, vec3(0, 0, 0), 1.0);
            vec3 hit = ray * dist + camPos;

            // vec3 hit = ray * dist;
            hit = nearestCubePoint(hit, ray);

            color = vec4(hit * 0.5 + 0.5, 1) * float(dist >= 0.0);
            // color = vec4(ray* 0.5 + 0.5, 1);
        }
    `;
}