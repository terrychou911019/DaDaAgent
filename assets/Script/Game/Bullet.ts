interface SHOOTRANGE {
    x: number,
    y: number
};

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    damage: number = 0;
    moveSpeed: number = 0;
    direction: number[] = [0, 0];

    shootRange: SHOOTRANGE = {x: 0, y: 0};

    move(dt) {
        this.node.x += this.moveSpeed * this.direction[0] * dt;
        this.node.y += this.moveSpeed * this.direction[1] * dt;

        if ((this.direction[0] < 0 && this.node.x < this.shootRange.x) || (this.direction[0] > 0 && this.node.x > this.shootRange.x) ||
            (this.direction[1] < 0 && this.node.y < this.shootRange.y) || (this.direction[1] > 0 && this.node.y > this.shootRange.y))
            
            this.node.destroy();
    }

    // LIFE-CYCLE CALLBACKS:
    onBeginContact(contact, self, other) {
        // if other is enemy, then let enemy take damage and destroy self
        //console.log('bullet collision');
    }

    onLoad () {
        this.shootRange.x = this.node.x + this.moveSpeed * this.direction[0] * 2;
        this.shootRange.y = this.node.y + this.moveSpeed * this.direction[1] * 2;
    }

    update (dt) {
        this.move(dt);
    }    
}
// start () {}
