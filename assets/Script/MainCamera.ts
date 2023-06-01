const { ccclass, property } = cc._decorator;

@ccclass
export class CameraFollow extends cc.Component {
    @property(cc.Node)
    private target: cc.Node = null;

    @property(cc.Vec2)
    private offset: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Float)
    private smoothTime: number = 0.3;

    private velocity: cc.Vec2 = cc.Vec2.ZERO;

    lateUpdate() {
        if (this.target) {
            const targetPosition = this.target.position.add(this.offset);
            //const currentPosition = this.node.position;
            //const smoothPosition = cc.Vec2.lerp(currentPosition, targetPosition, this.smoothTime);

            this.node.position = targetPosition;
        }

        //console.log("camera ", this.node.position.x, this.node.position.y);
    }
}
