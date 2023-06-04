// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export enum ButtonState {
    Rest,      // Button is not pressed
    Pressed,   // Button is pressed down this frame
    Held,      // Button is held down
    Released   // Button is released this frame
}

export type Axis1D = number;

export interface IInputControl {
    readonly horizontalAxis: Axis1D;
    readonly verticalAxis: Axis1D;
    readonly attack: ButtonState;
    readonly skill: ButtonState;
}

export function isInputControl(object: any): object is IInputControl {
    return object &&
        (object.horizontalAxis !== undefined) &&
        (object.verticalAxis !== undefined) &&
        (object.attack !== undefined) &&
        (object.skill !== undefined);
}
