const { ccclass, property } = cc._decorator;

@ccclass
export default class WeaponSpin extends cc.Component {
    @property(cc.Prefab)
    wheelPrefab: cc.Prefab = null;

    @property(Number)
    radius: number = 100; // Adjust the radius as desired

    @property(Number)
    spinSpeed: number = 10; // Adjust the rotation speed in degrees per second

    @property(cc.Node)
    player: cc.Node = null;

    private wheels: cc.Node[] = [];

    start() {
        this.createWheels(4);
        this.setWheelsPosition();
    }

    createWheels(cnt) {
        for (let i = 0; i < cnt; i++) {
            let wheel = cc.instantiate(this.wheelPrefab);
            this.node.addChild(wheel, 1, "wheel");
            this.wheels.push(wheel);
        }
    }

    setWheelsPosition() {
        const angle = 360 / this.wheels.length;
        for (let i = 0; i < this.wheels.length; i++) {
            const child = this.wheels[i];
            const radian = cc.misc.degreesToRadians(angle * i);
            child.x = this.radius * Math.cos(radian);
            child.y = this.radius * Math.sin(radian);
        }
    }

    rotateWheels(dt) {
        const deltaAngle = this.spinSpeed * dt;

        for (let i = 0; i < this.wheels.length; i++) {
            const child = this.wheels[i];
            const radian = cc.misc.degreesToRadians(deltaAngle);
            const rotatedPos = cc.v2(child.x, child.y).rotate(radian);
            child.x = rotatedPos.x;
            child.y = rotatedPos.y;
        }
    }

    gameTick(dt) {
        this.followPlayer();
        this.rotateWheels(dt);
    }

    followPlayer() {
        this.node.x = this.player.x;
        this.node.y = this.player.y;
    }
}
