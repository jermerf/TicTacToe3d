import { Tween, Easing } from '@tweenjs/tween.js'
import { Group, Color, Mesh, BoxGeometry, MeshStandardMaterial, Vector3 } from 'three'

const SPACING = 1.4

export default class WinLine extends Group {
  color = new Color(0, 0.3, 0)
  material = new MeshStandardMaterial({ color: this.color, transparent: true, opacity: 0.9 })
  line = new Mesh(new BoxGeometry(3, 0.3, 0.3), this.material)

  constructor() {
    super()
    this.add(this.line)
    this.position.z = 0.4
    this.hide()
  }

  show(winCombo) {
    let adjust = { r: 0, x: 0, y: 0, scale: 1 }
    let perp = Math.PI / 2
    switch (winCombo) {
      case 0: adjust = { r: 0, x: 0, y: SPACING, scale: 1 }; break
      case 1: adjust = { r: 0, x: 0, y: 0, scale: 1 }; break
      case 2: adjust = { r: 0, x: 0, y: -SPACING, scale: 1 }; break
      case 3: adjust = { r: perp, x: -SPACING, y: 0, scale: 1 }; break
      case 4: adjust = { r: perp, x: 0, y: 0, scale: 1 }; break
      case 5: adjust = { r: perp, x: SPACING, y: 0, scale: 1 }; break
      case 6: adjust = { r: -perp / 2.2, x: 0, y: 0, scale: 1.5 }; break
      case 7: adjust = { r: perp / 2.2, x: 0, y: 0, scale: 1.5 }; break
    }
    this.rotation.z = adjust.r
    this.position.x = adjust.x
    this.position.y = adjust.y
    this.visible = true
    this.drawLine.to({ scale: adjust.scale, rotation: 2 * Math.PI }, 1000).start()
  }

  hide() {
    this.visible = false
    this.drawLine.stop()
    this.scale.set(0, 0, 0)
  }

  drawLine = new Tween({ scale: 0, rotation: 0 })
    .easing(Easing.Cubic.Out)
    .onUpdate(obj => {
      this.scale.set(obj.scale, obj.scale, obj.scale)
      this.line.rotation.x = obj.rotation
    })

  update(dt, time) {
    this.drawLine.update(time)
  }

}