import { Group, Color, Mesh, BoxGeometry, MeshStandardMaterial, Raycaster } from 'three'
import { indexToOffset } from './tools'

export default class SelectGrid extends Group {
  material = new MeshStandardMaterial({
    color: new Color(0.5, 0.6, 0.5),
    roughness: 0.4,
    transparent: true,
    opacity: 0.2
  })
  materialHighlight = null
  raycaster = new Raycaster()
  callbacks = []
  mouse = null
  camera = null
  lastIntersections = []

  constructor(camera) {
    super()
    this.camera = camera
    this.materialHighlight = this.material.clone()
    this.materialHighlight.opacity = 0.5
    this.visible = false

    for (var i = 0; i <= 8; i++) {
      let { dx, dy } = indexToOffset(i)
      let mesh = new Mesh(new BoxGeometry(1, 1, 0.5), this.material)
      mesh.position.set(dx, dy, 0)
      this.add(mesh)
    }

    // Mouse events
    let noMouse = () => this.mouse = null
    let setMouse = event => {
      if (!this.visible) {
        this.mouse = null
        return
      }
      this.mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: - (event.clientY / window.innerHeight) * 2 + 1,
      }
    }
    window.addEventListener('mouseout', noMouse)
    window.addEventListener('mouseleave', noMouse)
    window.addEventListener('mousemove', setMouse)
    window.addEventListener('click', event => {
      if (!this.visible) return
      setMouse(event)
      let intersections = this.getIntersections()
      if (intersections.length < 1) return
      // Get the nearest target to the camera
      let target = intersections[0]
      for (var inter of intersections) {
        if (target.distance > inter.distance)
          target = inter
      }
      if (target.object.visible) {
        this.selected(this.children.indexOf(target.object))
      }
    })
  }

  show(board: String) {
    this.visible = true
    for (var i = 0; i < this.children.length; i++) {
      if (board.charAt(i) == '-') {
        this.children[i].visible = true
      } else {
        this.children[i].visible = false
      }
    }
  }

  selected(i) {
    console.log(`SELECTED`, i)

    if (i < 0) return
    this.visible = false
    for (var cb of this.callbacks) {
      cb(i)
    }
  }

  onSelect(callback) {
    if (this.callbacks.includes(callback)) {
      console.log('Callback already registered')
      return
    }
    this.callbacks.push(callback)
  }
  getIntersections() {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    return this.raycaster.intersectObjects(this.children)
  }

  update() {
    if (this.mouse) {
      let intersections = this.getIntersections()
      for (let inter of this.lastIntersections) {
        (inter.object as Mesh).material = this.material
      }
      for (let inter of intersections) {
        (inter.object as Mesh).material = this.materialHighlight
      }
      this.lastIntersections = intersections
    }

  }

}