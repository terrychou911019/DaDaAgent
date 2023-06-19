const {ccclass, property} = cc._decorator;

@ccclass
export default class UltManager extends cc.Component {
    @property(cc.Node)
    ultButton: cc.Node = null;

    @property(cc.Node)
    timeManager: cc.Node = null;

    @property(cc.Node)
    enemyManager: cc.Node = null;

    @property(cc.Node)
    gameManager: cc.Node = null;

    @property(cc.Node)
    particleManager: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;

    ultCD = 30;
    ultTimer = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    gameTick(dt){
        // change button label in 'ULT in Xs'
        let label = this.ultButton.getChildByName('Background').getChildByName('Label');
        label.getComponent('cc.Label').string = (this.ultCD - this.ultTimer).toFixed(0);
        
        this.ultTimer += dt;
        if(this.ultTimer >= this.ultCD){
            this.ultTimer = this.ultCD;
            //this.ultButton.active = true;
            label.getComponent('cc.Label').string = 'Ready';
        }
    }

    handleUltButton(){
        if(this.ultTimer < this.ultCD){
            return;
        }

        this.ultTimer = 0;
        this.gameManager.getComponent('GameManager').pauseGame();//stop game
        this.schedule(this.createPhoenix, 0.2, 10);
        this.scheduleOnce(()=>{
            this.gameManager.getComponent('GameManager').UITAction();//stop game
        }, 2)
        this.scheduleOnce(()=>{
            this.enemyManager.getComponent('EnemyManager').UITEffect();//use effect
        }, 3)
        this.scheduleOnce(()=>{
            this.gameManager.getComponent('GameManager').resumeGame();//stop game
            this.enemyManager.getComponent('EnemyManager').playerUseUlt();
        }, 4)
    }

    createPhoenix(){
        let x = this.player.position.x - 450;
        let y = this.player.position.y + Math.random() * (500 + 1) - 250;
        this.particleManager.getComponent('ParticleManager').spawnUITEffect1(cc.v2(x, y));
    }
}
