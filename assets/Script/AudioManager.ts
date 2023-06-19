const { ccclass, property } = cc._decorator;

export enum AudioType {
    ChooseSkill,
    Dash,
    Explosion,
    FlameWalk,
    Frozen,
    Ice,
    LaserShoot,
    LevelUp,
    LightBullet,
    Select,
    StrongBullet,
    Tiktok1
}

@ccclass
export default class AudioManager extends cc.Component {
    // Singleton instance
    private static instance: AudioManager = null;

    // Returns the singleton instance
    public static getInstance(): AudioManager {
        return AudioManager.instance;
    }

    @property([cc.AudioClip])
    audioClips: [cc.AudioClip] = [null];
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // Ensure only one instance exists
        if (AudioManager.instance && AudioManager.instance !== this) {
            this.node.destroy(); // Destroy duplicate instance
            return;
        }

        AudioManager.instance = this;
        cc.game.addPersistRootNode(this.node); // Make the AudioManager node persist between scenes
        
        cc.resources.loadDir("Audios", cc.AudioClip);
    }

    start() {
        // Your start logic here
        this.playBGM(AudioType.Tiktok1);
    }

    // update(dt) {
    //     Your update logic here
    // }

    playSoundEffect(type: AudioType) {
        cc.audioEngine.playEffect(this.audioClips[type], false);
    }

    playBGM(type: AudioType) {
        cc.audioEngine.playMusic(this.audioClips[type], true);
    }

    pauseAll(){
        cc.audioEngine.pauseAll();
    }

    resumeAll(){
        cc.audioEngine.resumeAll();
    }

    setEffectsVolume(volume: number){
        cc.audioEngine.setEffectsVolume(volume);
    }

    setMusicVolume(volume: number){
        cc.audioEngine.setMusicVolume(volume);
    }

    getEffectsVolume(){
        return cc.audioEngine.getEffectsVolume();
    }

    getMusicVolume(){
        return cc.audioEngine.getMusicVolume();
    }
}
