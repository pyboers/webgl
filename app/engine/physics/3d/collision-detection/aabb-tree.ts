// import * as THREE from 'three';
// import { ElementMesh } from '../model/element-mesh';
// import { RaycastHit } from './v3draycaster';

// export namespace BroadPhase{
//     function volume(bounds: THREE.Box3){
//         let size = new THREE.Vector3(0, 0, 0);
//         bounds.getSize(size);
//         return size.x * size.y * size.z;
//     }
    
//     export class Node{
//         obj: any;
//         mesh: ElementMesh | null;
//         bounds: THREE.Box3;
//         parent: Node | null;
//         right: Node | null;
//         left: Node | null;
    
//         constructor(obj: any, mesh: ElementMesh | null, bounds: THREE.Box3, parent: Node | null){
//             this.obj = obj;
//             this.mesh = mesh;
//             this.bounds = bounds;
//             this.parent = parent;
//             this.right = null;
//             this.left = null;
//         }
    
//         isLeaf() {
//             return this.left == null && this.right == null;
//         }
//     }
    
//     export class AABBTree{
//         root: Node | null;
    
//         constructor(){
//             this.root = null;
//         }
    
//         insert(obj: any, mesh: ElementMesh, bounds: THREE.Box3) {
//             if (this.root == null)
//             {
//                 this.root = new Node(obj, mesh, bounds, null);
//                 return;
//             }
    
//             let parent: Node | null = this.root;
//             while (parent != null)
//             {
//                 if (parent.isLeaf())
//                 {
//                     var newParentBound = parent.bounds.clone();
//                     newParentBound.union(bounds);
    
//                     var newParent = new Node(null, null, newParentBound, parent.parent);
    
//                     if (parent.parent == null)
//                     {
//                         this.root = newParent;
//                     }
//                     else
//                     {
//                         if (parent.parent.left == parent)
//                         {
//                             parent.parent.left = newParent;
//                         }
//                         else
//                         {
//                             parent.parent.right = newParent;
//                         }
//                     }
    
//                     newParent.left = parent;
//                     newParent.left.parent = newParent;
    
//                     newParent.right = new Node(obj, mesh, bounds, newParent);
    
//                     return;
//                 }
//                 else
//                 {
//                     parent.bounds.union(bounds);
    
//                     var rightBounds = parent.right!.bounds.clone();
//                     rightBounds.union(bounds);
    
//                     var leftBounds = parent.left!.bounds.clone();
//                     leftBounds.union(bounds);
    
//                     var rightDelta = volume(rightBounds) - volume(parent.right!.bounds);
//                     var leftDelta = volume(leftBounds) - volume(parent.left!.bounds);
    
//                     if (leftDelta < rightDelta)
//                     {
//                         parent = parent.left;
//                     }
//                     else
//                     {
//                         parent = parent.right;
//                     }
//                 }
//             }
//         }
    
//         query(bounds: THREE.Box3, obj: any){
//             const potentialCollisions: ElementMesh[] = [];
//             if(this.root === null){
//                 return potentialCollisions;
//             }
//             const nodeStack: Node[] = [];
//             nodeStack.push(this.root!);
            
//             while(nodeStack.length > 0){
//                 const node = nodeStack.pop()!;
//                 if(node.obj !== obj && node.bounds.intersectsBox(bounds)){
//                     if(node.mesh != null)
//                         potentialCollisions.push(node.mesh!);
//                     else{
//                         nodeStack.push(node.left!);
//                         nodeStack.push(node.right!);
//                     }
//                 }
//             }
            
//             return potentialCollisions;
//         }
    
//         rayCast(ray: THREE.Ray, raycaster: THREE.Raycaster) {
//             let colliders: RaycastHit[] = [];
//                 if (this.root == null)
//                 {
//                     return colliders;
//                 }
    
//                 let nodes: Node[] = [];
//                 nodes.push(this.root);
//                 let intersectionPoint;
//                 while (nodes.length > 0)
//                 {
//                     var next: Node = nodes.pop()!;
//                     intersectionPoint = new THREE.Vector3();
//                     const rayInside = next.bounds.containsPoint(ray.origin);
//                     if (ray.intersectBox(next.bounds, intersectionPoint) != null || rayInside)
//                     {
//                         if (next.mesh != null)
//                         {
//                             let intersections: any[] = [];
//                             next.mesh!.raycast(raycaster, intersections);
//                             if(intersections.length > 0){
//                                 for(let intersect of intersections){
                                    
//                                     colliders.push(new RaycastHit(next.obj, next.mesh, intersect.point, intersect.distance, intersect.face.normal));
//                                 }
//                             }
//                         }
    
//                         if (next.left != null)
//                         {
//                             nodes.push(next.left);
//                         }
//                         if (next.right != null)
//                         {
//                             nodes.push(next.right);
//                         }
//                     }
//                 }
    
//                 return colliders;
//         }
//     }
// }