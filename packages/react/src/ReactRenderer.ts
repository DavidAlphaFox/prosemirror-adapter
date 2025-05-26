import type { ReactPortal } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

export interface ReactRenderer<Context> {
  key: string

  context: Context

  render: () => ReactPortal

  updateContext: () => void
}

export interface ReactRendererResult {
  readonly portals: Record<string, ReactPortal>
  readonly renderReactRenderer: (nodeView: ReactRenderer<unknown>, update?: boolean) => void
  readonly removeReactRenderer: (nodeView: ReactRenderer<unknown>) => void
}

export function useReactRenderer(): ReactRendererResult {
  const [portals, setPortals] = useState<Record<string, ReactPortal>>({})
  const mountedRef = useRef(false)
  /*
  useEffect 在组件挂载后触发。由于依赖数组为空（[]），它仅运行一次。
  requestAnimationFrame 将回调延迟到浏览器下一次重绘（此时 DOM 已更新）。这保证了 mountedRef.current = true 在组件完全渲染后执行。
  通过这种延迟，可以避免在组件尚未完成渲染时操作其状态或 DOM，确保后续操作（如动画、测量布局）的安全性。
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      mountedRef.current = true
    })
    return () => {
      mountedRef.current = false
    }
  }, [])

  const maybeFlushSync = useCallback((fn: () => void) => {
    if (mountedRef.current) //如果是已经挂载了，则需要调用同步函数
      flushSync(fn)

    else fn()
  }, [])

  const renderReactRenderer = useCallback(
    (nodeView: ReactRenderer<unknown>, update = true) => {
      maybeFlushSync(() => {
        if (update)
          nodeView.updateContext()

        setPortals(prev => ({
          ...prev,
          [nodeView.key]: nodeView.render(),
        }))
      })
    },
    [maybeFlushSync],
  )

  const removeReactRenderer = useCallback(
    (nodeView: ReactRenderer<unknown>) => {
      maybeFlushSync(() => {
        setPortals((prev) => {
          const next = { ...prev }
          delete next[nodeView.key]
          return next
        })
      })
    }, //进行同步，删除某个视图渲染后的结果
    [maybeFlushSync],
  )

  return {
    portals,
    renderReactRenderer,
    removeReactRenderer,
  } as const
}
