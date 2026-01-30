import { useRef, useState } from 'react'
import { useEffectWithTarget } from '~/hooks/use-effect-with-target'
import { getTargetElement } from '~/lib/create-effect-with-target'
import type { BasicTarget } from '~/lib/create-effect-with-target'

interface Rect {
  top: number
  left: number
  bottom: number
  right: number
  height: number
  width: number
}
export interface State extends Rect {
  text: string
}

const initRect: Rect = {
  top: Number.NaN,
  left: Number.NaN,
  bottom: Number.NaN,
  right: Number.NaN,
  height: Number.NaN,
  width: Number.NaN,
}

const initState: State = {
  text: '',
  ...initRect,
}

function getRectFromSelection(selection: Selection | null): Rect {
  if (!selection) {
    return initRect
  }

  if (selection.rangeCount < 1) {
    return initRect
  }
  const range = selection.getRangeAt(0)
  const { height, width, top, left, right, bottom } =
    range.getBoundingClientRect()
  return {
    height,
    width,
    top,
    left,
    right,
    bottom,
  }
}

export function useTextSelection(
  target?: BasicTarget<Document | Element>,
): State {
  const [state, setState] = useState(initState)

  const stateRef = useRef(state)
  const isInRangeRef = useRef(false)
  stateRef.current = state

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target, document)
      if (!el) {
        return
      }

      const mouseupHandler = () => {
        let selObj: Selection | null = null
        let text = ''
        let rect = initRect
        if (!window.getSelection) {
          return
        }
        selObj = window.getSelection()
        text = selObj ? selObj.toString() : ''
        if (text && isInRangeRef.current) {
          rect = getRectFromSelection(selObj)
          setState({ ...state, text, ...rect })
        }
      }

      // clear the previous range on any click
      const mousedownHandler = (e: MouseEvent) => {
        // 如果是鼠标右键需要跳过 这样选中的数据就不会被清空
        if (e.button === 2) {
          return
        }
        if (!window.getSelection) {
          return
        }
        if (stateRef.current.text) {
          setState({ ...initState })
        }
        isInRangeRef.current = false
        const selObj = window.getSelection()
        if (!selObj) {
          return
        }
        selObj.removeAllRanges()
        isInRangeRef.current = el.contains(e.target as Node)
      }

      el.addEventListener('mouseup', mouseupHandler)

      document.addEventListener('mousedown', mousedownHandler)

      return () => {
        el.removeEventListener('mouseup', mouseupHandler)
        document.removeEventListener('mousedown', mousedownHandler)
      }
    },
    [],
    target,
  )

  return state
}
