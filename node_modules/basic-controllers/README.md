# Basic Controllers

> Set of simple controllers for rapid prototyping

![examples](https://cdn.rawgit.com/ircam-jstools/basic-controllers/master/tmpl/examples.png)

## Install

```
npm install [--save] ircam-jstools/basic-controllers
```

## Examples

> [components](https://cdn.rawgit.com/ircam-jstools/basic-controllers/master/examples/components/index.html)  
> [factory](https://cdn.rawgit.com/ircam-jstools/basic-controllers/master/examples/factory/index.html)

## Available components

- DragAndDrop
- Group
- NumberBox
- SelectButtons
- SelectList
- Slider
- Text
- Title
- Toggle
- TriggerButtons

## Usage

Controllers can be instanciated individually :

```js
import * as controllers from 'basic-controllers';

// instanciate individual components
const slider = new controllers.Slider({
  label: 'My Slider',
  min: 20,
  max: 1000,
  step: 1,
  default: 537,
  unit: 'Hz',
  size: 'large',
  container: '#container',
  callback: (value) => console.log(value),
});
```

Or through a factory using a json definition :

```js
import * as controllers from 'basic-controllers';

const definitions = [
  {
    id: 'my-slider',
    type: 'slider',
    label: 'My Slider',
    size: 'large',
    min: 0,
    max: 1000,
    step: 1,
    default: 253,
  }, {
    id: 'my-group',
    type: 'group',
    label: 'Group',
    default: 'opened',
    elements: [
      {
        id: 'my-number',
        type: 'number-box',
        default: 0.4,
        min: -1,
        max: 1,
        step: 0.01,
      }
    ],
  }
];

const controls = controllers.create('#container', definitions);
controls.addListener((id, value) => console.log(id, value));
```

## API

<a name="module_basic-controllers"></a>

## basic-controllers

* [basic-controllers](#module_basic-controllers)
    * _static_
        * [.setTheme(theme)](#module_basic-controllers.setTheme)
        * [.create(container, definitions)](#module_basic-controllers.create) ⇒ <code>Object</code>
        * [.disableStyles()](#module_basic-controllers.disableStyles)
    * _inner_
        * [~DragAndDrop](#module_basic-controllers..DragAndDrop)
            * [new DragAndDrop(config)](#new_module_basic-controllers..DragAndDrop_new)
            * [.value](#module_basic-controllers..DragAndDrop+value) : <code>Object.&lt;String, (AudioBuffer\|JSON)&gt;</code>
        * [~Group](#module_basic-controllers..Group)
            * [new Group(config)](#new_module_basic-controllers..Group_new)
            * [.value](#module_basic-controllers..Group+value) : <code>String</code>
            * [.state](#module_basic-controllers..Group+state) : <code>String</code>
        * [~NumberBox](#module_basic-controllers..NumberBox)
            * [new NumberBox(config)](#new_module_basic-controllers..NumberBox_new)
            * [.value](#module_basic-controllers..NumberBox+value) : <code>Number</code>
        * [~SelectButtons](#module_basic-controllers..SelectButtons)
            * [new SelectButtons(config)](#new_module_basic-controllers..SelectButtons_new)
            * [.value](#module_basic-controllers..SelectButtons+value) : <code>String</code>
            * [.index](#module_basic-controllers..SelectButtons+index) : <code>Number</code>
        * [~SelectList](#module_basic-controllers..SelectList)
            * [new SelectList(config)](#new_module_basic-controllers..SelectList_new)
            * [.value](#module_basic-controllers..SelectList+value) : <code>String</code>
            * [.index](#module_basic-controllers..SelectList+index) : <code>Number</code>
        * [~Slider](#module_basic-controllers..Slider)
            * [new Slider(config)](#new_module_basic-controllers..Slider_new)
            * [.value](#module_basic-controllers..Slider+value) : <code>Number</code>
        * [~Text](#module_basic-controllers..Text)
            * [new Text(config)](#new_module_basic-controllers..Text_new)
            * [.value](#module_basic-controllers..Text+value) : <code>String</code>
        * [~Title](#module_basic-controllers..Title)
            * [new Title(config)](#new_module_basic-controllers..Title_new)
        * [~Toggle](#module_basic-controllers..Toggle)
            * [new Toggle(config)](#new_module_basic-controllers..Toggle_new)
            * [.value](#module_basic-controllers..Toggle+value) : <code>Boolean</code>
            * [.active](#module_basic-controllers..Toggle+active) : <code>Boolean</code>
        * [~TriggerButtons](#module_basic-controllers..TriggerButtons)
            * [new TriggerButtons(config)](#new_module_basic-controllers..TriggerButtons_new)
            * [.value](#module_basic-controllers..TriggerButtons+value) : <code>String</code>
            * [.index](#module_basic-controllers..TriggerButtons+index) : <code>String</code>


-

<a name="module_basic-controllers.setTheme"></a>

### basic-controllers.setTheme(theme)
Change the theme of the controllers, currently 3 themes are available:
 - `'light'` (default)
 - `'grey'`
 - `'dark'`

**Kind**: static method of <code>[basic-controllers](#module_basic-controllers)</code>  

| Param | Type | Description |
| --- | --- | --- |
| theme | <code>String</code> | Name of the theme. |


-

<a name="module_basic-controllers.create"></a>

### basic-controllers.create(container, definitions) ⇒ <code>Object</code>
Create a whole control surface from a json definition.

**Kind**: static method of <code>[basic-controllers](#module_basic-controllers)</code>  
**Returns**: <code>Object</code> - - A `Control` instance that behaves like a group without graphic.  

| Param | Type | Description |
| --- | --- | --- |
| container | <code>String</code> &#124; <code>Element</code> | Container of the controls. |
| definitions | <code>Object</code> | Definitions for the controls. |

**Example**  
```js
import * as controllers from 'basic-controllers';

const definitions = [
  {
    id: 'my-slider',
    type: 'slider',
    label: 'My Slider',
    size: 'large',
    min: 0,
    max: 1000,
    step: 1,
    default: 253,
  }, {
    id: 'my-group',
    type: 'group',
    label: 'Group',
    default: 'opened',
    elements: [
      {
        id: 'my-number',
        type: 'number-box',
        default: 0.4,
        min: -1,
        max: 1,
        step: 0.01,
      }
    ],
  }
];

const controls = controllers.create('#container', definitions);

// add a listener on all the component inside `my-group`
controls.addListener('my-group', (id, value) => console.log(id, value));

// retrieve the instance of `my-number`
const myNumber = controls.getComponent('my-group/my-number');
```

-

<a name="module_basic-controllers.disableStyles"></a>

### basic-controllers.disableStyles()
Disable default styling (expect a broken ui)

**Kind**: static method of <code>[basic-controllers](#module_basic-controllers)</code>  

-

<a name="module_basic-controllers..DragAndDrop"></a>

### basic-controllers~DragAndDrop
Drag and drop zone for audio files returning `AudioBuffer`s and/or JSON
descriptor data.

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

* [~DragAndDrop](#module_basic-controllers..DragAndDrop)
    * [new DragAndDrop(config)](#new_module_basic-controllers..DragAndDrop_new)
    * [.value](#module_basic-controllers..DragAndDrop+value) : <code>Object.&lt;String, (AudioBuffer\|JSON)&gt;</code>


-

<a name="new_module_basic-controllers..DragAndDrop_new"></a>

#### new DragAndDrop(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| [config.label] | <code>String</code> | <code>&#x27;Drag and drop audio files&#x27;</code> | Label of the  controller. |
| [config.labelProcess] | <code>String</code> | <code>&#x27;process...&#x27;</code> | Label of the controller  while audio files are decoded. |
| [config.audioContext] | <code>AudioContext</code> | <code></code> | Optionnal audio context  to use in order to decode audio files. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |
| [config.callback] | <code>function</code> | <code></code> | Callback to be executed when the  value changes. |

**Example**  
```js
import * as controllers from 'basic-controllers';

const dragAndDrop = new controllers.DragAndDrop({
  container: '#container',
  callback: (results) => console.log(results),
});
```

-

<a name="module_basic-controllers..DragAndDrop+value"></a>

#### dragAndDrop.value : <code>Object.&lt;String, (AudioBuffer\|JSON)&gt;</code>
Get the last results

**Kind**: instance property of <code>[DragAndDrop](#module_basic-controllers..DragAndDrop)</code>  
**Read only**: true  

-

<a name="module_basic-controllers..Group"></a>

### basic-controllers~Group
Group of controllers.

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

* [~Group](#module_basic-controllers..Group)
    * [new Group(config)](#new_module_basic-controllers..Group_new)
    * [.value](#module_basic-controllers..Group+value) : <code>String</code>
    * [.state](#module_basic-controllers..Group+state) : <code>String</code>


-

<a name="new_module_basic-controllers..Group_new"></a>

#### new Group(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| config.label | <code>String</code> |  | Label of the group. |
| [config.default] | <code>&#x27;opened&#x27;</code> &#124; <code>&#x27;closed&#x27;</code> | <code>&#x27;opened&#x27;</code> | Default state of the  group. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |

**Example**  
```js
import * as controllers from 'basic-controllers';

// create a group
const group = new controllers.Group({
  label: 'Group',
  default: 'opened',
  container: '#container'
});

// insert controllers in the group
const groupSlider = new controllers.Slider({
  label: 'Group Slider',
  min: 20,
  max: 1000,
  step: 1,
  default: 200,
  unit: 'Hz',
  size: 'large',
  container: group,
  callback: (value) => console.log(value),
});

const groupText = new controllers.Text({
  label: 'Group Text',
  default: 'text input',
  readonly: false,
  container: group,
  callback: (value) => console.log(value),
});
```

-

<a name="module_basic-controllers..Group+value"></a>

#### group.value : <code>String</code>
State of the group (`'opened'` or `'closed'`).

**Kind**: instance property of <code>[Group](#module_basic-controllers..Group)</code>  

-

<a name="module_basic-controllers..Group+state"></a>

#### group.state : <code>String</code>
Alias for `value`.

**Kind**: instance property of <code>[Group](#module_basic-controllers..Group)</code>  

-

<a name="module_basic-controllers..NumberBox"></a>

### basic-controllers~NumberBox
Number Box controller

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

* [~NumberBox](#module_basic-controllers..NumberBox)
    * [new NumberBox(config)](#new_module_basic-controllers..NumberBox_new)
    * [.value](#module_basic-controllers..NumberBox+value) : <code>Number</code>


-

<a name="new_module_basic-controllers..NumberBox_new"></a>

#### new NumberBox(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| config.label | <code>String</code> |  | Label of the controller. |
| [config.min] | <code>Number</code> | <code>0</code> | Minimum value. |
| [config.max] | <code>Number</code> | <code>1</code> | Maximum value. |
| [config.step] | <code>Number</code> | <code>0.01</code> | Step between consecutive values. |
| [config.default] | <code>Number</code> | <code>0</code> | Default value. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |
| [config.callback] | <code>function</code> | <code></code> | Callback to be executed when the  value changes. |

**Example**  
```js
import * as controllers from 'basic-controllers';

const numberBox = new controllers.NumberBox({
  label: 'My Number Box',
  min: 0,
  max: 10,
  step: 0.1,
  default: 5,
  container: '#container',
  callback: (value) => console.log(value),
});
```

-

<a name="module_basic-controllers..NumberBox+value"></a>

#### numberBox.value : <code>Number</code>
Current value of the controller.

**Kind**: instance property of <code>[NumberBox](#module_basic-controllers..NumberBox)</code>  

-

<a name="module_basic-controllers..SelectButtons"></a>

### basic-controllers~SelectButtons
List of buttons with state.

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

* [~SelectButtons](#module_basic-controllers..SelectButtons)
    * [new SelectButtons(config)](#new_module_basic-controllers..SelectButtons_new)
    * [.value](#module_basic-controllers..SelectButtons+value) : <code>String</code>
    * [.index](#module_basic-controllers..SelectButtons+index) : <code>Number</code>


-

<a name="new_module_basic-controllers..SelectButtons_new"></a>

#### new SelectButtons(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| config.label | <code>String</code> |  | Label of the controller. |
| [config.options] | <code>Array</code> | <code></code> | Values of the drop down list. |
| [config.default] | <code>Number</code> | <code></code> | Default value. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |
| [config.callback] | <code>function</code> | <code></code> | Callback to be executed when the  value changes. |

**Example**  
```js
import * as controllers from 'basic-controllers';

const selectButtons = new controllers.SelectButtons({
  label: 'SelectButtons',
  options: ['standby', 'run', 'end'],
  default: 'run',
  container: '#container',
  callback: (value, index) => console.log(value, index),
});
```

-

<a name="module_basic-controllers..SelectButtons+value"></a>

#### selectButtons.value : <code>String</code>
Current value.

**Kind**: instance property of <code>[SelectButtons](#module_basic-controllers..SelectButtons)</code>  

-

<a name="module_basic-controllers..SelectButtons+index"></a>

#### selectButtons.index : <code>Number</code>
Current option index.

**Kind**: instance property of <code>[SelectButtons](#module_basic-controllers..SelectButtons)</code>  

-

<a name="module_basic-controllers..SelectList"></a>

### basic-controllers~SelectList
Drop-down list controller.

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

* [~SelectList](#module_basic-controllers..SelectList)
    * [new SelectList(config)](#new_module_basic-controllers..SelectList_new)
    * [.value](#module_basic-controllers..SelectList+value) : <code>String</code>
    * [.index](#module_basic-controllers..SelectList+index) : <code>Number</code>


-

<a name="new_module_basic-controllers..SelectList_new"></a>

#### new SelectList(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| config.label | <code>String</code> |  | Label of the controller. |
| [config.options] | <code>Array</code> | <code></code> | Values of the drop down list. |
| [config.default] | <code>Number</code> | <code></code> | Default value. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |
| [config.callback] | <code>function</code> | <code></code> | Callback to be executed when the  value changes. |

**Example**  
```js
import * as controllers from 'basic-controllers';

const selectList = new controllers.SelectList({
  label: 'SelectList',
  options: ['standby', 'run', 'end'],
  default: 'run',
  container: '#container',
  callback: (value, index) => console.log(value, index),
});
```

-

<a name="module_basic-controllers..SelectList+value"></a>

#### selectList.value : <code>String</code>
Current value.

**Kind**: instance property of <code>[SelectList](#module_basic-controllers..SelectList)</code>  

-

<a name="module_basic-controllers..SelectList+index"></a>

#### selectList.index : <code>Number</code>
Current option index.

**Kind**: instance property of <code>[SelectList](#module_basic-controllers..SelectList)</code>  

-

<a name="module_basic-controllers..Slider"></a>

### basic-controllers~Slider
Slider controller.

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

* [~Slider](#module_basic-controllers..Slider)
    * [new Slider(config)](#new_module_basic-controllers..Slider_new)
    * [.value](#module_basic-controllers..Slider+value) : <code>Number</code>


-

<a name="new_module_basic-controllers..Slider_new"></a>

#### new Slider(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| config.label | <code>String</code> |  | Label of the controller. |
| [config.min] | <code>Number</code> | <code>0</code> | Minimum value. |
| [config.max] | <code>Number</code> | <code>1</code> | Maximum value. |
| [config.step] | <code>Number</code> | <code>0.01</code> | Step between consecutive values. |
| [config.default] | <code>Number</code> | <code>0</code> | Default value. |
| [config.unit] | <code>String</code> | <code>&#x27;&#x27;</code> | Unit of the value. |
| [config.size] | <code>&#x27;small&#x27;</code> &#124; <code>&#x27;medium&#x27;</code> &#124; <code>&#x27;large&#x27;</code> | <code>&#x27;medium&#x27;</code> | Size of the  slider. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |
| [config.callback] | <code>function</code> | <code></code> | Callback to be executed when the  value changes. |

**Example**  
```js
import * as controllers from 'basic-controllers';

const slider = new controllers.Slider({
  label: 'My Slider',
  min: 20,
  max: 1000,
  step: 1,
  default: 537,
  unit: 'Hz',
  size: 'large',
  container: '#container',
  callback: (value) => console.log(value),
});
```

-

<a name="module_basic-controllers..Slider+value"></a>

#### slider.value : <code>Number</code>
Current value.

**Kind**: instance property of <code>[Slider](#module_basic-controllers..Slider)</code>  

-

<a name="module_basic-controllers..Text"></a>

### basic-controllers~Text
Text controller.

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

* [~Text](#module_basic-controllers..Text)
    * [new Text(config)](#new_module_basic-controllers..Text_new)
    * [.value](#module_basic-controllers..Text+value) : <code>String</code>


-

<a name="new_module_basic-controllers..Text_new"></a>

#### new Text(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| config.label | <code>String</code> |  | Label of the controller. |
| [config.default] | <code>Array</code> | <code>&#x27;&#x27;</code> | Default value of the controller. |
| [config.readonly] | <code>Array</code> | <code>false</code> | Define if the controller is readonly. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |
| [config.callback] | <code>function</code> | <code></code> | Callback to be executed when the  value changes. |

**Example**  
```js
import * as controllers from 'basic-contollers';

const text = new controllers.Text({
  label: 'My Text',
  default: 'default value',
  readonly: false,
  container: '#container',
  callback: (value) => console.log(value),
});
```

-

<a name="module_basic-controllers..Text+value"></a>

#### text.value : <code>String</code>
Current value.

**Kind**: instance property of <code>[Text](#module_basic-controllers..Text)</code>  

-

<a name="module_basic-controllers..Title"></a>

### basic-controllers~Title
Title.

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

-

<a name="new_module_basic-controllers..Title_new"></a>

#### new Title(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| config.label | <code>String</code> |  | Label of the controller. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |

**Example**  
```js
import * as controller from 'basic-controllers';

const title = new controllers.Title({
  label: 'My Title',
  container: '#container'
});
```

-

<a name="module_basic-controllers..Toggle"></a>

### basic-controllers~Toggle
On/Off controller.

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

* [~Toggle](#module_basic-controllers..Toggle)
    * [new Toggle(config)](#new_module_basic-controllers..Toggle_new)
    * [.value](#module_basic-controllers..Toggle+value) : <code>Boolean</code>
    * [.active](#module_basic-controllers..Toggle+active) : <code>Boolean</code>


-

<a name="new_module_basic-controllers..Toggle_new"></a>

#### new Toggle(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| config.label | <code>String</code> |  | Label of the controller. |
| [config.active] | <code>Array</code> | <code>false</code> | Default state of the toggle. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |
| [config.callback] | <code>function</code> | <code></code> | Callback to be executed when the  value changes. |

**Example**  
```js
import * as controllers from 'basic-controllers';

const toggle = new controllers.Toggle({
  label: 'My Toggle',
  active: false,
  container: '#container',
  callback: (active) => console.log(active),
});
```

-

<a name="module_basic-controllers..Toggle+value"></a>

#### toggle.value : <code>Boolean</code>
Value of the toggle

**Kind**: instance property of <code>[Toggle](#module_basic-controllers..Toggle)</code>  

-

<a name="module_basic-controllers..Toggle+active"></a>

#### toggle.active : <code>Boolean</code>
Alias for `value`.

**Kind**: instance property of <code>[Toggle](#module_basic-controllers..Toggle)</code>  

-

<a name="module_basic-controllers..TriggerButtons"></a>

### basic-controllers~TriggerButtons
List of buttons without state.

**Kind**: inner class of <code>[basic-controllers](#module_basic-controllers)</code>  

* [~TriggerButtons](#module_basic-controllers..TriggerButtons)
    * [new TriggerButtons(config)](#new_module_basic-controllers..TriggerButtons_new)
    * [.value](#module_basic-controllers..TriggerButtons+value) : <code>String</code>
    * [.index](#module_basic-controllers..TriggerButtons+index) : <code>String</code>


-

<a name="new_module_basic-controllers..TriggerButtons_new"></a>

#### new TriggerButtons(config)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Override default parameters. |
| config.label | <code>String</code> |  | Label of the controller. |
| [config.options] | <code>Array</code> | <code></code> | Options for each button. |
| [config.container] | <code>String</code> &#124; <code>Element</code> &#124; <code>basic-controller~Group</code> | <code></code> | Container of the controller. |
| [config.callback] | <code>function</code> | <code></code> | Callback to be executed when the  value changes. |

**Example**  
```js
import * as controllers from 'basic-controllers';

const triggerButtons = new controllers.TriggerButtons({
  label: 'My Trigger Buttons',
  options: ['value 1', 'value 2', 'value 3'],
  container: '#container',
  callback: (value, index) => console.log(value, index),
});
```

-

<a name="module_basic-controllers..TriggerButtons+value"></a>

#### triggerButtons.value : <code>String</code>
Last triggered button value.

**Kind**: instance property of <code>[TriggerButtons](#module_basic-controllers..TriggerButtons)</code>  
**Read only**: true  

-

<a name="module_basic-controllers..TriggerButtons+index"></a>

#### triggerButtons.index : <code>String</code>
Last triggered button index.

**Kind**: instance property of <code>[TriggerButtons](#module_basic-controllers..TriggerButtons)</code>  
**Read only**: true  

-



## License

BSD-3-Clause

