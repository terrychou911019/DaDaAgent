import AudioManager, { AudioType } from "../AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillChooseModal extends cc.Component {
    skillManager = null;
    gameManager = null;

    @property(cc.Prefab)
    skillThunder: cc.Prefab = null;

    @property(cc.Prefab)
    skillStrongBullet: cc.Prefab = null;

    @property(cc.Prefab)
    skillLightBullet: cc.Prefab = null;

    @property(cc.Prefab)
    skillIce: cc.Prefab = null;

    @property(cc.Prefab)
    skillFlameWalk: cc.Prefab = null;

    @property(cc.Prefab)
    skillFrozen: cc.Prefab = null;

    @property(cc.Prefab)
    skillMultishot: cc.Prefab = null;

    @property(cc.Prefab)
    skillSpinAtk: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.skillManager = cc.find('Canvas/SkillManager').getComponent('SkillManager');
        this.gameManager = cc.find('Canvas/GameManager').getComponent('GameManager');

        const availableSkills = this.skillManager.getAvailableSkills();
        // shuffle available skills
        availableSkills.sort(() => Math.random() - 0.5);

        for(let i = 0; i < 3; i++) {
            // console.log(availableSkills[i])
            if (availableSkills[i] === undefined) 
                break;

            let skill = null;
            switch (availableSkills[i]) {
                case 'Thunder':
                    skill = cc.instantiate(this.skillThunder);
                    break;

                case 'StrongBullet':
                    skill = cc.instantiate(this.skillStrongBullet);
                    break;

                case 'LightBullet':
                    skill = cc.instantiate(this.skillLightBullet);
                    break;

                case 'Ice':
                    skill = cc.instantiate(this.skillIce);
                    break;

                case 'FlameWalk':
                    skill = cc.instantiate(this.skillFlameWalk);
                    break;

                case 'Frozen':
                    skill = cc.instantiate(this.skillFrozen);
                    break;

                case 'Multishot':
                    skill = cc.instantiate(this.skillMultishot);
                    break;

                case 'SpinAtk':
                    skill = cc.instantiate(this.skillSpinAtk);
                    break;
                    
                default:    break;
            }
            skill.parent = this.node;

            // load a click event listener
            skill.on(cc.Node.EventType.MOUSE_DOWN, () => {
                this.skillManager.chooseSkill(availableSkills[i]);
                this.gameManager.resumeGame();
                this.node.parent.getComponent('ModalManager').hideAll();

                AudioManager.getInstance().playSoundEffect(AudioType.LevelUp);
            });
        }

        // how many children in this node
        // console.log(this.node.childrenCount);
        if(this.node.childrenCount == 1){
            this.gameManager.resumeGame();
            this.node.parent.getComponent('ModalManager').hideAll();
            console.log('no skill available');
        }
        else if(this.node.childrenCount == 2){
            // nothing
            this.node.children[1].y -= 20;
        }
        else if(this.node.childrenCount == 3){
            // adjust children position
            this.node.children[1].x -= 80;
            this.node.children[2].x += 80;
            this.node.children[1].y -= 20;
            this.node.children[2].y -= 20;
        }
        else if(this.node.childrenCount == 4){
            // adjust children position
            this.node.children[1].x -= 160;
            this.node.children[2].x += 0;
            this.node.children[3].x += 160;
            this.node.children[1].y -= 20;
            this.node.children[2].y -= 20;
            this.node.children[3].y -= 20;
        }
        
    }

    // update (dt) {}
}
