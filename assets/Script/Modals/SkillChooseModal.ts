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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.skillManager = cc.find('Canvas/SkillManager').getComponent('SkillManager');
        this.gameManager = cc.find('Canvas/GameManager').getComponent('GameManager');

        const availableSkills = this.skillManager.getAvailableSkills();
        // shuffle available skills
        availableSkills.sort(() => Math.random() - 0.5);

        for(let i = 0; i < 3; i++){
            if(availableSkills[i] == 'Thunder'){
                const thunder = cc.instantiate(this.skillThunder);
                thunder.parent = this.node;
                // load a click event listener
                thunder.on(cc.Node.EventType.MOUSE_DOWN, () => {
                    this.skillManager.chooseSkill('Thunder');
                    this.gameManager.resumeGame();
                    this.node.parent.getComponent('ModalManager').hideAll();
                });
            }
            else if(availableSkills[i] == 'StrongBullet'){
                const strongBullet = cc.instantiate(this.skillStrongBullet);
                strongBullet.parent = this.node;
                // load a click event listener
                strongBullet.on(cc.Node.EventType.MOUSE_DOWN, () => {
                    this.skillManager.chooseSkill('StrongBullet');
                    this.gameManager.resumeGame();
                    this.node.parent.getComponent('ModalManager').hideAll();
                });
            }
            else if(availableSkills[i] == 'LightBullet'){
                const lightBullet = cc.instantiate(this.skillLightBullet);
                lightBullet.parent = this.node;
                // load a click event listener
                lightBullet.on(cc.Node.EventType.MOUSE_DOWN, () => {
                    this.skillManager.chooseSkill('LightBullet');
                    this.gameManager.resumeGame();
                    this.node.parent.getComponent('ModalManager').hideAll();
                });
            }
        }

        // how many children in this node
        //console.log(this.node.childrenCount);
        if(this.node.childrenCount == 0){
            this.gameManager.resumeGame();
            this.node.parent.getComponent('ModalManager').hideAll();
            console.log('no skill available');
        }
        else if(this.node.childrenCount == 1){
            // nothing
        }
        else if(this.node.childrenCount == 2){
            // adjust children position
            this.node.children[0].x -= 100;
            this.node.children[1].x += 100;
        }
        else if(this.node.childrenCount == 3){
            // adjust children position
            this.node.children[0].x -= 200;
            this.node.children[1].x += 0;
            this.node.children[2].x += 200;
        }
        
    }

    // update (dt) {}
}
