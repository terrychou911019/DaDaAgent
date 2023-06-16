const { ccclass, property } = cc._decorator;

@ccclass
export default class SkillManager extends cc.Component {
    @property([cc.String])
    skillNames = [];

    skillMap = {};

    chosenSkills = [];

    onLoad() {
        this.initializeSkillMap();
    }

    initializeSkillMap() {
        // Initialize the skill map with all skills set to false
        for (const skillName of this.skillNames) {
            this.skillMap[skillName] = false;
        }
    }

    getAvailableSkills() {
        // Return the skills that are not chosen yet
        const availableSkills = [];
        for (const skillName in this.skillMap) {
            if (!this.skillMap[skillName]) {
                availableSkills.push(skillName);
            }
        }
        return availableSkills;
    }

    chooseSkill(skillName) {
        // Choose a skill and set it to true in the skill map
        if (this.skillMap.hasOwnProperty(skillName)) {
            this.skillMap[skillName] = true;
            this.chosenSkills.push(skillName);
        }
    }

    // ... (Other lifecycle callbacks and methods)
}
