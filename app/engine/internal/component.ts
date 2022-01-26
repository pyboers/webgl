import { GameObject } from "./game-object";

export interface Component{
    init(object: GameObject): void;
    update(dt: number): void;
}