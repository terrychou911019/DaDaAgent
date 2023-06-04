const { ccclass, property } = cc._decorator;

@ccclass
export class PlayerMovement extends cc.Component {
    @property(cc.Float)
    private moveSpeed: number = 200;

    private velocity: cc.Vec2 = cc.Vec2.ZERO;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onEnable() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.velocity.x = -1;
                break;
            case cc.macro.KEY.right:
                this.velocity.x = 1;
                break;
            case cc.macro.KEY.up:
                this.velocity.y = 1;
                break;
            case cc.macro.KEY.down:
                this.velocity.y = -1;
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.velocity.x = 0;
                break;
            case cc.macro.KEY.up:
            case cc.macro.KEY.down:
                this.velocity.y = 0;
                break;
        }
    }

    update(dt: number) {
        const movement = this.velocity.mul(this.moveSpeed * dt);
        this.node.position = this.node.position.add(new cc.Vec3(movement.x, movement.y, 0));

        //console.log("player ", this.node.position.x, this.node.position.y);
    }
}
