import type { EditorState, PluginView } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { CorePluginViewSpec, CorePluginViewUserOptions } from './CorePluginViewOptions'

export class CorePluginView<ComponentType> implements PluginView {
  view: EditorView
  prevState?: EditorState
  options: CorePluginViewUserOptions<ComponentType>

  constructor(spec: CorePluginViewSpec<ComponentType>) {
    this.view = spec.view
    this.options = spec.options
  }

  get component() {
    return this.options.component
  }

  get root() {
    let root = this.options.root?.(this.view.dom)
    // 如果没有root，就直接使用DOM的父元素或者HTML文档的body元素
    if (!root)
      root = this.view.dom.parentElement ?? document.body

    return root
  }

  update(view: EditorView, prevState: EditorState) {
    this.view = view // 视图
    this.prevState = prevState // 更新前的状态
    this.options.update?.(view, prevState) // 进行更新
  }

  destroy(): void {
    this.options.destroy?.()
  }
}
