# GUI-Components

> Set of simple gui components (to be extended)

## Install

```
npm install [--save] ircam-jstools/gui-components
```

## Available Components

- Slider - [example](https://cdn.rawgit.com/ircam-jstools/gui-components/master/examples/slider/index.html)

## Usage

```js
import { Slider} from 'gui-components';

const slider = new Slider({
  mode: 'jump',
  container: '#container',
  default: 0.6,
  markers: [0.5],
  callback: (value) => console.log(value),
});
```

# API

<a name="module_gui-components"></a>

## gui-components

* [gui-components](#module_gui-components)
    * [~Slider](#module_gui-components..Slider)
        * [new Slider(options)](#new_module_gui-components..Slider_new)
        * [.value](#module_gui-components..Slider+value) : <code>Number</code>
        * [.reset()](#module_gui-components..Slider+reset)
        * [.resize(width, height)](#module_gui-components..Slider+resize)

<a name="module_gui-components..Slider"></a>

### gui-components~Slider
Versatile canvas based slider.

**Kind**: inner class of <code>[gui-components](#module_gui-components)</code>  

* [~Slider](#module_gui-components..Slider)
    * [new Slider(options)](#new_module_gui-components..Slider_new)
    * [.value](#module_gui-components..Slider+value) : <code>Number</code>
    * [.reset()](#module_gui-components..Slider+reset)
    * [.resize(width, height)](#module_gui-components..Slider+resize)

<a name="new_module_gui-components..Slider_new"></a>

#### new Slider(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Override default parameters. |
| [options.mode] | <code>&#x27;jump&#x27;</code> &#124; <code>&#x27;proportionnal&#x27;</code> &#124; <code>&#x27;handle&#x27;</code> | <code>&#x27;jump&#x27;</code> | Mode of the slider:  - in 'jump' mode, the value is changed on 'touchstart' or 'mousedown', and    on move.  - in 'proportionnal' mode, the value is updated relatively to move.  - in 'handle' mode, the slider can be grabbed only around its value. |
| [options.callback] | <code>function</code> |  | Callback to be executed when the value  of the slider changes. |
| [options.width] | <code>Number</code> | <code>200</code> | Width of the slider. |
| [options.height] | <code>Number</code> | <code>30</code> | Height of the slider. |
| [options.min] | <code>Number</code> | <code>0</code> | Minimum value. |
| [options.max] | <code>Number</code> | <code>1</code> | Maximum value. |
| [options.step] | <code>Number</code> | <code>0.01</code> | Step between each consecutive values. |
| [options.default] | <code>Number</code> | <code>0</code> | Default value. |
| [options.container] | <code>String</code> &#124; <code>Element</code> | <code>&#x27;body&#x27;</code> | CSS Selector or DOM  element in which inserting the slider. |
| [options.backgroundColor] | <code>String</code> | <code>&#x27;#464646&#x27;</code> | Background color of the  slider. |
| [options.foregroundColor] | <code>String</code> | <code>&#x27;steelblue&#x27;</code> | Foreground color of  the slider. |
| [options.orientation] | <code>&#x27;horizontal&#x27;</code> &#124; <code>&#x27;vertical&#x27;</code> | <code>&#x27;horizontal&#x27;</code> | Orientation of the slider. |
| [options.markers] | <code>Array</code> | <code>[]</code> | List of values where markers should  be displayed on the slider. |
| [options.showHandle] | <code>Boolean</code> | <code>true</code> | In 'handle' mode, define if the  draggable should be show or not. |
| [options.handleSize] | <code>Number</code> | <code>20</code> | Size of the draggable zone. |
| [options.handleColor] | <code>String</code> | <code>&#x27;rgba(255, 255, 255, 0.7)&#x27;</code> | Color of the  draggable zone (when `showHandle` is `true`). |

**Example**  
```js
import { Slider} from 'gui-components';

const slider = new Slider({
  mode: 'jump',
  container: '#container',
  default: 0.6,
  markers: [0.5],
  callback: (value) => console.log(value),
});
```
<a name="module_gui-components..Slider+value"></a>

#### slider.value : <code>Number</code>
Current value of the slider.

**Kind**: instance property of <code>[Slider](#module_gui-components..Slider)</code>  
<a name="module_gui-components..Slider+reset"></a>

#### slider.reset()
Reset the slider to its default value.

**Kind**: instance method of <code>[Slider](#module_gui-components..Slider)</code>  
<a name="module_gui-components..Slider+resize"></a>

#### slider.resize(width, height)
Resize the slider.

**Kind**: instance method of <code>[Slider](#module_gui-components..Slider)</code>  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | New width of the slider. |
| height | <code>Number</code> | New height of the slider. |



## License

BSD-3-Clause

