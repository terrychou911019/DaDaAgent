

const {ccclass, property} = cc._decorator;

@ccclass
export default class TimeManager extends cc.Component {
    @property(cc.Label)
    Minute: cc.Label = null;
    @property(cc.Label)
    Second1: cc.Label = null;
    @property(cc.Label)
    Second0: cc.Label = null;

    countDownCD: number = 1;
    curMinute: number = 3;
    curSecond: number = 0;
    timeUP: boolean = false;
    timer: any = null;

    @property(cc.Node)
    enemyManager: cc.Node = null;

    countDown() {
        if (this.curMinute === 0 && this.curSecond === 0) {
            //alert("Time UP!");
            this.timeUP = true;
            return;
        }

        if (this.curSecond === 0 && this.curMinute !== 0) {
            this.curSecond = 59;
            this.curMinute--;
            this.render();
            return;
        }
        
        this.curSecond--;
        this.render();
    }

    render() {
        this.Minute.string = this.curMinute.toString();
        this.Second1.string = Math.floor(this.curSecond / 10).toString();
        this.Second0.string = (this.curSecond % 10).toString();
    }

    // LIFE-CYCLE CALLBACKS:
    gameTick(dt) {
        if (this.timeUP)
            return;

        this.countDownCD -= dt;
        if (this.countDownCD <= 0) {
            this.countDownCD = 1;
            this.countDown();

            if (this.curSecond === 30) {
                this.enemyManager.getComponent('EnemyManager').createCD /= 1.5;
            }
        }

        // summon the boss in the last 30 seconds
        // if (this.curMinute === 0 && this.curSecond === 30) {
        if (this.curMinute === 1 && this.curSecond === 0) {
            this.enemyManager.getComponent('EnemyManager').summonBoss();
        }
    }
}
