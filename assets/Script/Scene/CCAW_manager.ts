// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CCAW extends cc.Component {

    @property(cc.Node)
    private camera: cc.Node = null;

    private label: cc.Node = null;

    private mask: cc.Node = null;

    private cameraMoveStartX = 0;

    private cameraMoveEndX = 1040;

    private chosenButton: cc.Node = null;


    unableBackButton(){
        const node = cc.find('Canvas/back_button');
        node.active = true;
    }

    disableBackButton(){
        const node = cc.find('Canvas/back_button')
        node.active = false;
    }

    backButtinClick(){//the back button been clicked
        const script = this.chosenButton.getComponent('CCAW_button');
        if (script) {
            script.changeToCC();
        }
    }

    moveToCW(){//camera move to choose weapon
        this.turnOutButton();
        this.camera.runAction(cc.sequence(
            cc.moveTo(8, this.cameraMoveEndX, this.camera.y),
            cc.callFunc(()=>{
                this.turnOnButton()
            })
        ))
    }

    moveToCC(){//camera move to choose character
        this.turnOutButton();
        this.camera.runAction(cc.sequence(
            cc.moveTo(8, this.cameraMoveStartX, this.camera.y),
            cc.callFunc(()=>{
                this.turnOnButton()
            })
        ))
    }

    moveToGame(){
        //set charater's name in loacal storage
        const script = this.chosenButton.getComponent('CCAW_button');
        if (script) {
            let charater = script.goalNode.name
            cc.sys.localStorage.setItem('charater', charater);
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
            cc.fadeTo(1, 0)
        ))
    }

    enterGameAction(){
        this.mask.setPosition(this.camera.getPosition())
        this.mask.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.fadeTo(1, 255),
            cc.callFunc(()=>{
                cc.director.loadScene('Game');
            })
        ))
    }

    setChosenButton(N:cc.Node){
        this.chosenButton = N;
    }

    getChosenButton(){
        return this.chosenButton;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.label  = cc.find('Canvas/Label');
        this.label.opacity = 0;
        this.mask = cc.find('Canvas/Mask');
        this.mask.opacity = 255;
        this.labelAction();
    }

    start () {

    }

    // update (dt) {}
}
