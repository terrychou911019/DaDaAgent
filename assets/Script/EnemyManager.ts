const { ccclass, property } = cc._decorator

@ccclass
export default class enemyManager extends cc.Component {
	@property(cc.Node)
	private enemyGroup: cc.Node = null

	@property(cc.Prefab)
	private enemyPrefab: cc.Prefab = null

	@property(cc.Prefab)
	boss: cc.Prefab = null

	@property(cc.Node)
	bossHealthBarFrame: cc.Node = null

	@property(cc.Node)
	bossHealthBar: cc.Node = null

	MAXWIDTH: number = 465;

	private enemyPool = null

	createCD = 0.5
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

		if(this.isBossSummoned){
			this.render();
		}
	}

	summonBoss() {
		if(this.isBossSummoned){
			return;
		}

		this.isBossSummoned = true;

		let boss = cc.instantiate(this.boss);
		boss.parent = this.enemyGroup;

		this.bossHealthBarFrame.active = true;
		//set boss position randomly and a little far around the player
		let player = cc.find('Canvas/Player');
		let playerPos = player.getPosition();
		let randX = Math.random() > 0.5 ? 1 : -1;
		let randY = Math.random() > 0.5 ? 1 : -1;
		let bossPos = cc.v2(playerPos.x + 500 * randX, playerPos.y + 500 * randY);
		boss.setPosition(bossPos);
	}

	playerUseUlt() {
		for (let i = 0; i < this.node.children.length; i++) {
			let enemy = this.node.children[i];
			enemy.getComponent('TestEnemy').enemyHealth -= 100;
		}
	}

	render() {
		let bossNode = this.enemyGroup.getChildByName('Boss');

		if(bossNode == null || bossNode.getComponent('Boss').enemyHealth <= 0){
			this.bossHealthBarFrame.active = false;
			return;
		}
		this.bossHealthBar.width = this.MAXWIDTH * bossNode.getComponent('Boss').enemyHealth / bossNode.getComponent('Boss').enemyFullHealth;
		this.bossHealthBar.x = -(this.MAXWIDTH / 2) + this.bossHealthBar.width / 2;
	}
}
