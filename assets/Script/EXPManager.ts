import AudioManager, { AudioType } from "./AudioManager";

var expTable = {
    1: 280,
    2: 380,
    3: 480,
    4: 580,
    5: 680,
    6: 780,
    7: 880,
    8: 980,
    9: 1080,
    10: 1180,
    11: 1280,
    12: 1380,
    13: 1480,
    14: 1580,
    15: 1680,
    16: 1780,
    17: 1880,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class EXPManager extends cc.Component {
    @property(cc.Node)
    expBar: cc.Node = null;
    @property(cc.Node)
    levelLabel: cc.Node = null;

    MAXLEVEL: number = 18;
    MAXWIDTH: number = 930;

    curEXP: number = 0;
    curLevel: number = 1;

    // The first parameter(event) need to be deleted when our enemy is finish
    // It exists because we need to test our EXPManager by button, and button will pass a event parameter
    gainEXP(event, exp: number = 46) {
        this.curEXP += exp;
        if (this.curEXP >= expTable[this.curLevel] && this.curLevel < this.MAXLEVEL) {
            this.curEXP -= expTable[this.curLevel];
            this.curLevel ++;
            this.levelLabel.getComponent(cc.Label).string = `${this.curLevel}`;
            cc.find('Canvas/GameManager').getComponent('GameManager').pauseGame();
            cc.find('Canvas/ModalManager').getComponent('ModalManager').showSkillChooseModal();
        
            AudioManager.getInstance().playSoundEffect(AudioType.ChooseSkill);
        }
        
        if (this.curLevel === this.MAXLEVEL) {
            this.expBar.width = this.MAXWIDTH;
            this.expBar.x = 0;
            return;
        }
        this.expBar.width = this.MAXWIDTH * this.curEXP / expTable[this.curLevel];
        this.expBar.x = -(this.MAXWIDTH / 2) + this.expBar.width / 2;
    }

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.levelLabel.getComponent(cc.Label).string = `${this.curLevel}`;
        this.expBar.width = 0;
    }
}
