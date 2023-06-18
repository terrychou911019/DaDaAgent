const {ccclass, property} = cc._decorator;
 
@ccclass
export default class FrozenEffect extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
 
    // onLoad () {}
 
    start () {
        // destroy this node after 2.5 second
        this.scheduleOnce(function() {
            this.node.destroy();
        }
        , 2.5);
    }
 
    // update (dt) {}
}
 
