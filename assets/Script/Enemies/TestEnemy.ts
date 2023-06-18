import lifebar from '../Game/Lifebar'
import expManager from '../EXPManager'
import ScoreManager from '../ScoreManager'

const { ccclass, property } = cc._decorator

@ccclass
export default class TestEnemy extends cc.Component {
  isFrozen: boolean = false

  // LIFE-CYCLE CALLBACKS:

  @property(cc.Node)
  player: cc.Node = null

  @property(lifebar)
  playerLife: lifebar = null

  @property(Number)
  moveSpeed: number = 50

  @property(expManager)
  ExpManager: expManager = null

  @property(ScoreManager)
  scoreManager: ScoreManager = null

  private isColliding: boolean = false
  private collisionTimer: number = 0
  private collisionDuration: number = 1 // 碰撞後移動的持續時間
  private minRoamingDistance: number = 2 // 最小漫遊距離
  private maxRoamingDistance: number = 5 // 最大漫遊距離
  private randomDistance: number = 0 // 隨機漫遊距離
  private EnemyManager = null
  private gameManager = null

  private enemyHealth: number = 100
  private isDead: boolean = false

  private anim: cc.Animation = null

  private rigidbody: cc.RigidBody = null
  private collider: cc.PhysicsBoxCollider = null

  onLoad() {
    cc.director.getPhysicsManager().enabled = true
    cc.director.getCollisionManager().enabled = true
    this.player = cc.find('Canvas/Player')
    this.playerLife = cc.find('Canvas/Player/lifebar').getComponent(lifebar)
    this.gameManager = cc.find('Canvas/GameManager').getComponent('GameManager')
    this.anim = this.getComponent(cc.Animation)
    this.rigidbody = this.getComponent(cc.RigidBody)
    this.collider = this.getComponent(cc.PhysicsBoxCollider)
    this.ExpManager = cc.find('Canvas/EXPManager').getComponent('EXPManager')
    this.scoreManager = cc
      .find('Canvas/ScoreManager')
      .getComponent('ScoreManager')
  }

  start() {
    this.isFrozen = false
  }

  deadEffect() {
    this.moveSpeed = 0
  }

  update(dt) {
    //cc.log(this.playerLife.cur_life)
    if (this.gameManager.isGamePaused) {
      return
    }

    if (this.enemyHealth <= 0) {
      this.isDead = true
      this.rigidbody.enabledContactListener = false
      this.collider.enabled = false
      this.anim.stop()
      let fade = cc.fadeOut(1)
      let finish = cc.callFunc(() => {
        this.EnemyManager.put(this.node)
      })
      this.node.runAction(cc.sequence(fade, finish))
      this.EnemyManager.put(this.node)
    }
    if (this.isFrozen == true) {
      return
    }

    //this.node.x += 40 * dt;

    if (!this.isDead) {
      // chase player's position
      let playerPos = this.player.position
      let enemyPos = this.node.position
      let direction = playerPos.sub(enemyPos)
      let normalizedDirection = direction.normalize()
      this.node.position = enemyPos.add(
        normalizedDirection.mul(this.moveSpeed * dt),
      )

      // change enemy facing direction for x and -x
      if (this.node.x > this.player.x) {
        this.node.scaleX = -1
      } else {
        this.node.scaleX = 1
      }

      // move enemy randomly when they collide
      if (this.isColliding) {
        this.collisionTimer += dt
        if (this.collisionTimer >= this.collisionDuration) {
          this.isColliding = false
          this.collisionTimer = 0
        } else {
          this.randomDistance = this.randomIntFromInterval(
            this.minRoamingDistance,
            this.maxRoamingDistance,
          )
          this.node.position = this.node.position.add(
            this.getRandomDirection().mul(2),
          )
        }
      }
    }

    // if the node is out of the screen, put it in the pool
    if (
      this.node.x > this.player.x + 600 ||
      this.node.x < this.player.x - 600 ||
      this.node.y > this.player.y + 400 ||
      this.node.y < this.player.y - 400
    ) {
      this.EnemyManager.put(this.node)
      cc.log('put enemy back to pool')
    }
  }

  onBeginContact(contact, selfCollider, otherCollider) {
    if (otherCollider.node.name == 'Player') {
      this.playerLife.minusLife(10)
      cc.log('enemy hit player')
    }
    if (otherCollider.node.name == 'Bullet') {
      //this.node.destroy();
      this.enemyHealth -= 10
    }
    if (otherCollider.node.name == 'wheel') {
      this.enemyHealth -= 100
      this.scheduleOnce(() => {
        contact.disabled = true
      })
    }
    if (
      otherCollider.node.name != 'Player' &&
      otherCollider.node.name != 'Bullet'
    ) {
      //cc.log("enemy hit enemy")
      this.isColliding = true
    }
  }

  getRandomDirection(): cc.Vec2 {
    const randomDirectionX: number = Math.random() * 2 - 1 // 生成 -1 到 1 之間的隨機數
    const randomDirectionY: number = Math.random() * 2 - 1 // 生成 -1 到 1 之間的隨機數
    return cc.v2(randomDirectionX, randomDirectionY).normalize()
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  public init(node: cc.Node) {
    this.isDead = false
    this.enemyHealth = 100
    this.node.opacity = 255
    this.isFrozen = false
    this.player = cc.find('Canvas/Player')
    this.playerLife = cc.find('Canvas/Player/lifebar').getComponent(lifebar)
    this.setInitPos(node)
    this.rigidbody.enabledContactListener = true
    this.collider.enabled = true
    this.moveSpeed = 50
    this.anim.play('goblin_walk')
  }

  setInitPos(node: cc.Node) {
    this.node.parent = node
    this.node.name = 'TestEnemy'

    // n is from 0 to 1
    let n = Math.random()
    if (n >= 0 && n < 0.25) {
      this.node.position = cc.v3(
        this.player.x - 480 + Math.random() * 960,
        this.player.y + 320,
        0,
      )
    } else if (n >= 0.25 && n < 0.5) {
      this.node.position = cc.v3(
        this.player.x - 480 + Math.random() * 960,
        this.player.y - 320,
        0,
      )
    } else if (n >= 0.5 && n < 0.75) {
      this.node.position = cc.v3(
        this.player.x + 480,
        this.player.y - 320 + Math.random() * 640,
        0,
      )
    } else {
      this.node.position = cc.v3(
        this.player.x - 480,
        this.player.y - 320 + Math.random() * 640,
        0,
      )
    }
  }

  // this function is called when the enemy manager calls "get" API.
  reuse(EnemyManager) {
    this.EnemyManager = EnemyManager
  }
}
