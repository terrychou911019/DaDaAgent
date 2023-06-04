// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Controller from "./Input/Controller";
import { ButtonState } from "./Input/IInputControl";

const {ccclass, property} = cc._decorator;

enum FacingDirection {
    Right, 
    Left
}

enum State {
    Idle, 
    Walk, 
    Die
}

@ccclass
export default class ActorController extends Controller {
    @property({type: cc.Enum(FacingDirection)})
    initialFacingDirection: FacingDirection = FacingDirection.Right;
    
    @property(cc.RigidBody)
    rigidBody: cc.RigidBody = null;

    @property(cc.Float) 
    moveSpeed = 10;

    @property(cc.Animation)
    animation: cc.Animation = null; 

    private cur_State = State.Idle

    public moveAxisX: number = 0;
    public moveAxisY: number = 0;
    public get moveAxis2D() {
        return new cc.Vec2(this.moveAxisX, this.moveAxisY);
    }

    checkstate(){
        if (this.inputSource.horizontalAxis == 0 && this.inputSource.verticalAxis == 0) {
            this.cur_State = State.Idle;
        } else {
            this.cur_State = State.Walk;
        }
    }

    playanimation(){
        switch (this.cur_State) {
            case State.Idle:
                if (!this.animation.getAnimationState('idle').isPlaying) {
                    this.animation.play('idle');
                }
                break;
            case State.Walk:
                if (!this.animation.getAnimationState('walk').isPlaying) {
                    this.animation.play('walk');
                }
                break;
            case State.Die:
                if (!this.animation.getAnimationState('walk').isPlaying) {
                    this.animation.play('walk');
                }
                break;
            default:
                break;
        }
    }

    onLoad() {
        this.node.scaleX = this.initialFacingDirection == FacingDirection.Right ? 1 : -1;
        // this._rigidBody = this.node.getComponent(cc.RigidBody);
        // if (!this._rigidBody) console.warn(`ActorController: Component cc.Rigidbody missing on node ${this.node.name}`);
    }

    start() {
        super.start();
    }

    update(dt) {
        if (this.inputSource) {
            this.node.scaleX = this.inputSource.horizontalAxis != 0 ? this.inputSource.horizontalAxis : this.node.scaleX;
            this.moveAxisX = this.inputSource.horizontalAxis;
            this.moveAxisY = this.inputSource.verticalAxis;
        }
        //check current state
        this.checkstate();

        //play animation
        this.playanimation();

        this.rigidBody.linearVelocity = this.moveAxis2D.mul(this.moveSpeed);

        this.node.position = this.node.position.add(this.rigidBody.linearVelocity);
    }
}
