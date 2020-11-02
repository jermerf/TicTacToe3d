import { Tween, Easing } from '@tweenjs/tween.js'
import { Group, Color, Mesh, CylinderGeometry, MeshStandardMaterial } from 'three'

export default class X extends Group {
  color = new Color(0.15, 0.1, 0.1)
  material = new MeshStandardMaterial({ color: this.color, roughness: 0.5 })
  l1 = new Mesh(new CylinderGeometry(0.15, 0.15, 1, 8), this.material)
  l2 = new Mesh(new CylinderGeometry(0.15, 0.15, 1, 8), this.material)

  constructor() {
    super()
    let { l1, l2 } = this

    l1.rotation.x = Math.PI / 4
    l2.rotation.x = -Math.PI / 4
    l2.position.x = 0.2
    this.rotation.y = Math.PI / 2
    this.scale.x = 0.25
    this.add(l1, l2)
    this.wait.chain(this.twitch)
    this.twitch.chain(this.wait)
  }


  wait = new Tween({}).to({}, 5000 + Math.random() * 5000)
    .easing(Easing.Back.InOut)
    .start()
  twitch = new Tween({ theta: 0 })
    .to({ theta: 2 * Math.PI }, 5000)
    .easing(Easing.Back.InOut)
    .onUpdate(obj => {
      let offset = Math.sin(obj.theta) / 10
      this.l1.position.y = offset
      this.l1.position.z = offset
      this.l2.position.y = offset
    })

  update(dt, time) {
    this.wait.update(time)
    this.twitch.update(time)
  }

}