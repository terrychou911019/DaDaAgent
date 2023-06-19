import lifebar from '../Game/Lifebar'

const { ccclass, property } = cc._decorator

@ccclass
export default class TestEnemy extends cc.Component {
	isFrozen: boolean = false
	isHit: boolean = false

	// LIFE-CYCLE CALLBACKS:

	@property(cc.Node)
	player: cc.Node = null

	@property(lifebar)
	playerLife: lifebar = null

	@property(Number)
	moveSpeed: number = 50

	private isColliding: boolean = false
	private collisionTimer: number = 0
	private collisionDuration: number = 1 // 碰撞後移動的持續時間
	private minRoamingDistance: number = 2 // 最小漫遊距離
	private maxRoamingDistance: number = 5 // 最大漫遊距離
	private randomDistance: number = 0 // 隨機漫遊距離
	private EnemyManager = null
	private gameManager = null

	enemyHealth: number = 100
	private isDead: boolean = false

	private anim: cc.Animation = null

	private rigidbody: cc.RigidBody = null
	private collider: cc.PhysicsBoxCollider = null

	private EXPManager: any = null;
	private ScoreManager: any = null;
	private skillManager: any = null;
	private timeManager = null;

	private weapon = null;
	private weaponSpin = null;

	private lifebar = null;

	onLoad() {
		this.weapon = cc.find("Canvas/Player/Weapon").getComponent("Weapon");
		this.weaponSpin = cc.find("Canvas/WeaponSpin").getComponent("WeaponSpin");
		this.skillManager = cc.find("Canvas/SkillManager").getComponent("SkillManager");
		this.lifebar = cc.find("Canvas/Player/lifebar").getComponent("Lifebar");
		this.timeManager = cc.find("Canvas/TimeManager").getComponent("TimeManager");
	}

	start() {
		this.isFrozen = false
		this.isHit = false
	}

	deadEffect() {
		this.moveSpeed = 0
	}

	update(dt) {
		if (this.gameManager.isGamePaused || this.lifebar.cur_life <= 0 || this.timeManager.timeUP) {
			return
		}

		if (this.enemyHealth <= 0) {
			// player gain exp and score	
			this.scheduleOnce(()=>{
				this.EXPManager.gainEXP(46);
				this.ScoreManager.gainScore(149);
			}, 0.8)
			

			this.moveSpeed = 0
			this.isDead = true
			this.rigidbody.enabledContactListener = false
			this.collider.enabled = false
			// let fade = cc.fadeOut(1)
			this.anim.stop()
			this.anim.play('die')
			this.scheduleOnce(() => {
				this.EnemyManager.put(this.node)
			}, 0.8)

			this.isDead = false
			this.enemyHealth = 100
		}

		if (this.isFrozen == true) {
			this.node.position = this.node.position
		}
		else {
			if (!this.isDead) {
				// chase player's position
				let playerPos = this.player.position
				let enemyPos = this.node.position
				let direction = playerPos.sub(enemyPos)
				let normalizedDirection = direction.normalize()
				this.node.position = enemyPos.add(
					normalizedDirection.mul(this.isHit ? this.moveSpeed * dt * (-1) : this.moveSpeed * dt),
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
							cc.v3(this.getRandomDirection().mul(2), 0)
						)
					}
				}
			}
		}

		
		
		

		// if the node is out of the screen, put it in the pool
		this.boundingDetect()
	}

	boundingDetect() {
		if (
			(this.node && this.node.x > this.player.x + 600) ||
			this.node.x < this.player.x - 600 ||
			this.node.y > this.player.y + 400 ||
			this.node.y < this.player.y - 400
		) {
			this.EnemyManager.put(this.node)
		}
	}

	onBeginContact(contact, selfCollider, otherCollider) {
		if (otherCollider.node.name == 'Player') {
			this.playerLife.minusLife(10)
			cc.log('enemy hit player')
		}
		if (otherCollider.node.name == 'Bullet') {
			//this.node.destroy();
			if (this.skillManager.skillMap["Thunder"] && this.skillManager.skillMap["Ice"]) {
				let d = this.weapon.DAMAGE;
				d += 15;
				this.enemyHealth -= d;
			}
			else if (this.skillManager.skillMap["Thunder"]) {
				let d = this.weapon.DAMAGE;
				d += 10;
				this.enemyHealth -= d;
			}
			else if (this.skillManager.skillMap["Ice"]) {
				let d = this.weapon.DAMAGE;
				d += 5;
				this.enemyHealth -= d;
			}
			else {
				this.enemyHealth -= this.weapon.DAMAGE;	
			}	

			
		}
		//cc.log(otherCollider.node.name)
		if (otherCollider.node.name == 'wheel') {
			// cc.log("in wheel")
			// this.enemyHealth -= 100
			// this.scheduleOnce(() => {
			// 	contact.disabled = true
			// })
		}
		if (otherCollider.node.name == "goblin") {
			//cc.log("enemy hit enemy")
			
			if (this.isFrozen) {
				this.scheduleOnce(() => {
					contact.disabled = true
				})
			}
			else {
				this.isColliding = true;
			}
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
		cc.director.getPhysicsManager().enabled = true
		cc.director.getCollisionManager().enabled = true
		this.player = cc.find('Canvas/Player')
		this.playerLife = cc.find('Canvas/Player/lifebar').getComponent(lifebar)
		this.gameManager = cc.find('Canvas/GameManager').getComponent('GameManager')
		this.anim = this.getComponent(cc.Animation)
		this.rigidbody = this.getComponent(cc.RigidBody)
		this.collider = this.getComponent(cc.PhysicsBoxCollider)
		this.EXPManager = cc.find('Canvas/EXPManager').getComponent('EXPManager');
		this.ScoreManager = cc.find('Canvas/ScoreManager').getComponent('ScoreManager');
		this.moveSpeed = 50
		this.enemyHealth = 100
		this.isDead = false
		this.isFrozen = false
		this.isHit = false
		this.node.opacity = 255
		this.anim.play('walk')
		this.rigidbody.enabledContactListener = true
		this.collider.enabled = true

		this.setInitPos(node)
	}

	setInitPos(node: cc.Node) {
		this.node.parent = node
		this.node.name = 'goblin'

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