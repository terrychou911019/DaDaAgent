// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import type firebase from '../firebase';
declare const firebase: any;

@ccclass
export default class CCAW extends cc.Component {

    @property(cc.Node)
    private camera: cc.Node = null;

    @property(cc.Node)
    private leaderboardButton: cc.Node = null;

    @property(cc.Node)
    private backCCButton: cc.Node = null;

    @property(cc.Node)
    private backbutton: cc.Node = null;

    @property(cc.Node)
    private logOutButton: cc.Node = null;

    private label: cc.Node = null;

    private label2: cc.Node = null;

    private usernameUI: cc.Node = null;

    private mask: cc.Node = null;

    private userdata = null;

    private cameraMoveStartX = 0;

    private cameraMoveEndX = 1040;

    private characterButton: cc.Node = null;

    private weaponButton: cc.Node = null;

    backButtinClick(){//the back button been clicked
        const script = this.characterButton.getComponent('CCAW_button');
        if (script) {
            script.changeToCC();
        }
    }

    moveToLeaderboard(){
        this.turnOutButton();
        this.leaderboardButton.active = false;
        this.logOutButton.active = false;
        this.usernameUI.active = false;
        this.camera.runAction(cc.sequence(
            cc.moveTo(3, -1000, this.camera.y),
            cc.callFunc(()=>{
                this.backCCButton.active = true;
                this.turnOnButton()
            })
        ))
    }

    moveBackToCC(){
        this.turnOutButton();
        this.backCCButton.active = false;
        this.camera.runAction(cc.sequence(
            cc.moveTo(3, 0, this.camera.y),
            cc.callFunc(()=>{
                this.leaderboardButton.active = true;
                this.logOutButton.active = true;
                this.usernameUI.active = true;
                this.turnOnButton()
            })
        ))
    }

    moveToCW(){//camera move to choose weapon
        this.turnOutButton();
        this.leaderboardButton.active = false;
        this.logOutButton.active = false;
        this.usernameUI.active = false;
        this.camera.runAction(cc.sequence(
            cc.moveTo(8, this.cameraMoveEndX, this.camera.y),
            cc.callFunc(()=>{
                this.backbutton.active = true;
                this.turnOnButton()
            })
        ))
    }

    moveToCC(){//camera move to choose character
        this.turnOutButton();
        this.backbutton.active = false;
        this.camera.runAction(cc.sequence(
            cc.moveTo(8, this.cameraMoveStartX, this.camera.y),
            cc.callFunc(()=>{
                this.leaderboardButton.active  = true;
                this.logOutButton.active = true;
                this.usernameUI.active = true;
                this.turnOnButton()
            })
        ))
    }

    moveToGame(){
        //set charater's name in loacal storage
        const script1 = this.characterButton.getComponent('CCAW_button');
        if (script1) {
            let charater = script1.goalNode.name;
            cc.sys.localStorage.setItem('charater', charater);
        }
        const script2 = this.weaponButton.getComponent('CCAW_button');
        if (script2) {
            let weapon = script2.goalNode.name;
            cc.sys.localStorage.setItem('weapon', weapon);
        }
        this.turnOutButton();
        this.enterGameAction();
    }

    turnOutButton(){//let all button uninteractable
        const allNodes = cc.find('Canvas').children;
        for (let i = 0; i < allNodes.length; i++) {
            const node = allNodes[i];
            const button = node.getComponent(cc.Button);
            if (button) {
                button.interactable = false;
            }
        }
    }

    turnOnButton(){//let all button interactable
        const allNodes = cc.find('Canvas').children;
        for (let i = 0; i < allNodes.length; i++) {
            const node = allNodes[i];
            const button = node.getComponent(cc.Button);
            if (button) {
                button.interactable = true;
            }
        }
    }

    labelAction(){
        this.label.opacity = 0;
        this.label.setPosition(0, 0);
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
        this.mask.opacity = 255
        this.mask.setPosition(0, 0);
        this.mask.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.fadeTo(1, 0)
        ))
    }

    enterGameAction(){
        this.mask.opacity = 0;
        this.mask.setPosition(this.camera.getPosition())
        this.mask.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.fadeTo(1, 255),
            cc.callFunc(()=>{
                cc.director.loadScene('Game');
            })
        ))
    }

    logOutMaskAction(){
        this.mask.opacity = 0;
        this.mask.setPosition(0, 0);
        this.mask.runAction(cc.sequence(
            cc.fadeTo(1, 255),
            cc.callFunc(()=>{
                this.logOutLabelAction();
            })
        ))
    }

    logOutLabelAction(){
        this.label2.opacity = 0;
        this.label2.setPosition(0, 0);
        this.label2.runAction(cc.sequence(
            cc.fadeTo(1, 255),
            cc.delayTime(1),
            cc.fadeTo(1, 0),
            cc.callFunc(()=>{
                cc.director.loadScene('Title');
            })
        ))
    }

    setCharacterButton(N:cc.Node){
        this.characterButton = N;
    }

    getCharacterButton(){
        return this.characterButton;
    }

    setWeaponButton(N:cc.Node){
        this.weaponButton = N;
    }

    getWeaponButton(){
        return this.weaponButton;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.label = cc.find('Canvas/Label');
        this.label.opacity = 0;
        this.label2 = cc.find('Canvas/Label2');
        this.label2.opacity = 0;
        this.mask = cc.find('Canvas/Mask');
        this.mask.opacity = 255;
        this.usernameUI = cc.find('Canvas/usernameUI')
        this.labelAction();
        //get userdata
        const jsonStr = cc.sys.localStorage.getItem('userdata');
        this.userdata = JSON.parse(jsonStr);
        console.log(this.userdata)
        //button
        this.leaderboardButton.active = true;
        this.backCCButton.active = false;
        this.backbutton.active = false;

        //set user name
        this.usernameUI.getChildByName('username').getComponent(cc.Label).string = this.userdata.username;
    }

    logOut(){
        firebase.auth().signOut().then(() => {
            console.log("log out successful")
            cc.sys.localStorage.setItem('userdata', null);
            this.logOutMaskAction();
        }).catch((e)=>{
            console.log(e);
        })
    }

    start () {

    }

    // update (dt) {}
}
