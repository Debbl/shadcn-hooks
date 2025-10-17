import { Suspense } from 'react'
import { ContainerWithDemoClient } from './container-with-demo.client'
import type { ContainerWithDemoProps } from './container-with-demo.client'

export async function ContainerWithDemo({
  name,
  children,
  code = '',
}: ContainerWithDemoProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContainerWithDemoClient name={name} code={code}>
        {children}
      </ContainerWithDemoClient>
    </Suspense>
  )
}
