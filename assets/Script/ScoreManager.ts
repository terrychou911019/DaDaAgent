

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreManager extends cc.Component {
    @property(cc.Label)
    Score5: cc.Label = null;
    @property(cc.Label)
    Score4: cc.Label = null;
    @property(cc.Label)
    Score3: cc.Label = null;
    @property(cc.Label)
    Score2: cc.Label = null;
    @property(cc.Label)
    Score1: cc.Label = null;
    @property(cc.Label)
    Score0: cc.Label = null;

    curScore: number = 0;
    renderScore: number = 0;

    // The first parameter(event) need to be deleted when our enemy is finish
    // It exists because we need to test our EXPManager by button, and button will pass a event parameter
    gainScore(event, score: number = 149) {
        this.curScore += score;
        this.render();
    }

    render() {
        if (this.curScore > 999999)
            this.renderScore = 999999;
        else
            this.renderScore = this.curScore;

        this.Score5.string = Math.floor(this.renderScore / 100000).toString();
        this.Score4.string = Math.floor(this.renderScore % 100000 / 10000).toString();
        this.Score3.string = Math.floor(this.renderScore % 10000 / 1000).toString();
        this.Score2.string = Math.floor(this.renderScore % 1000 / 100).toString();
        this.Score1.string = Math.floor(this.renderScore % 100 / 10).toString();
        this.Score0.string = Math.floor(this.renderScore % 10).toString();
    }

    // LIFE-CYCLE CALLBACKS:
}
