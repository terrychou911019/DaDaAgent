import lifebar from '../Game/Lifebar'

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

  private EnemyManager = null

  onLoad() {
    cc.director.getPhysicsManager().enabled = true
    cc.director.getCollisionManager().enabled = true
    this.player = cc.find('Canvas/Player')
    this.playerLife = cc.find('Canvas/Player/lifebar').getComponent(lifebar)
  }

  start() {
    this.isFrozen = false
  }

  update(dt) {
    cc.log(this.playerLife.cur_life)
    if (this.isFrozen == true) {
      return
    }
    //this.node.x += 40 * dt;

    // chase player's position
    let playerPos = this.player.position
    let enemyPos = this.node.position
    let direction = playerPos.sub(enemyPos)
    let normalizedDirection = direction.normalize()
    this.node.position = enemyPos.add(
      normalizedDirection.mul(this.moveSpeed * dt),
    )
  }

  gameTick(dt) {}

  public init(node: cc.Node) {
    this.isFrozen = false
    this.player = cc.find('Canvas/Player')
    this.playerLife = cc.find('Canvas/Player/lifebar').getComponent(lifebar)
    this.setInitPos(node)
  }

  setInitPos(node: cc.Node) {
    this.node.parent = node

    this.node.position = cc.v3(0, 0, 0)
    this.moveSpeed = 50
  }

  // this function is called when the enemy manager calls "get" API.
  reuse(EnemyManager) {
    this.EnemyManager = EnemyManager
  }

  onBeginContact(contact, selfCollider, otherCollider) {
    if (otherCollider.node.name == 'Player') {
      this.playerLife.minusLife(10)
    }
    if (otherCollider.node.name == 'Bullet') {
      //this.node.destroy();
    }
  }
}
