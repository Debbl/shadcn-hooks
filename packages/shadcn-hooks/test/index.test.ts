import { assert, describe, it } from 'vitest'

function add(a: number, b: number) {
  return a + b
}

describe('add', () => {
  it('adds two numbers', () => {
    assert.equal(add(1, 2), 3)
  })
})
