
const separator = '/';

function getHead(path) {
  return path.split(separator)[0];
}

function getTail(path) {
  const parts = path.split(separator);
  parts.shift();
  return parts.join(separator);
}

const container = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args);

    this.elements = new Set();

    // sure of that ?
    delete this._listeners;
    delete this._groupListeners;
  }

  /**
   * Return one of the group children according to its `id`, `null` otherwise.
   * @private
   */
  _getHead(id) {

  }

  _getTail(id) {

  }

  /**
   * Return a child of the group recursively according to the given `id`,
   * `null` otherwise.
   * @private
   */
  getComponent(id) {
    const head = getHead(id);

    for (let component of this.elements) {
      if (head === component.id) {
        if (head === id)
          return component;
        else if (component.type = 'group')
          return component.getComponent(getTail(id));
        else
          throw new Error(`Undefined component ${id}`);
      }
    }

    throw new Error(`Undefined component ${id}`);
  }

  /**
   * Add Listener on each components of the group.
   *
   * @param {String} id - Path to component id.
   * @param {Function} callback - Function to execute.
   */
  addListener(id, callback) {
    if (arguments.length === 1) {
      callback = id;
      this._addGroupListener('', '', callback);
    } else {
      this._addGroupListener(id, '', callback);
    }
  }

  /** @private */
  _addGroupListener(id, callId, callback) {
    if (id) {
      const componentId = getHead(id);
      const component = this.getComponent(componentId);

      if (component) {
        id = getTail(id);
        component._addGroupListener(id, callId, callback);
      } else {
        throw new Error(`Undefined component ${this.rootId}/${componentId}`);
      }
    } else {
      this.elements.forEach((component) => {
        let _callId = callId; // create a new branche
        _callId += (callId === '') ? component.id : separator + component.id;
        component._addGroupListener(id, _callId, callback);
      });
    }
  }
}

export default container;
