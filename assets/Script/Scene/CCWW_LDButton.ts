// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LDButton extends cc.Component {

    private score: cc.Node = null;

    private playerName: cc.Node = null;

    onButtonLeave() {
        this.score.active = this.playerName.active = false;
    }

    onButtonEnter() {
        this.score.active = this.playerName.active = true;
    }
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.score = this.node.getChildByName('score');
        this.playerName = this.node.getChildByName('name');
        this.score.active = this.playerName.active = false
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onButtonEnter, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onButtonLeave, this);
    }

    start () {

    }

    // update (dt) {}
}


