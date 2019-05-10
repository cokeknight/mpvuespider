/**
 * Created by xuxin on 16/4/26.
 */
import cssModules from '../cssModules'
import titlebar from 'titlebar'

var global = []

global = global.concat(cssModules, titlebar)

export default {
  install: function (vue) {
    global.forEach(function (m) {
      vue.component(m.name, m)
    })
  }
}
