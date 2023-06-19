// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import type firebase from '../firebase';
declare const firebase: any;
@ccclass
export default class GameWin_manager extends cc.Component {
    private gamewin_label: cc.Label = null;
    private score_label: cc.Label = null;
    private hint_label: cc.Label = null;

    private fadeDuration: number = 1;

    private mask = null;

    private character_name = null;

    private character = null;

    private userdata = null;

    @property(cc.SpriteFrame)
    littleRedIcon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    abaoIcon: cc.SpriteFrame = null;

    @property(cc.AnimationClip)
    littleRedAnim: cc.AnimationClip = null;

    @property(cc.AnimationClip)
    abaoAnim: cc.AnimationClip = null;

    private _animation: cc.Animation = null;

    private updateFinished: boolean = false;

    private audioManager = null;

    onLoad() {
        this.gamewin_label = cc.find("Canvas/gamewin").getComponent(cc.Label);
        this.score_label = cc.find("Canvas/score").getComponent(cc.Label);
        this.hint_label = cc.find("Canvas/hint").getComponent(cc.Label);
        this.score_label.string = "Score: " + cc.sys.localStorage.getItem("score").toString().padStart(6, '0');
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.mask = cc.find("Canvas/Mask");
        this.character = cc.find("Canvas/character");
        this.character_name = cc.sys.localStorage.getItem('charater');
        this._animation = this.character.getComponent(cc.Animation);
        if (this.character_name == "LittleRed") {
            this.character.getComponent(cc.Sprite).spriteFrame = this.littleRedIcon;
            this.character.scale = 2;
            this._animation.play("LittleRed_walk");
        }
        else {
            this.character.getComponent(cc.Sprite).spriteFrame = this.abaoIcon;
            this.character.scale = 2;
            this._animation.play("Abao_walk");
        }

        this.audioManager = cc.find("AudioManager");
        this.audioManager.getComponent("AudioManager").stopBGM();
        this.audioManager.getComponent("AudioManager").playGameWinBGM();

        const jsonStr = cc.sys.localStorage.getItem('userdata')
        this.userdata = JSON.parse(jsonStr)    

        this.updateUserdata();
        this.blink();
    }

    async updateUserdata(){
        if (cc.sys.localStorage.getItem("score") > this.userdata.highscore) {
            this.userdata.highscore = parseInt(cc.sys.localStorage.getItem("score"))
            this.userdata.character = this.character_name;
        }
        try {
            await firebase.database().ref("users/" + this.userdata.id).set(this.userdata).catch((e)=>{
                console.log(e);
            })
            console.log(this.userdata)
            await firebase.database().ref("leaderboard/" + this.userdata.id).set({
                score:this.userdata.highscore
            });
        } catch (error) {
            console.log(error);
        }

        const jsonStr = JSON.stringify(this.userdata);
        cc.sys.localStorage.setItem('userdata', jsonStr);
        
        this.updateFinished = true;
    }

    start() {
        cc.tween(this.gamewin_label.node)
            .to(1.5, { opacity: 255 })
            .start();
        cc.tween(this.score_label.node)
            .to(1.5, { opacity: 255 })
            .start();
        cc.tween(this.hint_label.node)
            .to(1.5, { opacity: 255 })
            .start();
        this.blink();
    }

    blink() {
        const fadeIn = cc.fadeIn(this.fadeDuration);
        const fadeOut = cc.fadeOut(this.fadeDuration);
        const blinkCallback = cc.callFunc(this.blink, this);
        const blinkSequence = cc.sequence(fadeOut, fadeIn, blinkCallback);

        this.hint_label.node.runAction(blinkSequence);
    }

    onKeyDown(e: cc.Event.EventKeyboard) {
        switch (e.keyCode) {
            case cc.macro.KEY.enter:
                this.scheduleOnce(() => {
                    if (this.updateFinished) {
                        this.mask.runAction(cc.sequence(
                        cc.fadeTo(1.5, 255),
                        cc.callFunc(() => {
                            cc.director.loadScene('CCAW');
                        })
                    ));
                    }
                });
                break
            default:
                break;
        }
    }
}
