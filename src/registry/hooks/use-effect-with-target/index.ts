import { useEffect } from 'react'
import { createEffectWithTarget } from '@/registry/lib/create-effect-with-target'

export const useEffectWithTarget = createEffectWithTarget(useEffect)
