import type { EditorState, PluginSpec } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

export interface CorePluginViewSpec<Component> {
  view: EditorView

  options: CorePluginViewUserOptions<Component>
}

export interface CorePluginViewUserOptions<Component> {
  component: Component // 视图组件
  root?: (viewDOM: HTMLElement) => HTMLElement // 视图的挂载点
  update?: (view: EditorView, prevState: EditorState) => void
  destroy?: () => void
}

export type PluginViewSpec = Required<PluginSpec<unknown>>['view']
