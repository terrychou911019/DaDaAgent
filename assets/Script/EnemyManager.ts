const { ccclass, property } = cc._decorator

@ccclass
export default class enemyManager extends cc.Component {
	@property(cc.Node)
	private enemyGroup: cc.Node = null

	@property(cc.Prefab)
	private enemyPrefab: cc.Prefab = null

	@property(cc.Prefab)
	boss: cc.Prefab = null

	private enemyPool = null

	private createCD = 0.5
	private createTimer = 0

	private isBossSummoned = false;

	onLoad() {
		this.enemyGroup = cc.find('Canvas/EnemyGroup')

		this.enemyPool = new cc.NodePool('TestEnemy')

		let maxEnemyNum = 2000

		for (let i: number = 0; i < maxEnemyNum; i++) {
			let enemy = cc.instantiate(this.enemyPrefab)

			this.enemyPool.put(enemy)
			// put enemy node under enemy groupx
		}

		this.createTimer = 0;
		this.isBossSummoned = false;
		//this.schedule(this.createEnemy, 0.5) //set one enemy to the scene every 0.5s .
	}

	//call this function to add new enemy to the scene.
	private createEnemy() {
		let enemy = null

		if (this.enemyPool.size() > 0) {
			enemy = this.enemyPool.get(this.enemyPool)
		}

		// access the script on Goblin 001 and call a function
		if (enemy != null) enemy.getComponent('TestEnemy').init(this.node)
	}

	gameTick(dt) {
		this.createTimer += dt
		if (this.createTimer >= this.createCD) {
			this.createTimer = 0
			this.createEnemy()
		}
	}

	summonBoss() {
		if(this.isBossSummoned){
			return;
		}

		this.isBossSummoned = true;

		let boss = cc.instantiate(this.boss);
		boss.parent = this.enemyGroup;
	}

}
