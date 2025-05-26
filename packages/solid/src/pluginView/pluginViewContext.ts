import type { PluginViewSpec } from '@prosemirror-adapter/core'
import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { SolidPluginViewUserOptions } from './SolidPluginViewOptions'
import { type Accessor, createContext, useContext } from 'solid-js'

export type PluginViewContentRef = (element: HTMLElement | null) => void

export interface PluginViewContextProps {
  view: EditorView // prosemirror的编辑器视图
  prevState?: EditorState // 前一次的编辑器状态
}

export type PluginViewContext = Accessor<PluginViewContextProps>
// 创建一个SolidJS的Context
export const pluginViewContext = createContext<PluginViewContext>(() => ({
  view: null as never,
}))

export const usePluginViewContext = () => useContext(pluginViewContext)

export const createPluginViewContext = createContext<
  (options: SolidPluginViewUserOptions) => PluginViewSpec
>((_options) => {
      throw new Error('out of scope')
    })
// 创建PluginView的工厂的Context用于全局获取创建工厂函数
export const usePluginViewFactory = () => useContext(createPluginViewContext)
