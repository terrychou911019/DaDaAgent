const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleManager extends cc.Component {

    @property(cc.Prefab)
    iceParticle: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    spawnIceParticle(pos: cc.Vec2){
        let iceParticle = cc.instantiate(this.iceParticle);
        iceParticle.position = pos;
        this.node.addChild(iceParticle);
    }
}
