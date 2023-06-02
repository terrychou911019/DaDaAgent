// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { isInputControl, IInputControl } from "./IInputControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Controller extends cc.Component {
    
    protected inputSource: IInputControl = null;

    start() {
        this.registerInput(<any>this.node.getComponents(cc.Component).find(component => isInputControl(<any>component)))
    }

    public registerInput(input: IInputControl) {
        if (input != null) {
            this.inputSource = input;
        }
    }
}
