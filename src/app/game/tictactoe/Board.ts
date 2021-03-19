import { Tween } from '@tweenjs/tween.js'
import { Group, Color, Mesh, BoxGeometry, MeshStandardMaterial, Object3D } from 'three'
import { GameMode } from '../../game.service'
import { indexToOffset } from './tools'
import X from './X'
import O from './O'

export default class Board extends Group {
  color = new Color(0.3, 0.2, 0.1)
  material = new MeshStandardMaterial({ color: this.color })
  v1 = new Mesh(new BoxGeometry(0.25, 4, 0.25), this.material)
  v2 = new Mesh(new BoxGeometry(0.25, 4, 0.25), this.material)
  h1 = new Mesh(new BoxGeometry(4, 0.25, 0.25), this.material)
  h2 = new Mesh(new BoxGeometry(4, 0.25, 0.25), this.material)
  spacing = 0.75
  mode: GameMode = GameMode.LOGGED_OUT
  letterMeshes = new Group()

  constructor() {
    super()
    const { v1, v2, h1, h2, spacing } = this
    v1.position.x = -spacing
    v2.position.x = spacing
    h1.position.y = spacing
    h2.position.y = -spacing
    h1.position.z += 0.1
    h2.position.z += 0.1
    this.add(v1, v2, h1, h2)
    this.add(this.letterMeshes)
  }

  setMode(mode): void {
    this.mode = mode
  }

  update(dt, time): void {
    for (const l of this.letterMeshes.children) {
      if (l instanceof X || l instanceof O) l.update(dt, time)
    }
    switch (this.mode) {
      case GameMode.LOGGED_OUT:
      case GameMode.LOBBY:
      case GameMode.OBSERVER:
      case GameMode.PLAYER_WAITING:
        this.spinning(dt); break
      case GameMode.PLAYER_PLAYING:
        this.backToBaseline(dt)
    }
  }

  theta = 0
  spinning(dt): void {
    this.theta += dt
    const offset = Math.sin(this.theta / 2000) / 50
    this.v1.rotation.y += offset
    this.v2.rotation.y += -offset
    this.h1.rotation.x += offset
    this.h2.rotation.x += -offset
  }

  backToBaseline(dt): void {
    const vert = this.v1.rotation.y
    const hori = this.h1.rotation.y

    if (vert === 0 && hori === 0) return
    this.spinning(dt)
    // If the spin passed zero
    if ((vert > 0) !== (this.v1.rotation.y > 0)) {
      this.v1.rotation.y = 0
      this.v2.rotation.y = 0
    }
    if ((hori > 0) !== (this.h1.rotation.y > 0)) {
      this.h1.rotation.y = 0
      this.h2.rotation.y = 0
    }
  }

  setBoard(board): void {
    for (let i = 0; i < board.length; i++) {
      const { dx, dy } = indexToOffset(i)
      const letter = board[i]
      let letterMesh = this.letterMeshes[i]
      switch (letter) {
        case '-':
          if (!letterMesh || letterMesh instanceof X || letterMesh instanceof O)
            letterMesh = new Object3D()
          break
        case 'x':
          if (!(letterMesh instanceof X))
            letterMesh = new X()
          break
        case 'o':
          if (!(letterMesh instanceof O))
            letterMesh = new O()
          break
      }
      letterMesh.position.set(dx, dy, 0)
      this.letterMeshes.children[i] = letterMesh
    }
  }


}