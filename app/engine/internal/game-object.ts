import { Object3D } from "three"
import { Component } from "./component"

export class GameObject extends Object3D{
    components: Component[];

    constructor(){
        super();
        this.components = [];
    }

    update(dt: number){
        for(let component of this.components){
            component.update(dt);
        }
    }


    attachComponent(component: Component){
        this.components.push(component);
        component.init(this);
    }
}