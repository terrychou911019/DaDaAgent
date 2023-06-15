const {ccclass, property} = cc._decorator;

@ccclass
export default class ModalManager extends cc.Component {
    @property(cc.Prefab)
    skillChooseModal: cc.Prefab = null;

    @property(cc.Node)
    player: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    showSkillChooseModal() {
        const modal = cc.instantiate(this.skillChooseModal);
        modal.parent = this.node;
        // adjust modal position to player
        modal.setPosition(this.player.x, this.player.y);
    }

    hideAll() {
        this.node.removeAllChildren();
    }
}
