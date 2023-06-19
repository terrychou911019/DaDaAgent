const {ccclass, property} = cc._decorator;

@ccclass
export default class UltManager extends cc.Component {
    @property(cc.Node)
    ultButton: cc.Node = null;

    @property(cc.Node)
    timeManager: cc.Node = null;

    @property(cc.Node)
    enemyManager: cc.Node = null;

    ultCD = 5;
    ultTimer = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    gameTick(dt){
        // change button label in 'ULT in Xs'
        let label = this.ultButton.getChildByName('Background').getChildByName('Label');
        label.getComponent('cc.Label').string = 'ULT in ' + (this.ultCD - this.ultTimer).toFixed(1) + 's';

        this.ultTimer += dt;
        if(this.ultTimer >= this.ultCD){
            this.ultTimer = this.ultCD;
            //this.ultButton.active = true;
        }
    }

    handleUltButton(){
        if(this.ultTimer < this.ultCD){
            return;
        }

        this.ultTimer = 0;
        this.enemyManager.getComponent('EnemyManager').playerUseUlt();
    }
}
