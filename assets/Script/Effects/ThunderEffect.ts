const {ccclass, property} = cc._decorator;

@ccclass
export default class ThunderEffect extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // random rotate 45 ~ -45 degree
        // let randomRotate = Math.random() * 90 - 45;
        // this.node.angle = -randomRotate;

        // random scaleX 0.5 ~ 1.5
        // let randomScaleX = Math.random() + 0.5;
        // this.node.scaleX = randomScaleX;

        // random opacity 0.5 ~ 1
        // let randomOpacity = Math.random() + 0.5;
        // this.node.opacity = randomOpacity * 255;

        // random skewX 0 ~ 30
        // let randomSkewX = Math.random() * 30;
        // this.node.skewX = randomSkewX;

        // tiny adjust position randomly
        /*let randomAdjustX = Math.random() * 10 - 5;
        let randomAdjustY = Math.random() * 10 - 5;
        this.node.x += randomAdjustX;
        this.node.y += randomAdjustY;*/
        const animation = this.node.getComponent(cc.Animation);
        const randomIndex = Math.floor(Math.random() * 3);
        const animationName = 'thunderEffect' + randomIndex.toString();
        animation.play(animationName); 
        
        // destroy this node after x second
        this.scheduleOnce(function() {
            this.node.destroy();
        }
        , 0.2);
    }

    //gameTick (dt) {
    //
    //}
}
