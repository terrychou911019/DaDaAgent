// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Controller from './Input/Controller'
import { ButtonState } from './Input/IInputControl'

const { ccclass, property } = cc._decorator

enum FacingDirection {
  Right,
  Left,
}

enum State {
  Idle,
  Walk,
  Die,
}

@ccclass
export default class ActorController extends Controller {
  @property({ type: cc.Enum(FacingDirection) })
  initialFacingDirection: FacingDirection = FacingDirection.Right

  @property(cc.RigidBody)
  rigidBody: cc.RigidBody = null

  @property(cc.Float)
  moveSpeed = 10

  @property(cc.String)
  idleAnimationName: string = ''
  @property(cc.String)
  walkAnimationName: string = ''
  @property(cc.String)
  dieAnimationName: string = ''
  idleAnimState: cc.AnimationState = null
  walkAnimState: cc.AnimationState = null
  dieAnimState: cc.AnimationState = null

  private _animation: cc.Animation = null

  private cur_State = State.Idle

  @property(cc.Node)
  skillManager: cc.Node = null;

  @property(cc.Node)
  particleManager: cc.Node = null;

  public moveAxisX: number = 0
  public moveAxisY: number = 0
  public get moveAxis2D() {
    return new cc.Vec2(this.moveAxisX, this.moveAxisY)
  }

  checkstate() {
    if (
      this.inputSource.horizontalAxis == 0 &&
      this.inputSource.verticalAxis == 0
    ) {
      this.cur_State = State.Idle
    } else {
      this.cur_State = State.Walk
    }
  }

  playanimation() {
    switch (this.cur_State) {
      case State.Idle:
        if (!this.idleAnimState.isPlaying) {
          this._animation.play(this.idleAnimationName)
        }
        break
      case State.Walk:
        if (!this.walkAnimState.isPlaying) {
          this._animation.play(this.walkAnimationName)
        }
        break
      case State.Die:
        if (!this.dieAnimState.isPlaying) {
          this._animation.play(this.dieAnimationName)
        }
        break
      default:
        break
    }
  }

  onLoad() {
    this.node.scaleX =
      this.initialFacingDirection == FacingDirection.Right ? 1 : -1
    this._animation = this.node.getComponent(cc.Animation)
    // this._rigidBody = this.node.getComponent(cc.RigidBody);
    // if (!this._rigidBody) console.warn(`ActorController: Component cc.Rigidbody missing on node ${this.node.name}`);
  }

  start() {
    super.start()
    this.idleAnimState = this._animation.getAnimationState('idle')
    this.walkAnimState = this._animation.getAnimationState('walk')
    this.dieAnimState = this._animation.getAnimationState('die')
  }

  gameTick(dt) {
    if (this.inputSource) {
      this.node.scaleX =
        this.inputSource.horizontalAxis != 0
          ? this.inputSource.horizontalAxis
          : this.node.scaleX
      this.moveAxisX = this.inputSource.horizontalAxis
      this.moveAxisY = this.inputSource.verticalAxis
    }
    //check current state
    this.checkstate()

    //play animation
    this.playanimation()

    
    if(this.skillManager.getComponent('SkillManager').skillMap['FlameWalk'] == true) {
      this.playFlameWalkParticle();
    }

    this.rigidBody.linearVelocity = this.moveAxis2D.mul(this.moveSpeed)

    this.node.position = this.node.position.add(
      new cc.Vec3(
        this.rigidBody.linearVelocity.x,
        this.rigidBody.linearVelocity.y,
        0,
      ),
    )

    this.rigidBody.linearVelocity = cc.Vec2.ZERO;
  }

  playFlameWalkParticle() {
    if(this.cur_State == State.Walk) {
      // play flame walk particle on players feet
      this.particleManager.getComponent('ParticleManager').spawnFlameWalkParticle(new cc.Vec2(this.node.position.x, this.node.position.y - this.node.height / 2));
    }
  }
}
