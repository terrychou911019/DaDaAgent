// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(Number)
    Max_life:number = 100;

    private cur_life:number;

    private original_width = 30;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.cur_life = this.Max_life;
    }

    update (dt) {
        this.node.width = this.original_width*(this.cur_life/this.Max_life);
    }
}
