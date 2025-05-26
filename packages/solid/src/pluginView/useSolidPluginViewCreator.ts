import type { PluginViewSpec } from '@prosemirror-adapter/core'
import type { SolidRendererResult } from '../SolidRenderer'
import type { SolidPluginViewUserOptions } from './SolidPluginViewOptions'
import { SolidPluginView } from './SolidPluginView'

export function useSolidPluginViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) { // pluginViewFactory真正实现函数
  const createSolidPluginView = (
    options: SolidPluginViewUserOptions,
  ): PluginViewSpec => {
    return (view) => {
      const pluginView = new SolidPluginView({
        view,
        options: {
          ...options,
          update: (view, prevState) => {
            options.update?.(view, prevState)// 如果options中有更新函数，则执行
            pluginView.updateContext()// 更新PluginView的Context
          },
          destroy: () => {
            options.destroy?.()
            removeSolidRenderer(pluginView) // 删除视图
          },
        },
      })

      renderSolidRenderer(pluginView)

      return pluginView
    }
  }

  return createSolidPluginView
}
