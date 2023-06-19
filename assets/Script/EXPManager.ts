import AudioManager, { AudioType } from "./AudioManager";

var expTable = {
    1: 280,
    2: 480,
    3: 680,
    4: 980,
    5: 1280,
    6: 1680,
    7: 1680,
    8: 1680,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class EXPManager extends cc.Component {
    @property(cc.Node)
    expBar: cc.Node = null;
    @property(cc.Node)
    levelLabel: cc.Node = null;

    @property(cc.Node)
    weapon: cc.Node = null;

    MAXLEVEL: number = 9;
    MAXWIDTH: number = 930;

    curEXP: number = 0;
    curLevel: number = 1;
    
    private buffPlayer = false;

    gainEXP(event, exp: number = 46) {
        this.curEXP += exp;
        this.render();

        if (this.curEXP >= expTable[this.curLevel] && this.curLevel < this.MAXLEVEL) {
            this.curEXP -= expTable[this.curLevel];
            this.curLevel ++;
            this.render();

            this.levelLabel.getComponent(cc.Label).string = `${this.curLevel}`;
            cc.find('Canvas/GameManager').getComponent('GameManager').pauseGame();
            cc.find('Canvas/ModalManager').getComponent('ModalManager').showSkillChooseModal();
        
            AudioManager.getInstance().playSoundEffect(AudioType.ChooseSkill);
        }
        
        if (this.curLevel === this.MAXLEVEL) {
            this.expBar.width = this.MAXWIDTH;
            this.expBar.x = 0;
            this.levelLabel.getComponent(cc.Label).string = `      CRAZE!!`;

            if(this.buffPlayer === false) {
                let wp = this.weapon.getComponent('Weapon');
                wp.ATTACT_SPEED_SEC /= 2;
                wp.RELOAD_TIME_SEC = 0;
    
                this.buffPlayer = true;
            }
            return;
        }
    }

    render() {
        this.expBar.width = this.MAXWIDTH * this.curEXP / expTable[this.curLevel];
        this.expBar.x = -(this.MAXWIDTH / 2) + this.expBar.width / 2;
    }

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.levelLabel.getComponent(cc.Label).string = `${this.curLevel}`;
        this.expBar.width = 0;
    }
}
