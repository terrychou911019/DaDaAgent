import AudioManager, { AudioType } from '../AudioManager'

interface SHOOTRANGE {
	x: number
	y: number
}

const { ccclass, property } = cc._decorator

@ccclass
export default class Bullet extends cc.Component {
	damage: number = 0
	moveSpeed: number = 0
	direction: number[] = [0, 0]

	shootRange: SHOOTRANGE = { x: 0, y: 0 }
	skillManager: any = null
	particleManager: cc.Node = null

	move(dt) {
		this.node.x += this.moveSpeed * this.direction[0] * dt
		this.node.y += this.moveSpeed * this.direction[1] * dt

		if (
			(this.direction[0] < 0 && this.node.x < this.shootRange.x) ||
			(this.direction[0] > 0 && this.node.x > this.shootRange.x) ||
			(this.direction[1] < 0 && this.node.y < this.shootRange.y) ||
			(this.direction[1] > 0 && this.node.y > this.shootRange.y)
		)
			this.node.destroy()
	}

	// LIFE-CYCLE CALLBACKS:
	onBeginContact(contact, self, other) {
		// if other is enemy, then let enemy take damage and destroy self
		if (other.node.name == 'goblin' || other.node.name == "Boss") {
			//other.getComponent('TestEnemy').enemyHealth -= this.damage;
			if (this.skillManager.skillMap['StrongBullet']) {
				other.node.getComponent("TestEnemy").isHit = true;
				//cc.log(other.node.getComponent("TestEnemy").isHit);
				other.node.getComponent('TestEnemy').scheduleOnce(function () {
					other.node.getComponent('TestEnemy').isHit = false;
				}, 0.25)
			}

			if (this.skillManager.skillMap['Thunder'] == true) {
				this.particleManager
					.getComponent('ParticleManager')
					.spawnThunderEffect(other.node.position)

				AudioManager.getInstance().playSoundEffect(AudioType.Explosion)
			}
			if (this.skillManager.skillMap['Ice'] == true) {
				this.particleManager
					.getComponent('ParticleManager')
					.spawnIceParticle(other.node.position)

				AudioManager.getInstance().playSoundEffect(AudioType.Ice)
			}
			if (this.skillManager.skillMap['Frozen'] == true) {
				// if enemy is already frozen, then do nothing
				// if (other.node.getComponent('TestEnemy').isFrozen == true) {
				// 	return
				// }
				this.particleManager
					.getComponent('ParticleManager')
					.spawnFrozenEffect(other.node.position)
				other.node.getComponent('TestEnemy').isFrozen = true
				// unfroze after 2 second
				other.node.getComponent('TestEnemy').scheduleOnce(function () {
					console.log('unfroze')
					other.node.getComponent('TestEnemy').isFrozen = false
				}, 2)

				AudioManager.getInstance().playSoundEffect(AudioType.Frozen)
			}

			if (!this.skillManager.skillMap['LightBullet']) {
				this.node.destroy();
			}
		}
	}


	onLoad() {
		this.shootRange.x = this.node.x + this.moveSpeed * this.direction[0] * 2
		this.shootRange.y = this.node.y + this.moveSpeed * this.direction[1] * 2
		this.skillManager = cc
			.find('Canvas/SkillManager')
			.getComponent('SkillManager')
		this.particleManager = cc.find('Canvas/ParticleManager')

		if (this.skillManager.skillMap['LightBullet'] == false) {
			// cancel child visible
			this.node.getChildByName('wake').active = false
		}
		else {
			AudioManager.getInstance().playSoundEffect(AudioType.LightBullet);
		}

		this.scheduleOnce(() => {
			this.node.destroy()
		}, 2)
	}

	gameTick(dt) {
		this.move(dt)
	}
}
// start () {}
