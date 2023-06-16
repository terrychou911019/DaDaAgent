const {ccclass, property} = cc._decorator;

@ccclass
export default class TestEnemy extends cc.Component {

    isFrozen: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
    }

    start () {
        this.isFrozen = false;
    }

    gameTick (dt) {
        if(this.isFrozen == true){
            return;
        }
        this.node.x += 40 * dt;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        
    }

}
