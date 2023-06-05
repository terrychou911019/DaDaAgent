

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    damage: number = 0;
    moveSpeed: number = 0;
    direction: number[] = [0, 0];

    move(dt) {
        this.node.x += this.moveSpeed * this.direction[0] * dt;
        this.node.y += this.moveSpeed * this.direction[1] * dt;
    }

    // LIFE-CYCLE CALLBACKS:
    onBeginContact(contact, self, other) {
        // if other is enemy, then let enemy take damage and destroy self
    }

    onLoad () {
        this.scheduleOnce( () => {
            this.node.destroy();   
        }, 2)
    }

    update (dt) {
        this.move(dt);
    }
    
    start () {}
}
