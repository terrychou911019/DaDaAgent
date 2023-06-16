const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    @property(cc.Node)
    mainCamera: cc.Node = null;

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    bulletGroup: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    weapon: cc.Node = null;

    @property(cc.Node)
    particleManager: cc.Node = null;

    @property(cc.Node)
    enemyGroup: cc.Node = null;

    @property(cc.Node)
    weaponSpin: cc.Node = null;

    isGamePaused = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        if(this.isGamePaused){
            return;
        }

        this.mainCamera.getComponent('MainCamera').gameTick(dt);
        this.background.getComponent('Background').gameTick(dt);
        this.bulletGroup.children.forEach((bullet) => {
            bullet.getComponent('Bullet').gameTick(dt);
        });
        this.player.getComponent('ActorController').gameTick(dt);
        this.weapon.getComponent('Weapon').gameTick(dt);
        //this.particleManager.getComponent('ParticleManager').gameTick(dt);
        this.enemyGroup.children.forEach((enemy) => {
            enemy.getComponent('TestEnemy').gameTick(dt);
        });
        this.weaponSpin.getComponent('WeaponSpin').gameTick(dt);
    }

    pauseGame() {
        this.isGamePaused = true;
    }

    resumeGame(){
        this.isGamePaused = false;
    }
}
