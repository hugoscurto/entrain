/** @module basic-controller */

const typeCounters = {};

/**
 * Base class to create new controllers.
 *
 * @param {String} type - String describing the type of the controller.
 * @param {Object} defaults - Default parameters of the controller.
 * @param {Object} config - User defined configuration options.
 */
class BaseComponent {
  constructor(type, defaults, config = {}) {
    this.type = type;
    this.params = Object.assign({}, defaults, config);

    // handle id
    if (!typeCounters[type])
      typeCounters[type] = 0;

    if (!this.params.id) {
      this.id = `${type}-${typeCounters[type]}`;
      typeCounters[type] += 1;
    } else {
      this.id = this.params.id;
    }

    this._listeners = new Set();
    this._groupListeners = new Set();

    // register callback if given
    if (this.params.callback)
      this.addListener(this.params.callback);
  }

  /**
   * Add a listener to the controller.
   *
   * @param {Function} callback - Function to be applied when the controller
   *  state change.
   */
  addListener(callback) {
    this._listeners.add(callback);
  }

  /**
   * Called when a listener is added from a containing group.
   * @private
   */
  _addGroupListener(id, callId, callback) {
    if (!callId)
      this.addListener(callback);
    else {
      this._groupListeners.add({ callId, callback });
    }
  }

  /**
   * Remove a listener from the controller.
   *
   * @param {Function} callback - Function to remove from the listeners.
   * @private
   * @todo - reexpose when `container` can override this method...
   */
  // removeListener(callback) {
  //   this._listeners.remove(callback);
  // }

  /** @private */
  executeListeners(...values) {
    this._listeners.forEach((callback) => callback(...values));

    this._groupListeners.forEach((payload) => {
      const { callback, callId } = payload;
      callback(callId, ...values);
    });
  }
}

export default BaseComponent;
