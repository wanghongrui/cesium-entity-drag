import * as Cesium from 'cesium'

export default class Drag {
  constructor(viewer) {
    this._viewer = viewer
    this.entity = null
    this.handler = null
    this.moving = false

    this._leftDown = this._leftDownHandler.bind(this)
    this._leftUp = this._leftUpHandler.bind(this)
    this._move = this._moveHandler.bind(this)

    this.handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)
  }

  enable() {
    this.handler.setInputAction(this._leftDown, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    this.handler.setInputAction(this._leftUp, Cesium.ScreenSpaceEventType.LEFT_UP)

    this.handler.setInputAction(this._move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  disable() {
    this._viewer.scene.screenSpaceCameraController.enableRotate = true

    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.moving = false
    this.entity = null
  }

  _leftDownHandler(e) {
    this.entity = this._viewer.scene.pick(e.position)
    this.moving = true
    if (this.entity) {
      this._viewer.scene.screenSpaceCameraController.enableRotate = false
    }
  }

  _leftUpHandler() {
    this.moving = false
    this.entity = null
    this._viewer.scene.screenSpaceCameraController.enableRotate = true
  }

  _moveHandler(e) {
    if (this.moving && this.entity && this.entity.id) {
      const ray = this._viewer.camera.getPickRay(e.endPosition)
      const cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene)

      const ellipsoid = viewer.scene.globe.ellipsoid
      const c = ellipsoid.cartesianToCartographic(cartesian)

      const origin = this.entity.id.position.getValue()

      const cc = ellipsoid.cartesianToCartographic(origin)

      this.entity.id.position = new Cesium.CallbackProperty(function () {
        return new Cesium.Cartesian3.fromRadians(c.longitude, c.latitude, cc.height)
      }, false)
    }
  }
}
