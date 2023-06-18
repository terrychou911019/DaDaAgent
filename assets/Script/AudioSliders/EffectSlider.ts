import AudioManager from "../AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EffectSlider extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        //this.getComponent(cc.Slider).progress = AudioManager.getInstance().getEffectsVolume();

        this.node.on("slide", this.onSlide, this);
    }

    start () {

    }

    // update (dt) {}

    onSlide(slider: cc.Slider){
        console.log(slider.progress);
        //AudioManager.getInstance().setEffectsVolume(slider.progress);
    }
}
