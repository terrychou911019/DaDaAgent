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
    Tiktok1,
    Eagle,
    Thunder
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

    @property(cc.AudioClip)
    titleBGM: cc.AudioClip = null;

    @property(cc.AudioClip)
    gameWinBGM: cc.AudioClip = null;

    @property(cc.AudioClip)
    gameOverBGM: cc.AudioClip = null;

    @property(cc.AudioClip)
    selectBGM: cc.AudioClip = null;

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
        this.playTitleBGM();
    }

    // update(dt) {
    //     Your update logic here
    // }

    stopBGM() {
        cc.audioEngine.stopMusic();
    }

    playTitleBGM() {
        cc.audioEngine.playMusic(this.titleBGM, true);
    }

    playGameWinBGM() {
        cc.audioEngine.playMusic(this.gameWinBGM, true);
    }

    playGameOverBGM() {
        cc.audioEngine.playMusic(this.gameOverBGM, true);
    }

    playSelectBGM() {
        cc.audioEngine.playMusic(this.selectBGM, true);
    }

    playGameBGM(){
        cc.audioEngine.playMusic(this.audioClips[AudioType.Tiktok1], true);
    }

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
