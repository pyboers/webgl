import { Body } from "../bodies/body";
import { Constraint } from "./constraint";

export namespace IterativeSolver{

    export function solve(constraints: Constraint[], dt: number, stepCount: number){
        for(let i = 0; i < stepCount; i++){
            for(let constraint of constraints){
                constraint.solve(dt);
            }
        }
    }
}