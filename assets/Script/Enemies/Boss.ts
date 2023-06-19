import lifebar from '../Game/Lifebar'

const { ccclass, property } = cc._decorator

@ccclass
export default class Boss extends cc.Component {
	isFrozen: boolean = false

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

	enemyFullHealth: number = 100
	enemyHealth: number = 100
	private isDead: boolean = false

	private anim: cc.Animation = null

	private rigidbody: cc.RigidBody = null
	private collider: cc.PhysicsBoxCollider = null

	private EXPManager: any = null;
	private ScoreManager: any = null;

    private isChargingDash: boolean = false;
    private canDash: boolean = true;
	private isDashing: boolean = false;
	private dashingPower: number = 2.5;
	private dashingTime = 0.2;
	private dashingCooldown = 3;
    private chargingDashTime = 2;
    private dashDirection: cc.Vec3;

	private lifebar = null;

	private timeManager = null;

	onLoad() {
		this.lifebar = cc.find("Canvas/Player/lifebar").getComponent("Lifebar");
		this.timeManager = cc.find("Canvas/TimeManager").getComponent("TimeManager");
	}

	start() {
		this.isFrozen = false;

        cc.director.getPhysicsManager().enabled = true
		cc.director.getCollisionManager().enabled = true
		this.player = cc.find('Canvas/Player')
		this.playerLife = cc.find('Canvas/Player/lifebar').getComponent("Lifebar")
		this.gameManager = cc.find('Canvas/GameManager').getComponent('GameManager')
		this.anim = this.getComponent(cc.Animation)
		this.rigidbody = this.getComponent(cc.RigidBody)
		this.collider = this.getComponent(cc.PhysicsBoxCollider)
		this.EXPManager = cc.find('Canvas/EXPManager').getComponent('EXPManager');
		this.ScoreManager = cc.find('Canvas/ScoreManager').getComponent('ScoreManager');
		//this.moveSpeed = 50
		//this.enemyHealth = 100
		this.isDead = false
		this.isFrozen = false
		this.node.opacity = 255
		this.anim.play('Boss_walk')
		this.rigidbody.enabledContactListener = true
		this.collider.enabled = true

        // set init position
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
			this.EXPManager.gainEXP(46);
			this.ScoreManager.gainScore(149);

			this.moveSpeed = 0
			this.isDead = true
			this.rigidbody.enabledContactListener = false
			this.collider.enabled = false
			// let fade = cc.fadeOut(1)
			//destroy the node after animation finished
			this.anim.stop();
			this.anim.play('Boss_die');
			this.anim.on('finished', ()=>{
				console.log("Boss destroy");
				this.node.destroy();
			})
			// this.scheduleOnce(() => {
			// 	//this.EnemyManager.put(this.node)
            //     this.node.destroy();
			// }, 2)

			//this.isDead = false
			//this.enemyHealth = 100
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

            // if distance between player and enemy is less than 100, enemy will charge dash
            // and if canDash is true, enemy will dash toward the player
            // and if not dashing, enemy will walk toward the player
            let distance = direction.mag();
            if (distance < 350 && !this.isChargingDash && this.canDash) {
                this.dashDirection = normalizedDirection;

                this.canDash = false;
                this.isChargingDash = true;
				this.anim.stop()
				this.anim.play('Boss_attack')

                this.scheduleOnce(() => {
                    this.isChargingDash = false;
                    this.isDashing = true;

                    this.scheduleOnce(() => {
                        this.isDashing = false;
						this.anim.stop()
						this.anim.play('Boss_walk')
                    }, this.dashingTime);

                }, this.chargingDashTime);

                this.scheduleOnce(() => {
                    this.canDash = true;
                }, this.dashingCooldown);
            }

            if(this.isChargingDash) {
                // charging dash, stop movement
            }
            else if(this.isDashing){
                this.node.position = enemyPos.add(
                    this.dashDirection.mul(this.moveSpeed * dt * 10),
                );
            }
            else{
                // not charging dash, walk toward the player
                // walk toward the player
                this.node.position = enemyPos.add(
                    normalizedDirection.mul(this.moveSpeed * dt),
                );
            }

            if(!this.isChargingDash){
                // change enemy facing direction for x and -x
                if (this.node.x > this.player.x) {
                    this.node.scaleX = -1
                } else {
                    this.node.scaleX = 1
                }
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

		// if the node is out of the screen, put it in the pool
		//this.boundingDetect()
	}

	// boundingDetect() {
	// 	if (
	// 		(this.node && this.node.x > this.player.x + 600) ||
	// 		this.node.x < this.player.x - 600 ||
	// 		this.node.y > this.player.y + 400 ||
	// 		this.node.y < this.player.y - 400
	// 	) {
	// 		this.EnemyManager.put(this.node)
	// 	}
	// }

	onBeginContact(contact, selfCollider, otherCollider) {
		if (otherCollider.node.name == 'Player') {
			this.lifebar.minusLife(10)
			cc.log('boss hit player')
		}
		if (otherCollider.node.name == 'Bullet') {
			//this.node.destroy();
			this.enemyHealth -= 10
		}
		if (otherCollider.node.name == 'wheel') {
			this.enemyHealth -= 20
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
		cc.director.getPhysicsManager().enabled = true
		cc.director.getCollisionManager().enabled = true
		this.player = cc.find('Canvas/Player')
		this.playerLife = cc.find('Canvas/Player/lifebar').getComponent("Lifebar")
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
		this.node.opacity = 255
		this.anim.play('Boss_walk')
		this.rigidbody.enabledContactListener = true
		this.collider.enabled = true

		this.setInitPos(node)
	}

	setInitPos(node: cc.Node) {
		this.node.parent = node
		this.node.name = 'Boss'

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
	// reuse(EnemyManager) {
	// 	this.EnemyManager = EnemyManager
	// }
}