import AudioManager from "../AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MusicSlider extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        // change progress to current music volum
        //this.getComponent(cc.Slider).progress = AudioManager.getInstance().getMusicVolume();

        this.node.on("slide", this.onSlide, this);
    }

    start () {

    }

    // update (dt) {}

    onSlide(slider: cc.Slider){
        console.log(slider.progress);
        //AudioManager.getInstance().setMusicVolume(slider.progress);
    }
}
