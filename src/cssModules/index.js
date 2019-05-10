// 每个组件都要引入进来
import icons from './icons'
// box
import box from './block/box'
import box2 from './block/box2'
import warning from './block/warning'
// list
import list from './lists/list'
import listItem from './lists/list-item'
import listBank from './lists/list-bank'
// public
import btn from './public/btn'
import btnGroup from './public/btn-group'

var cssModules = []

cssModules = cssModules.concat(icons, box, box2, list, listItem, listBank, warning, btn, btnGroup)

export default cssModules
