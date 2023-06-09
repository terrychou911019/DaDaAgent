// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

enum State{
    Title,
    Choose, 
    SignIn,
    LogIn,
    Google,
}

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    private backgroundPrefab: cc.Prefab = null;

    private backgroundNodes: cc.Node[] = [];

    private moveSpeed: number = 80;

    private moveStartX: number = 960;

    private moveEndX = -960;

    private moveDistance = 1920;

    private curState: State = State.Title;

    private dir = 1;

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
                this.changeState(State.Choose);
                break
            default:
                break;
        }    
    }

    changeState(S: State){
        this.curState = S;
        switch (S) {
            case State.Choose:
                this.changeChoose();
                break;
        
            default:
                break;
        }
    }
    changeChoose(){
        const label = cc.find('Canvas/Label2');
        const buttonArea = cc.find('Canvas/button_area');
        cc.log(label);
        const labelAction = cc.sequence(
            cc.moveTo(0.5, cc.v2(this.moveEndX, -140)),
            cc.delayTime(1)
        )
        const chooseUIAction = cc.sequence(
            cc.moveTo(0.1, cc.v2(this.moveStartX, -120)),
            cc.moveTo(0.5
                
                , cc.v2(0, -130))
        )
        label.runAction(labelAction);
        buttonArea.runAction(chooseUIAction);
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
    }

    start () {

    }

    // update (dt) {}
}
