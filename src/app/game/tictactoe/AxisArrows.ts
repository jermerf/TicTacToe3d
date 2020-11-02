import { Group, Mesh, CylinderGeometry, MeshStandardMaterial } from 'three'

export default class AxisArrows extends Group {
  x = new Mesh(new CylinderGeometry(0.05, 0.05, 0.5, 6, 1), new MeshStandardMaterial({ color: 0xff3333 }))
  y = new Mesh(new CylinderGeometry(0.05, 0.05, 0.5, 6, 1), new MeshStandardMaterial({ color: 0x33ff33 }))
  z = new Mesh(new CylinderGeometry(0.05, 0.05, 0.5, 6, 1), new MeshStandardMaterial({ color: 0x3333ff }))

  constructor() {
    super()
    let { x, y, z } = this
    x.position.setX(0.5)
    x.rotation.set(0, 0, Math.PI / 2)
    y.position.setY(0.5)
    z.position.setZ(0.5)
    z.rotation.set(Math.PI / 2, 0, 0)
    this.add(x, y, z)
  }
}