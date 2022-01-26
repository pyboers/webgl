// import * as THREE from "three"
// import { Quaternion } from "three";

// export namespace GJK{
//     export const incompleteState: SimplexState = 0;
//     export const intersectionState: SimplexState = 1;
//     export const noIntersectionState: SimplexState = 2;
//     export type SimplexState = 0 | 1 | 2;
    
//     export const runningState: EPAState = 0;
//     export const completeState: EPAState = 1;
//     export const abortState: EPAState = 2;
//     export type EPAState = 0 | 1 | 2;
    
//     const nullSimplex: SimplexShape = 0;
//     const pointSimplex: SimplexShape = 1;
//     const lineSimplex: SimplexShape = 2;
//     const triangleSimplex: SimplexShape = 3;
//     const tetrahedronSimplex: SimplexShape = 4;
    
    
//     type SimplexShape = 0 | 1 | 2 | 3 | 4; //Technically 0 is not a possible count for simplex unless we allow for a -1 dimension... :p
    
//     interface Simplex {
//         vertsA: THREE.Vector3[];
//         vertsB: THREE.Vector3[];
//         searchDir: THREE.Vector3;
//         originVector: THREE.Vector3;
//         vertices: THREE.Vector3[];
//         state: SimplexState;
//     }
    
//     class Polytope {
//         vertsA: THREE.Vector3[];
//         vertsB: THREE.Vector3[];
//         vertices: THREE.Vector3[];
//         faces: { indices: number[], normal: THREE.Vector3, distance: number }[];
//         normal: THREE.Vector3;
//         distance: number;
//         state: EPAState;
    
//         constructor(simplex: Simplex) {
//             this.vertsA = simplex.vertsA;
//             this.vertsB = simplex.vertsB;
//             this.state = runningState;
//             this.normal = new THREE.Vector3(0, 0, 0);
//             this.distance = Number.MAX_VALUE;
//             this.vertices = simplex.vertices;
//             const e1 = simplex.vertices[0].clone().sub(simplex.vertices[3]);
//             const e2 = simplex.vertices[1].clone().sub(simplex.vertices[3]);
//             const e3 = simplex.vertices[2].clone().sub(simplex.vertices[3]);
    
//             const normal1 = e1.clone().cross(e2).normalize();
//             const normal2 = e2.clone().cross(e3).normalize();
//             const normal3 = e3.clone().cross(e1).normalize();
    
//             const triNorm = simplex.vertices[1].clone().sub(simplex.vertices[2]).cross(simplex.vertices[0].clone().sub(simplex.vertices[2])).normalize();
    
//             this.faces = [
//                 { indices: [3, 0, 1], normal: normal1, distance: normal1.dot(this.vertices[3]) },
//                 { indices: [3, 1, 2], normal: normal2, distance: normal2.dot(this.vertices[3]) },
//                 { indices: [3, 2, 0], normal: normal3, distance: normal3.dot(this.vertices[3]) },
//                 { indices: [2, 0, 1], normal: triNorm, distance: triNorm.dot(this.vertices[2]) }
//             ];
//         }
    
//         search() {
//             const vert = getMinkowskiSupport(this.normal, this.vertsA, this.vertsB);
//             if (vert.dot(this.normal) - this.distance < 0.001) {
//                 this.state = completeState; //Found closest edge and distance
//             }
//             const edges: { a: number, b: number }[] = [];
//             const facesToKeep: { indices: number[], normal: THREE.Vector3, distance: number }[] = [];
//             for (let i = 0; i < this.faces.length; i++) {
//                 const face = this.faces[i];
//                 if (face.normal.dot(vert.clone().sub(this.vertices[face.indices[0]])) > 0) {
//                     const e1 = { a: face.indices[0], b: face.indices[1] };
//                     const e2 = { a: face.indices[1], b: face.indices[2] };
//                     const e3 = { a: face.indices[2], b: face.indices[0] };
    
//                     const e1Index = edges.findIndex((e) => (e.a == e1.b && e.b == e1.a) || (e.a == e1.a && e.b == e1.b));
//                     if (e1Index >= 0) { //Keep unique edges only
//                         edges.splice(e1Index, 1);
//                     } else {
//                         edges.push(e1);
//                     }
    
//                     const e2Index = edges.findIndex((e) => (e.a == e2.b && e.b == e2.a) || (e.a == e2.a && e.b == e2.b));
//                     if (e2Index >= 0) { //Keep unique edges only
//                         edges.splice(e2Index, 1);
//                     } else {
//                         edges.push(e2);
//                     }
    
//                     const e3Index = edges.findIndex((e) => (e.a == e3.b && e.b == e3.a) || (e.a == e3.a && e.b == e3.b));
//                     if (e3Index >= 0) { //Keep unique edges only
//                         edges.splice(e3Index, 1);
//                     } else {
//                         edges.push(e3);
//                     }
//                 } else {
//                     facesToKeep.push(face);
//                 }
//             }
//             this.faces = facesToKeep;
//             this.vertices.push(vert);
//             const vertIndex = this.vertices.length - 1;
//             for (let edge of edges) {
//                 const norm = vert.clone().sub(this.vertices[edge.a]).cross(vert.clone().sub(this.vertices[edge.b])).normalize();
//                 if (norm.dot(vert) < 0) {
//                     norm.negate();
//                 }
//                 const face = { indices: [vertIndex, edge.a, edge.b], normal: norm, distance: norm.dot(vert) };
//                 this.faces.push(face);
//             }
//         }
//     }
    
//     function getWorldVertices(mesh: THREE.Mesh) {
//         const positions = mesh.geometry.getAttribute('position');
//         const vertex = new THREE.Vector3();
//         const vertices: THREE.Vector3[] = [];
    
//         for (let vertIndex = 0; vertIndex < positions.count; vertIndex++) {
//             vertex.fromBufferAttribute(positions, vertIndex).applyMatrix4(mesh.matrixWorld); //Get vertex in world position to be in same space as dir
//             vertices.push(vertex.clone());
//         }
    
//         return vertices;
//     }
//     function getSupportPoint(dir: THREE.Vector3, vertices: THREE.Vector3[]) {
//         let maxVert = new THREE.Vector3();
//         let maxDot = Number.NEGATIVE_INFINITY;
//         for (let vertex of vertices) {
//             const dot = vertex.dot(dir);
//             if (dot > maxDot) {
//                 maxVert.set(vertex.x, vertex.y, vertex.z);
//                 maxDot = dot;
//             }
//         }
    
//         return maxVert;
//     }
    
//     function getMinkowskiSupport(dir: THREE.Vector3, vertsA: THREE.Vector3[], vertsB: THREE.Vector3[]) {
//         const newVert = getSupportPoint(dir, vertsA);
//         newVert.sub(getSupportPoint(dir.clone().negate(), vertsB)); //minkowski difference
//         return newVert;
//     }
    
    
    
//     const errorTolerance = 0.00001;
//     function addMinkowskiSupport(simplex: Simplex) {
//         const newVert = getMinkowskiSupport(simplex.searchDir, simplex.vertsA, simplex.vertsB);
//         if (newVert.dot(simplex.searchDir) < errorTolerance) //Didn't cross the origin in minkowski space. Early exit, can't be intersecting.
//             simplex.state = noIntersectionState;
//         simplex.vertices.push(newVert);
//     }
    
//     function stepGJK(simplex: Simplex, meshA: THREE.Mesh, meshB: THREE.Mesh) {
//         switch (simplex.vertices.length) {
//             case nullSimplex:
//                 simplex.searchDir = meshB.position.clone().sub(meshA.position);
//                 addMinkowskiSupport(simplex);
//                 break;
//             case pointSimplex:
//                 simplex.searchDir.negate();
//                 addMinkowskiSupport(simplex);
//                 break;
//             case lineSimplex:
//                 const edgeVector = simplex.vertices[1].clone().sub(simplex.vertices[0]);
//                 simplex.searchDir = edgeVector.clone().cross(simplex.originVector).cross(edgeVector);
//                 if (Math.abs(simplex.searchDir.lengthSq()) < errorTolerance * errorTolerance) {
//                     simplex.state = intersectionState;
//                     break;
//                 }
//                 addMinkowskiSupport(simplex);
//                 break;
//             case triangleSimplex:
//                 const edge1 = simplex.vertices[0].clone().sub(simplex.vertices[2]);
//                 const edge2 = simplex.vertices[1].clone().sub(simplex.vertices[2]);
//                 const originEdge = simplex.vertices[2].clone().negate();
    
//                 const triNorm = edge1.clone().cross(edge2);
    
//                 const edge1Norm = edge1.clone().cross(triNorm);
//                 const edge2Norm = triNorm.clone().cross(edge2);
    
//                 if (edge1Norm.dot(originEdge) > 0) {
//                     simplex.vertices.splice(1, 1);
//                     simplex.searchDir = edge1Norm;
//                     addMinkowskiSupport(simplex);
//                 } else if (edge2Norm.dot(originEdge) > 0) {
//                     simplex.vertices.splice(0, 1);
//                     simplex.searchDir = edge2Norm;
//                     addMinkowskiSupport(simplex);
//                 } else { //Point in triangle
//                     simplex.searchDir = triNorm;
//                     if (simplex.searchDir.dot(originEdge) < 0) {
//                         simplex.searchDir.negate();
//                         const tmp = simplex.vertices[1];
//                         simplex.vertices[1] = simplex.vertices[0];
//                         simplex.vertices[0] = tmp;
//                     }
//                     addMinkowskiSupport(simplex);
//                 }
//                 break;
//             case tetrahedronSimplex:
//                 //Only need to test three triangles, since the last simplex already tested the first triangle
//                 const e1 = simplex.vertices[0].clone().sub(simplex.vertices[3]);
//                 const e2 = simplex.vertices[1].clone().sub(simplex.vertices[3]);
//                 const e3 = simplex.vertices[2].clone().sub(simplex.vertices[3]);
    
//                 const triN1 = e1.clone().cross(e2);
//                 const triN2 = e2.clone().cross(e3);
//                 const triN3 = e3.clone().cross(e1);
    
//                 //check if faces are correctly oriented, or flipped
//                 const triE1 = simplex.vertices[0].clone().sub(simplex.vertices[2]);
//                 const triE2 = simplex.vertices[1].clone().sub(simplex.vertices[2]);
//                 const triN = triE1.clone().cross(triE2);
    
//                 const newPOriginVec = simplex.vertices[3].clone().negate();
//                 if (triN1.dot(newPOriginVec) > 0) {
//                     simplex.vertices.splice(2, 1);
//                 } else if (triN2.dot(newPOriginVec) > 0) {
//                     simplex.vertices.splice(0, 1);
//                 } else if (triN3.dot(newPOriginVec) > 0) {
//                     simplex.vertices.splice(1, 1);
//                 } else {
//                     simplex.state = intersectionState;
//                 }
//                 break;
//             default:
//                 throw new Error(`${simplex.vertices.length} is not a valid simplex length for 3 dimensions`)
//         }
//         return simplex.state;
//     }
    
//     export function runGJK(meshA: THREE.Mesh, meshB: THREE.Mesh, tolerance: number): SimplexState {
//         //Precompute world vertices to avoid redundant matrix multiplication during gjk.
//         const simplex = {
//             vertices: []
//             , state: incompleteState
//             , vertsA: getWorldVertices(meshA)
//             , vertsB: getWorldVertices(meshB)
//             , searchDir: new THREE.Vector3()
//             , originVector: meshA.position.clone().sub(meshB.position)
//         };
//         let x = 0;
//         while (stepGJK(simplex, meshA, meshB) == incompleteState) { } //run to completion
//         if (simplex.state == incompleteState) {
//             console.log("Error gjk on: " + meshA.parent!.name + " vs " + meshB.parent!.name)
//         }
    
//         if(tolerance == 0){
//             return simplex.state;
//         }
    
//         if (simplex.state == intersectionState) {
//             const polytope = runEPA(simplex, tolerance);
//             if(polytope == null){
//                 console.log("Abort, error, couldn't start epa");
//                 return incompleteState;
//             }else if (polytope.state == runningState) {
//                 console.log("early exit");
//                 return incompleteState;
//             } else if (polytope.state == abortState) {
//                 console.log("Abort, error");
//                 return incompleteState;
//             } else if (polytope.state == completeState) {
//                 if (polytope.distance <= tolerance) {
//                     return noIntersectionState;
//                 }
//                 return intersectionState;
//             }
//         }
//         return simplex.state;
//     }
    
//     export function expandSimplex(simplex: Simplex) {
//         switch (simplex.vertices.length) {
//             case pointSimplex:
//                 throw new Error("Not implemented.");
//             case lineSimplex:
//                 let searchDir = new THREE.Vector3();
//                 const edge = simplex.vertices[1].clone().sub(simplex.vertices[0]).normalize();
//                 const axis = new THREE.Vector3(0, 1, 0);
//                 if (edge.x < edge.y && edge.x < edge.z) {
//                     axis.set(1, 0, 0);
//                 } else if (edge.z < edge.y) {
//                     axis.set(0, 0, 1);
//                 }
//                 searchDir = edge.clone().cross(axis);
//                 //We now have some perpindicular vector to the line
//                 const rot = new Quaternion().setFromAxisAngle(edge, Math.PI / 6);
//                 for (let i = 0; i < 6; i++) {
//                     const newVert = getMinkowskiSupport(searchDir, simplex.vertsA, simplex.vertsB);
//                     if (newVert.lengthSq() > 0.0001) {
//                         simplex.vertices.push(newVert);
//                         break;
//                     }
//                     searchDir.applyQuaternion(rot); //Rotate search direction and look for another
//                 }
//                 if (simplex.vertices.length < 3) {
//                     simplex.state = incompleteState;
//                     return;
//                 }
//             case triangleSimplex:
//                 const edge1 = simplex.vertices[0].clone().sub(simplex.vertices[2]);
//                 const edge2 = simplex.vertices[1].clone().sub(simplex.vertices[2]);
//                 const originEdge = simplex.vertices[2].clone().negate();
    
//                 const triNorm = edge1.clone().cross(edge2);
    
//                 const newVert = getMinkowskiSupport(triNorm, simplex.vertsA, simplex.vertsB);
//                 if (newVert.dot(triNorm) < 0.0001) {
//                     //we need to search in the opposite direction
//                     triNorm.negate();
//                     const tmp = simplex.vertices[0];
//                     simplex.vertices[0] = simplex.vertices[1];
//                     simplex.vertices[1] = tmp;
//                     newVert.copy(getMinkowskiSupport(triNorm, simplex.vertsA, simplex.vertsB));
//                 }
//                 simplex.vertices.push(newVert);
//         }
//     }
    
    
//     export function stepEPA(polytope: Polytope, tolerance: number) {
//         let minFace: { indices: number[], normal: THREE.Vector3, distance: number } | undefined = undefined;
//         let minDistance = Number.POSITIVE_INFINITY;
    
//         for (let face of polytope.faces) {
//             if (face.distance < minDistance) {
//                 minDistance = face.distance;
//                 minFace = face;
//             }
//         }
//         if (minFace == undefined) {
//             polytope.state = abortState;
//             return polytope.state;
//         }
    
//         if (minDistance > tolerance) {
//             polytope.state = completeState;
//             return polytope.state;
//         }
    
//         polytope.normal = minFace!.normal;
//         polytope.distance = minDistance;
//         polytope.search();
    
//         return polytope.state;
//     }
    
//     export function runEPA(simplex: Simplex, tolerance: number): Polytope | null {
//         if (simplex.vertices.length < 4) {
//             expandSimplex(simplex);
//             if (simplex.state == incompleteState)
//                 return null;
//         }
    
//         const polytope = new Polytope(simplex);
    
//         let x = 0;
//         while (stepEPA(polytope, tolerance) == runningState && x++ < 1000) { }
    
//         return polytope;
//     }
// }