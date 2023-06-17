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
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    private backgroundPrefab: cc.Prefab = null;

    @property(cc.Node)
    private currentUI: cc.Node = null;

    @property(cc.EditBox)
    private loginEmail: cc.EditBox = null;

    @property(cc.EditBox)
    private loginPassword: cc.EditBox = null;

    @property(cc.EditBox)
    private signupUsername: cc.EditBox = null;

    @property(cc.EditBox)
    private signupEmail: cc.EditBox = null;

    @property(cc.EditBox)
    private signupPassword: cc.EditBox = null;



    private backgroundNodes: cc.Node[] = [];

    private moveSpeed: number = 80;

    private moveStartX: number = 960;

    private moveEndX = -960;

    private moveDistance = 1920;

    private dir = 1;

    private mask: cc.Node = null;

    

    repeatSpawn(){
        this.spawnBackground(false);
    }

    spawnBackground(First: boolean) {
        const backgroundNode = cc.instantiate(this.backgroundPrefab);
        backgroundNode.position = First ? new cc.Vec3(0, 0) : new cc.Vec3(this.moveStartX, 0);
        backgroundNode.scaleX = this.dir;
        this.node.addChild(backgroundNode);
        const duration = First ? this.moveDistance / this.moveSpeed / 2 : this.moveDistance / this.moveSpeed;
        const moveAction = cc.sequence(
            cc.moveTo(duration, cc.v2(this.moveEndX, 0)),
            cc.callFunc(() => {
                backgroundNode.removeFromParent();
                this.backgroundNodes.splice(this.backgroundNodes.indexOf(backgroundNode), 1);
            })
        );
        backgroundNode.runAction(moveAction);
        this.backgroundNodes.push(backgroundNode);
        this.dir *= -1;
    }
    onKeyDown(e: cc.Event.EventKeyboard){
        switch (e.keyCode) {
            case cc.macro.KEY.enter:
                if (this.currentUI.name === "Label") {
                    this.changeChoose();
                }
                break
            default:
                break;
        }    
    }
    changeChoose(){
        console.log("change state")
        const buttonArea = cc.find('Canvas/button_area');
        const curUI = this.currentUI;
        this.currentUI = buttonArea;
        const labelAction = cc.sequence(
            cc.moveTo(0.5, cc.v2(this.moveEndX, curUI.position.y)),
            cc.delayTime(1)
        )
        buttonArea.setPosition(this.moveStartX, 0);
        const chooseUIAction = cc.sequence(
            cc.moveTo(0.5, cc.v2(0, 0)),
            cc.delayTime(1)
        )
        curUI.runAction(labelAction);
        buttonArea.runAction(chooseUIAction);
    }

    returnChoose(){
        console.log("return to change state")
        const buttonArea = cc.find('Canvas/button_area');
        const curUI = this.currentUI;
        this.currentUI = buttonArea;
        const labelAction = cc.sequence(
            cc.moveTo(0.5, cc.v2(this.moveStartX, curUI.position.y)),
            cc.delayTime(1)
        )
        buttonArea.setPosition(this.moveEndX, 0);
        const chooseUIAction = cc.sequence(
            cc.moveTo(0.5, cc.v2(0, 0)),
            cc.delayTime(1)
        )
        curUI.runAction(labelAction);
        buttonArea.runAction(chooseUIAction);
    }

    changeLogin(){
        console.log('change to login');
        const loginUI = cc.find('Canvas/loginUI');
        const curUI = this.currentUI;
        this.currentUI = loginUI;
        const labelAction = cc.sequence(//move out
            cc.moveTo(0.5, cc.v2(this.moveEndX,curUI.position.y)),
            cc.delayTime(1)
        )
        loginUI.setPosition(this.moveStartX, 0);
        const loginUIAction = cc.sequence(//move in
            cc.moveTo(0.5, cc.v2(0, 0)),
            cc.delayTime(1)
        )
        curUI.runAction(labelAction);
        loginUI.runAction(loginUIAction);
    }

    changeSignup(){
        console.log('change to signup');
        const signupUI = cc.find('Canvas/signupUI');
        const curUI = this.currentUI;
        this.currentUI = signupUI;
        const labelAction = cc.sequence(
            cc.moveTo(0.5, cc.v2(this.moveEndX,curUI.position.y)),
            cc.delayTime(1)
        )
        signupUI.setPosition(this.moveStartX, 0);
        const loginUIAction = cc.sequence(
            cc.moveTo(0.5, cc.v2(0, 0)),
            cc.delayTime(1)
        )
        curUI.runAction(labelAction);
        signupUI.runAction(loginUIAction);
    }

    clickLoginInBtn(){
        const email = this.loginEmail.string;
        const password = this.loginPassword.string;
        if (!email||!password) {
            console.log("Should enter the password and email")
            return;
        }
        this.logIn(email, password);
    }

    async logIn(email:string, password:string){
        let userInfo = await firebase.auth().signInWithEmailAndPassword(email, password);
        await firebase.database().ref(userInfo.user.uid).once('value', (snapshot)=>{
            const userdata = snapshot.val();
            const jsonStr = JSON.stringify(userdata);
            cc.sys.localStorage.setItem('userdata', jsonStr);
            // turn jsonStr back to userdata
            // const jsonStr = cc.sys.localStorage.getItem('userdata');
            // const data = JSON.parse(jsonStr);
        }).then(()=>{
            console.log("login successful")
            this.changeScene();
        }).catch((e)=>{
            console.log(e);
        })
    }

    clickSignUpBtn(){
        const username = this.signupUsername.string;
        const email = this.signupEmail.string;
        const password = this.signupPassword.string;
        if (!username||!email||!password) {
            console.log("username or email or password haven't enter")
            return;
        }
        this.signUp(username, email, password);
    }

    async signUp(username, email, password){
        let userInfo = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await firebase.database().ref(userInfo.user.uid).set({
            id:userInfo.user.uid,
            username:username, 
        }).then(()=>{
            console.log("signup successful")
            this.changeScene();
        }).catch((e)=>{
            console.log(e);
        })
    }

    //google login
    async loginwithGoogle(){
        const provider = new firebase.auth.GoogleAuthProvider();
        try{
            const credential = await firebase.auth().signInWithPopup(provider);
            const user = credential.user;
            await firebase.database().ref(user.uid).once('value', (snapshot)=>{
                const userdata = snapshot.val();
                if (userdata === null) {
                    firebase.database().ref(user.uid).set({
                        id:user.uid,
                        username:user.displayName, 
                    }).then(()=>{
                        console.log("login with google successfully")
                    }).catch((e)=>{
                        console.log(e);
                    })
                } else {
                    const jsonStr = JSON.stringify(userdata);
                    cc.sys.localStorage.setItem('userdata', jsonStr);
                }
            }, this.changeScene)
        }catch(error) {
            console.log(error);
        }
    }

    //change to CCAW(choose character and weapon)
    changeScene(){
        this.mask.runAction(cc.sequence(
            cc.fadeTo(1.5, 255), 
            cc.callFunc(() => {
                cc.director.loadScene('CCAW');
            })
        ));
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //handle the background
        this.spawnBackground(true);
        this.spawnBackground(false);
        const spawnInterval = cc.winSize.width / this.moveSpeed - 0.05;
        this.schedule(this.repeatSpawn, spawnInterval);
        //detect the keyboard
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //Mask
        this.mask = cc.find('Canvas/Mask');
        console.log(this.mask)
        this.mask.opacity = 0;
        this.mask.color = cc.Color.BLACK;
    }

    start () {

    }

    // update (dt) {}
}
