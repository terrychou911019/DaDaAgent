// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Controller from "./Input/Controller";

const {ccclass, property} = cc._decorator;

enum FacingDirection {
    Right, 
    Left
}

@ccclass
export default class ActorController extends Controller {
    @property({type: cc.Enum(FacingDirection)})
    initialFacingDirection: FacingDirection = FacingDirection.Right;

    private _rigidBody: cc.RigidBody = null;

    @property(cc.Float) 
    moveSpeed = 10;

    public moveAxisX: number = 0;
    public moveAxisY: number = 0;
    public get moveAxis2D() {
        return new cc.Vec2(this.moveAxisX, this.moveAxisY);
    }

    onLoad() {
        this._rigidBody = this.node.getComponent(cc.RigidBody);
        if (!this._rigidBody) console.warn(`ActorController: Component cc.Rigidbody missing on node ${this.node.name}`);
    }

    start() {
        super.start();
    }

    update(dt) {
        if (this.inputSource) {
            this.moveAxisX = this.inputSource.horizontalAxis;
            this.moveAxisY = this.inputSource.verticalAxis;
        }

        this._rigidBody.linearVelocity = this.moveAxis2D.mul(this.moveSpeed);

        this.node.position = this.node.position.add(this._rigidBody.linearVelocity);
    }
}
