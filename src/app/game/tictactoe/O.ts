import { Tween, Easing } from '@tweenjs/tween.js'
import { Group, Color, Mesh, TorusGeometry, MeshStandardMaterial } from 'three'
import { GameService, GameMode } from '../../game.service'

export default class O extends Group {
  material = new MeshStandardMaterial({
    color: new Color(0.15, 0.1, 0.1),
    roughness: 0.5
  })
  o = new Mesh(new TorusGeometry(0.35, 0.15, 8, 24), this.material)

  constructor() {
    super()
    let { o } = this
    this.add(o)
    this.scale.z = 0.25
    this.wait.chain(this.spin)
    this.spin.chain(this.wait)
  }

  // Alternates between axes of rotation
  spinAxis = 0
  wait = new Tween({}).to({}, 5000 + Math.random() * 5000)
    .easing(Easing.Back.InOut)
    .start()
  spin = new Tween({ theta: 0 })
    .to({ theta: 2 * Math.PI }, 5000)
    .easing(Easing.Back.InOut)
    .onUpdate(obj => {
      switch (this.spinAxis) {
        case 0: this.rotation.x = obj.theta; break
        case 1: this.rotation.y = obj.theta; break
        case 2: this.rotation.z = obj.theta; break
      }
    })
    .onComplete(() => this.spinAxis = (this.spinAxis + 1) % 3)

  update(dt, time) {
    this.wait.update(time)
    this.spin.update(time)
  }

}