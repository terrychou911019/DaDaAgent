// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import CCAW from "./CCAW_manager";

@ccclass
export default class CCAW_button extends cc.Component {
    @property(cc.Node)
    private buttonEffect: cc.Node = null;

    @property(CCAW)
    private ccawManager: CCAW = null;

    @property(cc.Node)
    private goalNode: cc.Node = null;

    @property(cc.Button)
    private button: cc.Button = null;

    @property(Number)
    private moveStartX: number = 650;

    @property(Number)
    private moveEndX: number = 650;

    private chosenNode: boolean = false;



    onLoad() {
        this.buttonEffect.active = false;
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onButtonEnter, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onButtonLeave, this);
    }

    onButtonEnter() {
        if (this.button && this.button.interactable && !this.chosenNode) {
            this.buttonEffect.active = true;
        }
    }

    onButtonLeave() {
        this.buttonEffect.active = false;
    }

    changeAnimation(S:string){
        const animation:cc.Animation = this.goalNode.getComponent(cc.Animation);
        switch (S) {
            case 'walk':
                animation.stop();
                animation.play('walk');
                break;
            case 'idle':
                animation.stop();
                animation.play('idle');
                break;
            default:
                break;
        }
    }

    changeToCW(){//change to choose weapon state
        this.changeAnimation('walk');
        //deal with camera, chosen node, and back button
        this.ccawManager.setChosenButton(this.node);
        this.ccawManager.moveToCW();
        this.ccawManager.unableBackButton();
        //this is a chosen node
        this.chosenNode = true;
        this.goalNode.runAction(cc.sequence(
            cc.moveTo(7, this.moveEndX, this.node.y),
            cc.callFunc(()=>{
                this.changeAnimation('idle');
                console.log('change to choose weapon');
            })
        ))
    }
    //this function will be called by CCAW_manager when click the back button
    changeToCC(){//change back to choose character state
        this.changeAnimation('walk');
        //deal with camera, chosen node, and back button
        this.ccawManager.setChosenButton(null);
        this.ccawManager.moveToCC();
        this.ccawManager.disableBackButton();
        //cancel the chosen node
        this.goalNode.scaleX = -1;
        this.chosenNode = false;
        this.goalNode.runAction(cc.sequence(
            cc.moveTo(7, this.moveStartX, this.node.y),
            cc.callFunc(()=>{
                this.changeAnimation('idle');
                this.goalNode.scaleX = 1;
                console.log('change to choose weapon');
            })
        ))
    }
    
    changeToGame(){//have selected the weapon and enter the game
        const characterNode: cc.Node = this.ccawManager.getChosenButton().getComponent('CCAW_button').goalNode;//get chosen button's goal node 
        this.goalNode.runAction(cc.sequence(
            cc.moveTo(2, characterNode.x + 50, characterNode.y),
            cc.callFunc(()=>{
                console.log("choose the weapon and enter the game");
                this.ccawManager.moveToGame();
            })
            
        ))
    }



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
