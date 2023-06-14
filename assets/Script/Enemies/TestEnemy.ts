const {ccclass, property} = cc._decorator;

@ccclass
export default class TestEnemy extends cc.Component {

    @property(cc.Node)
    particleManager: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
    }

    start () {
        // open collision system
        
    }

    // update (dt) {}

    onBeginContact(contact, selfCollider, otherCollider) {
        this.particleManager.getComponent("ParticleManager").spawnIceParticle(selfCollider.node.position);
    }

}
