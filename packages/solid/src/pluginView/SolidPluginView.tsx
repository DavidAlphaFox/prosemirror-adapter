import type { CorePluginViewSpec } from '@prosemirror-adapter/core'
import type { JSX, Setter } from 'solid-js'
import type { SolidRenderer } from '../SolidRenderer'
import type {
  PluginViewContext,
  PluginViewContextProps,
} from './pluginViewContext'
import type { SolidPluginViewComponent } from './SolidPluginViewOptions'

import { CorePluginView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { createSignal } from 'solid-js'
import { Dynamic, Portal } from 'solid-js/web'
import { hidePortalDiv } from '../utils/hidePortalDiv'
import { pluginViewContext } from './pluginViewContext'

export class SolidPluginView
  extends CorePluginView<SolidPluginViewComponent>
  implements SolidRenderer<PluginViewContext> {
  key: string = nanoid() // Key是一个随机的nanoid

  context: PluginViewContext // 上下文

  private setContext: Setter<PluginViewContextProps>

  constructor(spec: CorePluginViewSpec<SolidPluginViewComponent>) {
    super(spec)
    const [context, setContext] = createSignal<PluginViewContextProps>({
      view: this.view,
      prevState: this.prevState,
    })
    this.context = context
    this.setContext = setContext
  }

  updateContext = () => {
    this.setContext(() => ({
      view: this.view,
      prevState: this.prevState,
    })) //设置当前Plugin的上下文
  }

  // 组件的渲染函数
  render = (): JSX.Element => {
    const UserComponent = this.component // 得到真正的Component
    // 此处会用PluginViewContext为组件提供上下文
    // 用来获取ProseMirror编辑器视图和前一次的状态
    //ref回调函数（在连接到 DOM 之前调用），会将得到HTMLEment的display进行变更
    return (
      <Portal mount={this.root} ref={el => hidePortalDiv(el)}>
        <pluginViewContext.Provider value={this.context}>
          <Dynamic component={UserComponent} />
        </pluginViewContext.Provider>
      </Portal>
    )
  }
}
