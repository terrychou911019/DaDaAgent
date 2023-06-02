// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ButtonState, IInputControl } from "./IInputControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KeyboardControl extends cc.Component implements IInputControl {
    private _hAxis: number = 0;
    public get horizontalAxis(): number {
        return this._hAxis;
    }

    private _vAxis: number = 0;
    public get verticalAxis(): number {
        return this._vAxis;
    }

    private _zKey: ButtonState = ButtonState.Rest;
    public get attack(): ButtonState {
        return this._zKey;
    }
    public get skill(): ButtonState {
        return this._zKey;
    }

    onLoad() {}

    start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update() {
        
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this._vAxis++;
                break;
            case cc.macro.KEY.s:
                this._vAxis--;
                break;
            case cc.macro.KEY.a:
                this._hAxis--;
                break;
            case cc.macro.KEY.d:
                this._hAxis++;
                break;
        }
        this._vAxis = clamp(this._vAxis);
        this._hAxis = clamp(this._hAxis);

        switch (this._zKey) {
            case ButtonState.Rest:
            case ButtonState.Released:
                this._zKey = ButtonState.Pressed;
                break;
            case ButtonState.Pressed:
            case ButtonState.Held:
                this._zKey = ButtonState.Held;
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this._vAxis--;
                break;
            case cc.macro.KEY.s:
                this._vAxis++;
                break;
            case cc.macro.KEY.a:
                this._hAxis++;
                break;
            case cc.macro.KEY.d:
                this._hAxis--;
                break;
        }
        this._vAxis = clamp(this._vAxis);
        this._hAxis = clamp(this._hAxis);
        
        switch (this._zKey) {
            case ButtonState.Rest:
            case ButtonState.Released:
                this._zKey = ButtonState.Rest;
                break;
            case ButtonState.Pressed:
            case ButtonState.Held:
                this._zKey = ButtonState.Released;
                break;
        }
    }
}

function clamp(value: number, a: number = -1, b: number = 1) {
    if (value < a) return a;
    if (value > b) return b;
    return value;
}
