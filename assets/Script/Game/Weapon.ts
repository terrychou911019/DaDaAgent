import AudioManager, { AudioType } from "../AudioManager";
import ParticleManager from "../ParticleManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Weapon extends cc.Component {
    @property(cc.String)
    weaponName: string = '';

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    @property(cc.Node)
    skillManager: cc.Node = null;

    Camera: cc.Node = null;
    Player: cc.Node = null;
    BulletNode: cc.Node = null;

    ATTACT_SPEED_SEC: number = 0;
    RELOAD_TIME_SEC: number = 0;
    DAMAGE: number = 0;
    CAPACITY: number = 0;
    MoveSpeed: number = 0;
    AngularSpeed: number = 0;

    weaponImg: cc.SpriteFrame = null;
    bulletImg: cc.SpriteFrame = null;
    bulletImgWidth: number = 0;

    bulletNum: number = 0;
    attactCD: number = 0;
    reloadCD: number = 0;
    isShoot: boolean = false;
    isReload: boolean = false;

    direction: number[] = [0, 0];
    rotateAngle: number = 0;

    reload(dt) {
        this.reloadCD -= dt;
        this.BulletNode.getChildByName("LoadingBar").width = 20 * this.reloadCD / this.RELOAD_TIME_SEC;
        if (this.reloadCD <= 0) {
            this.bulletNum = this.CAPACITY;
            this.reloadCD = this.RELOAD_TIME_SEC;
            this.isReload = false;

            this.BulletNode.getComponent(cc.Label).string = `${this.bulletNum}`;
            this.BulletNode.getChildByName("LoadingBar").width = 0;
            console.log('reload finish')
        }
    }

    shoot(dt) {
        if (this.attactCD > 0) {
            this.attactCD -= dt;
            return;
        }

        if (this.bulletNum <= 0) {
            if (!this.isReload) {
                this.reloadCD = this.RELOAD_TIME_SEC;
                this.BulletNode.getChildByName("LoadingBar").width = 25;
                this.isReload = true;
            }
            return;
        }
        
        console.log('shoot')

        if(this.skillManager.getComponent('SkillManager').skillMap['StrongBullet'] == true){
            this.Camera.getComponent('MainCamera').setShakeMagnitude(2);

            //AudioManager.getInstance().playSoundEffect(AudioType.StrongBullet);
        }
        
        this.createBullet(0);

        if(this.skillManager.getComponent('SkillManager').skillMap['Multishot'] == true){
            this.createBullet(10);
            this.createBullet(-10);
        }
        
        // decrease bullet number and set 
        this.attactCD = this.ATTACT_SPEED_SEC;
        this.bulletNum -= 1;

        // render bullet number
        this.BulletNode.getComponent(cc.Label).string = `${this.bulletNum}`;
        this.BulletNode.getChildByName("LoadingBar").width = 0;

        // play sound effect
        //AudioManager.getInstance().playSoundEffect(AudioType.LaserShoot);
    }

    createBullet(adjustAngle: number) {
        let bullet = cc.instantiate(this.bulletPrefab);
        bullet.width = 16 * this.bulletImgWidth / 512;  // 168 is the width of the bullet image, 512 is the height of the bullet image
        if (this.Player.scaleX === 1)
            bullet.position = cc.v3(this.Player.position.x + 16, this.Player.position.y + 16, 0);
        else
            bullet.position = cc.v3(this.Player.position.x - 16, this.Player.position.y + 16, 0);

        bullet.getComponent(cc.Sprite).spriteFrame = this.bulletImg;
        bullet.getComponent(cc.Sprite).node.angle = this.rotateAngle - 90 + adjustAngle;
        bullet.getComponent(cc.RigidBody).angularVelocity = this.AngularSpeed;

        let bulletNode = bullet.getComponent('Bullet');
        bulletNode.damage = this.DAMAGE;
        bulletNode.moveSpeed = this.MoveSpeed;

        // adjust directoin according to the adjustangle
        let radian = (this.rotateAngle + adjustAngle) * Math.PI / 180;
        bulletNode.direction = [Math.cos(radian), Math.sin(radian)];
        cc.find("Canvas/Game/BulletGroup").addChild(bullet);
    }


    onMouseDown(event: cc.Event.EventMouse) {   // Check if can shoot
        let button = event.getButton();
        if (button !== cc.Event.EventMouse.BUTTON_LEFT || this.isShoot) 
            return;

        this.shoot(0);
        this.isShoot = true;
        if (this.bulletNum !== 0)
            this.isReload = false;
    }
    onMouseUp(event: cc.Event.EventMouse) {     // Once the mouse is up, reload the weapon
        let button = event.getButton();
        if (button !== cc.Event.EventMouse.BUTTON_LEFT)
            return;

        this.isShoot = false;
        if (this.bulletNum !== 0) {
            this.reloadCD = this.RELOAD_TIME_SEC;
            this.isReload = true;
        }
    }
    onMouseMove(event: cc.Event.EventMouse) {   // Get the angle of mouse and rotate the weapon SpriteFrame
        let mousePos = [];
        if (this.Player.scaleX === 1)
            mousePos = [event.getLocationX() - 480 - 16, event.getLocationY() - 320 - 16];
        else 
            mousePos = [event.getLocationX() - 480 + 16, event.getLocationY() - 320 - 16];
        // get the position based on the x and y axis
        // then minus the width/height of the scene and its coodinate based on player
        
        let distance = Math.sqrt(mousePos[0] * mousePos[0] + mousePos[1] * mousePos[1]);
        this.direction = [mousePos[0] / distance, mousePos[1] / distance];
        this.rotateAngle = Math.atan2(this.direction[1], this.direction[0]) * 180 / Math.PI;    // get the angle
        if (this.rotateAngle < 0)
            this.rotateAngle += 360;    // turn the range from [-180, 180] to [0, 360]

        if (this.Player.scaleX === 1)
            this.getComponent(cc.Sprite).node.angle = this.rotateAngle - 90;
        else 
            this.getComponent(cc.Sprite).node.angle = -this.rotateAngle + 90;
    }

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.Camera = cc.find("Canvas/Main Camera");
        this.Player = cc.find("Canvas/Player");
        this.BulletNode = cc.find("Canvas/Player/BulletNum");
        
        this.Camera.on('mousedown', this.onMouseDown, this);
        this.Camera.on('mouseup', this.onMouseUp, this);
        this.Camera.on('mousemove', this.onMouseMove, this);

        switch (this.weaponName) {
            case 'Bow':
                cc.resources.load("weapon/bow", cc.SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        cc.error(err.message || err);
                        return;
                    }

                    // Showing error is right, the code in cocos' document is same as the code below
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });

                cc.resources.load("weapon/arrow", cc.SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        cc.error(err.message || err);
                        return;
                    }
                    this.getComponent('Weapon').bulletImg = spriteFrame;
                });
                this.bulletImgWidth = 168;
                this.bulletNum = this.CAPACITY = 8;
                this.ATTACT_SPEED_SEC = 0.25;
                this.reloadCD = this.RELOAD_TIME_SEC = 0.5;
                this.DAMAGE = 20;
                this.MoveSpeed = 500;
                break;

            case 'Shuriken':
                cc.resources.load("weapon/shuriken", cc.SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        cc.error(err.message || err);
                        return;
                    }

                    // Showing error is right, the code in cocos' document is same as the code below
                    this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    this.getComponent('Weapon').bulletImg = spriteFrame;
                });
                this.bulletImgWidth = 512;
                this.bulletNum = this.CAPACITY = 16;
                this.ATTACT_SPEED_SEC = 0.125;
                this.reloadCD = this.RELOAD_TIME_SEC = 0.25;
                this.DAMAGE = 10;
                this.MoveSpeed = 300;
                this.AngularSpeed = Math.PI * 2 * 125;  // 12.5 rounds per second
                break;
        }
        
        

        this.BulletNode.getComponent(cc.Label).string = `${this.bulletNum}`;
    }
    onDestroy() {
        this.Camera.off('mousedown', this.onMouseDown, this);
        this.Camera.off('mouseup', this.onMouseUp, this);
        this.Camera.off('mousemove', this.onMouseMove, this);
    }
    
    gameTick (dt) {
        if (this.isShoot)
            this.shoot(dt);

        if (this.Player.scaleX === 1)
            this.BulletNode.scaleX = 1;
        else
            this.BulletNode.scaleX = -1;

        if (this.isReload) 
            this.reload(dt);
    }    
}
// start () {}
