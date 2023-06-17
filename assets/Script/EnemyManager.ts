const { ccclass, property } = cc._decorator

@ccclass
export default class enemyManager extends cc.Component {
  @property(cc.Node)
  private enemyGroup: cc.Node = null

  @property(cc.Prefab)
  private enemyPrefab: cc.Prefab = null

  private enemyPool = null

  private createCD = 1;

  onLoad() {
    this.enemyGroup = cc.find('Canvas/EnemyGroup')

    this.enemyPool = new cc.NodePool('TestEnemy')

    let maxEnemyNum = 2000

    for (let i: number = 0; i < maxEnemyNum; i++) {
      let enemy = cc.instantiate(this.enemyPrefab)

      this.enemyPool.put(enemy)
      // put enemy node under enemy groupx
    }

    this.createCD = 0.5;
    //this.schedule(this.createEnemy, 0.5) //set one enemy to the scene every 0.5s .
  }

  //call this function to add new enemy to the scene.
  private createEnemy() {
    let enemy = null

    if (this.enemyPool.size() > 0) enemy = this.enemyPool.get(this.enemyPool)

    if (enemy != null) enemy.getComponent('TestEnemy').init(this.node)
  }

  gameTick(dt) {
    this.createCD -= dt;
    if (this.createCD <= 0) {
      this.createCD = 0.5;

      this.createEnemy();
    }
  }
}
