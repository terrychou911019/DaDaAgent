const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleManager extends cc.Component {

    @property(cc.Prefab)
    iceParticle: cc.Prefab = null;

    @property(cc.Prefab)
    thunderEffect: cc.Prefab = null;

    @property(cc.Prefab)
    flameWalkParticle: cc.Prefab = null;

    @property(cc.Prefab)
    frozenEffect: cc.Prefab = null;

    @property(cc.Prefab)
    UITEffect1: cc.Prefab = null;

    @property(cc.Prefab)
    UITEffect2: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
        
    // }

    start () {
        this.node.zIndex = 1;
    }

    // update (dt) {}

    spawnIceParticle(pos: cc.Vec2){
        let iceParticle = cc.instantiate(this.iceParticle);
        iceParticle.position = cc.v3(pos, 0);
        this.node.addChild(iceParticle);
    }

    spawnThunderEffect(pos: cc.Vec2){
        let thunderEffect = cc.instantiate(this.thunderEffect);
        thunderEffect.position = cc.v3(pos, 0);
        this.node.addChild(thunderEffect);
    }

    spawnFlameWalkParticle(pos: cc.Vec2){
        let flameWalkParticle = cc.instantiate(this.flameWalkParticle);
        flameWalkParticle.position = cc.v3(pos, 0);
        this.node.addChild(flameWalkParticle);
    }

    spawnFrozenEffect(pos: cc.Vec2){
        let frozenEffect = cc.instantiate(this.frozenEffect);
        frozenEffect.position = cc.v3(pos, 0);
        this.node.addChild(frozenEffect);
    }

    spawnUITEffect1(pos: cc.Vec2){
        let UITEffect = cc.instantiate(this.UITEffect1);
        UITEffect.position = cc.v3(pos, 0);
        this.node.addChild(UITEffect);
    }

    spawnUITEffect2(pos: cc.Vec2){
        let UITEffect = cc.instantiate(this.UITEffect2);
        UITEffect.position = cc.v3(pos, 0);
        this.node.addChild(UITEffect);
    }
    
}
