// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    private backgroundPrefab: cc.Prefab = null;

    private backgroundNodes: cc.Node[] = [];

    private moveSpeed: number = 80;

    private moveEndX = 960;

    private moveDistance = 1920;

    private dir = 1;

    onLoad() {
        this.spawnBackground(true);
        this.spawnBackground(false);
        const spawnInterval = cc.winSize.width / this.moveSpeed - 0.05;
        this.schedule(this.repeatSpawn, spawnInterval);
    }

    repeatSpawn(){
        this.spawnBackground(false);
    }

    spawnBackground(First: boolean) {
        const backgroundNode = cc.instantiate(this.backgroundPrefab);
        backgroundNode.position = First ? new cc.Vec3(0, 0) : new cc.Vec3(-960, 0);
        backgroundNode.scaleX = this.dir;
        this.node.addChild(backgroundNode);
        const duration = First ? this.moveDistance / this.moveSpeed / 2 : this.moveDistance / this.moveSpeed;
        const moveAction = cc.sequence(
            cc.moveTo(duration, cc.v2(this.moveEndX, 0)),
            cc.callFunc(() => {
                backgroundNode.removeFromParent();
                this.backgroundNodes.splice(this.backgroundNodes.indexOf(backgroundNode), 1);
            })
        );
        backgroundNode.runAction(moveAction);
        this.backgroundNodes.push(backgroundNode);
        this.dir *= -1;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
