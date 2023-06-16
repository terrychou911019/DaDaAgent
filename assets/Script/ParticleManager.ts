const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleManager extends cc.Component {

    @property(cc.Prefab)
    iceParticle: cc.Prefab = null;

    @property(cc.Prefab)
    thunderEffect: cc.Prefab = null;

    @property(cc.Prefab)
    flameWalkParticle: cc.Prefab = null;

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

    spawnThunderEffect(pos: cc.Vec2){
        let thunderEffect = cc.instantiate(this.thunderEffect);
        thunderEffect.position = pos;
        this.node.addChild(thunderEffect);
    }

    spawnFlameWalkParticle(pos: cc.Vec2){
        let flameWalkParticle = cc.instantiate(this.flameWalkParticle);
        flameWalkParticle.position = pos;
        this.node.addChild(flameWalkParticle);
    }
}
