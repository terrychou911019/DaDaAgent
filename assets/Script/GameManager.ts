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

    @property(cc.Node)
    TimeManager: cc.Node = null;

    @property(cc.Node)
    enemyManager: cc.Node = null;
    
    @property(cc.Node)
    ultManager: cc.Node = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    label: cc.Node = null;

    private lifebar = null;

    isGamePaused = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true
		cc.director.getCollisionManager().enabled = true
        this.lifebar = cc.find("Canvas/Player/lifebar").getComponent("Lifebar");
        //mask and label action
        this.pauseGame()
        this.label.zIndex = this.mask.zIndex = 4;
        this.label.setPosition(0, 0);
        this.mask.setPosition(0, 0);
        this.label.opacity = 0;
        this.mask.opacity = 255;
        this.labelAction();
    }

    debug(){
        console.log(this.enemyGroup.children.length);
    }

    update (dt) {
        if(this.isGamePaused || this.lifebar.cur_life <= 0) {
            return;
        }

        this.TimeManager.getComponent('TimeManager').gameTick(dt);
        this.mainCamera.getComponent('MainCamera').gameTick(dt);
        this.background.getComponent('Background').gameTick(dt);
        this.bulletGroup.children.forEach((bullet) => {
            bullet.getComponent('Bullet').gameTick(dt);
        });
        this.player.getComponent('ActorController').gameTick(dt);
        this.weapon.getComponent('Weapon').gameTick(dt);
        //this.particleManager.getComponent('ParticleManager').gameTick(dt);
        //this.enemyGroup.children.forEach((enemy) => {
            //enemy.getComponent('TestEnemy').gameTick(dt);
        //});
        this.weaponSpin.getComponent('WeaponSpin').gameTick(dt);
        this.enemyManager.getComponent('EnemyManager').gameTick(dt);
        this.ultManager.getComponent('UltManager').gameTick(dt);
    }

    pauseGame() {
        this.isGamePaused = true;
    }

    resumeGame(){
        this.isGamePaused = false;
    }

    changeGame(){
        if(this.isGamePaused){
            this.isGamePaused = false;
            this.resumeGame();
        }
        else{
            this.isGamePaused = true;
            this.pauseGame();
        }
    }

    labelAction(){
        this.label.runAction(cc.sequence(
            cc.fadeTo(1, 255),
            cc.delayTime(1),
            cc.fadeTo(1, 0),
            cc.callFunc(()=>{
                this.maskFadeoutAction();
            })
        ))
    }

    maskFadeoutAction(){
        this.mask.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.fadeTo(1, 0),
            cc.callFunc(()=>{
                this.resumeGame();
            })
        ))
    }

    UITAction(){
        this.mask.setPosition(this.player.getPosition());
        this.mask.color = cc.color(255, 255, 255);
        this.mask.runAction(cc.sequence(
            cc.fadeTo(1, 255),
            cc.delayTime(0.5),
            cc.fadeTo(0, 0.5)
        ))
    }
}
