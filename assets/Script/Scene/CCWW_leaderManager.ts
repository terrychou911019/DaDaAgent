// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import type firebase from '../firebase';
declare const firebase: any;
@ccclass
export default class LDButton extends cc.Component {

    @property(cc.Node)
    private first: cc.Node = null;

    @property(cc.Node)
    private second: cc.Node = null;

    @property(cc.Node)
    private third: cc.Node = null;

    private leaderboardData = null;

    async getData(){
        try {
            let data;
            await firebase.database().ref('leaderboard').once('value', (snapshot) => {
                data = snapshot.val()
            })
            console.log(data);
            this.leaderboardData = Object.keys(data).map((key) => {
                return [key, data[key].score];
            })
            this.leaderboardData.sort((first, second) => {
                return second[1] - first[1]
            })
            console.log(this.leaderboardData);
        } catch (error) {
            console.log(error);
        }
        this.setLeaderboard();
    }

    async setLeaderboard(){
        if (!this.leaderboardData) {
            console.log("leaderboard miss");
            return;
        }
        if (this.leaderboardData.length >= 1) {
            console.log('get first player');
            this.first.opacity = 255;
            await firebase.database().ref('users/' + this.leaderboardData[0][0]).once('value', (snapshot) => {
                let data = snapshot.val();
                this.setScoreAndName(0, data.username, this.leaderboardData[0][1], data.character);
            })
        }
        if (this.leaderboardData.length >= 2) {
            console.log('get second player');
            this.second.opacity = 255;
            await firebase.database().ref('users/' + this.leaderboardData[1][0]).once('value', (snapshot) => {
                let data = snapshot.val();
                this.setScoreAndName(1, data.username, this.leaderboardData[1][1], data.character);
            })
        }
        if (this.leaderboardData.length >= 3) {
            console.log('get third player');
            this.third.opacity = 255;
            await firebase.database().ref('users/' + this.leaderboardData[2][0]).once('value', (snapshot) => {
                let data = snapshot.val();
                this.setScoreAndName(2, data.username, this.leaderboardData[2][1], data.character);
            })
        }
    }

    setScoreAndName(n: number, name: string, score: number, character: string){
        if (n === 0) {
            this.first.getChildByName('score').getComponent(cc.Label).string = score.toString();
            this.first.getChildByName('name').getComponent(cc.Label).string = name;
            let characterNode = this.first.getChildByName('character');
            characterNode.getComponent(cc.Animation).play(character + '_idle');
        } else if (n === 1){
            this.second.getChildByName('score').getComponent(cc.Label).string = score.toString();
            this.second.getChildByName('name').getComponent(cc.Label).string = name;
            let characterNode = this.second.getChildByName('character');
            characterNode.getComponent(cc.Animation).play(character + '_idle');
        } else if (n === 2){

            this.third.getChildByName('score').getComponent(cc.Label).string = score.toString();
            this.third.getChildByName('name').getComponent(cc.Label).string = name;
            let characterNode = this.third.getChildByName('character');
            characterNode.getComponent(cc.Animation).play(character + '_idle');
        }
    }
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.first.opacity = 0;
        this.second.opacity = 0;
        this.third.opacity = 0;
        this.getData();
    }

    start () {

    }

    // update (dt) {}
}


