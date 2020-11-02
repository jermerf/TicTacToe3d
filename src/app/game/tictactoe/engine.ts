import { WebGLRenderer, PerspectiveCamera, Color, Scene, HemisphereLight, PointLight, Object3D } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { environment } from 'src/environments/environment'
import AxisArrows from './AxisArrows.js'
import O from './O'

export class Engine {
  w = window.innerWidth
  h = window.innerHeight
  renderer = null
  scene = new Scene()
  camera = new PerspectiveCamera(70, this.w / this.h, 0.01, 100)
  hemiLight = new HemisphereLight(0xffffff, 1);
  pointLight = new PointLight(0xffffff, 1);
  debugControls = null

  private lastTime = 0

  constructor(canvas) {
    this.renderer = new WebGLRenderer({ antialias: true, canvas });
    this.pointLight.position.set(0, 0, 5)
    this.pointLight.castShadow = true
    this.scene.add(this.hemiLight, this.pointLight)
    this.scene.background = new Color(0.4, 0.4, 0.5)
    this.camera.position.z = 5


    window.addEventListener('resize', () => this.onWindowResize());

    if (!environment.production) {
      // this.scene.add(new AxisArrows())
      // this.debugControls = new OrbitControls(this.camera, this.renderer.domElement)
      // this.debugControls.update()
      // let o = new O()
      // o.position.lerp(this.pointLight.position, 1)
      // this.scene.add(o)
    }

    this.onWindowResize()
    this.animate(0)
  }

  // Actor management
  private actors = []

  add(obj: Object3D, animated: Boolean = false) {
    this.scene.add(obj)
    if (animated) {
      this.actors.push(obj)
    }
  }

  gameloop(dt, time) {
    for (const a of this.actors) {
      a.update(dt, time)
    }
  }

  set loop(newLoop) {
    if (typeof (newLoop) !== 'function') return
    this.gameloop = newLoop
  }

  animate(time) {
    requestAnimationFrame(frameTime => {
      this.animate(frameTime)
    });
    let dt = time - this.lastTime
    this.gameloop(dt, time)
    this.lastTime = time
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    let aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    if (this.camera.aspect > 0.6) {
      this.camera.position.z = 5
    } else {
      this.camera.position.z = 5 + (0.6 - aspect) * 15
    }
  }
}