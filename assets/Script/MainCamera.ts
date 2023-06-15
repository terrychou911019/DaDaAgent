const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {
    @property(cc.Node)
    private target: cc.Node = null;

    @property(cc.Vec2)
    private offset: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Float)
    private smoothTime: number = 0.3;

    private velocity: cc.Vec2 = cc.Vec2.ZERO;

    private shakeMagnitude: number = 0;

    gameTick(dt) {
        this.smoothFollow();
        this.shake();
    }

    smoothFollow() {
        let targetPos = this.target.position.add(this.offset);
        let smoothPos = cc.Vec2.ZERO;
        smoothPos.x = cc.misc.lerp(this.node.position.x, targetPos.x, this.smoothTime);
        smoothPos.y = cc.misc.lerp(this.node.position.y, targetPos.y, this.smoothTime);
        this.node.position = smoothPos;
    }

    shake(){
        let shakeX = Math.random() < 0.5 ? -1 : 1;
        let shakeY = Math.random() < 0.5 ? -1 : 1;

        this.node.x += shakeX * this.shakeMagnitude;
        this.node.y += shakeY * this.shakeMagnitude;

        if(this.shakeMagnitude > 0){
            this.shakeMagnitude -= 0.3;
        }
        else{
            this.shakeMagnitude = 0;
        }
    }

    setShakeMagnitude(shakeMagnitude: number){
        this.shakeMagnitude = shakeMagnitude;
    }
}
