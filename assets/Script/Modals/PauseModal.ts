import AudioManager from "../AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseModal extends cc.Component {
    gameManager = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.gameManager = cc.find('Canvas/GameManager').getComponent('GameManager');

        this.node.getChildByName('ResumeButton').on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.gameManager.resumeGame();
            this.node.parent.getComponent('ModalManager').hideAll();

            AudioManager.getInstance().resumeAll();
        });
    }

    // update (dt) {}
}
