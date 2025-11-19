import { useEffect } from 'react'
import { createEffectWithTarget } from '~/lib/create-effect-with-target'

export const useEffectWithTarget = createEffectWithTarget(useEffect)
