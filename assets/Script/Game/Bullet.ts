

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    damage: number = 0;
    moveSpeed: number = 0;
    direction: number[] = [0, 0];

    skillManager: any = null;
    particleManager: cc.Node = null;

    move(dt) {
        this.node.x += this.moveSpeed * this.direction[0] * dt;
        this.node.y += this.moveSpeed * this.direction[1] * dt;
    }

    // LIFE-CYCLE CALLBACKS:
    onBeginContact(contact, self, other) {
        // if other is enemy, then let enemy take damage and destroy self
        if(other.node.name == 'TestEnemy') {
            if(this.skillManager.skillMap['Thunder'] == true){
                this.particleManager.getComponent('ParticleManager').spawnThunderEffect(other.node.position);
            }
            if(this.skillManager.skillMap['Ice'] == true){
                this.particleManager.getComponent('ParticleManager').spawnIceParticle(other.node.position);
            }
            if(this.skillManager.skillMap['Frozen'] == true){
                // if enemy is already frozen, then do nothing
                if(other.node.getComponent('TestEnemy').isFrozen == true){
                    return;
                }
                this.particleManager.getComponent('ParticleManager').spawnFrozenEffect(other.node.position);
                other.node.getComponent('TestEnemy').isFrozen = true;
                // unfroze after 2 second
                other.node.getComponent('TestEnemy').scheduleOnce(function() {
                    console.log('unfroze');
                    other.node.getComponent('TestEnemy').isFrozen = false;
                }, 2);
            }
        }
    }

    onLoad () {
        this.skillManager = cc.find('Canvas/SkillManager').getComponent('SkillManager');
        this.particleManager = cc.find('Canvas/ParticleManager');

        if(this.skillManager.skillMap['LightBullet'] == false){
            // cancel child visible
            this.node.getChildByName('wake').active = false;
        }

        this.scheduleOnce( () => {
            this.node.destroy();   
        }, 2)
    }

    gameTick (dt) {
        this.move(dt);
    }    
}
// start () {}
