const globalVue = require('vue/dist/vue.js')
import { VueQuery } from '../types'
import $ from '../src/vuequery'

describe('VueQuery', () => {
  let $vm: VueQuery

  beforeEach(() => {
    $vm = $(
      new globalVue({
        el: document.createElement('div'),
        template: '<div><qux/></div>',
      }).$mount()
    ) as VueQuery
  })

  describe('common', () => {
    it('doesnt init on a VueQuery instance', () => {
      expect($($vm)).toBe($vm)
    })
  })

  describe('children()', () => {
    it('matches existing children', () => {
      expect($vm.children()).toHaveLength(1) // <qux/>
      expect($vm.children()[0].children()).toHaveLength(4) // <baz/><noop/><baz/><baz/>
    })

    it('does not match non-existing children', () => {
      expect($vm.children('cuckoo')).toHaveLength(0)
    })
  })

  describe('find()', () => {
    it('finds direct descendants', () => {
      expect($vm.find('qux')).toHaveLength(1)
    })

    it('finds distant descendants', () => {
      expect($vm.find('bar')).toHaveLength(3)
    })

    it('doesnt find non-existing name', () => {
      expect($vm.find('cuckoo')).toHaveLength(0)
    })
  })

  describe('closest()', () => {
    it('finds closest to be self', () => {
      expect($vm.find('qux')[0].closest('qux')!.is('qux')).toBe(true)
    })

    it('finds closest to be parent', () => {
      expect($vm.find('foo')[0].closest('bar')!.is('bar')).toBe(true)
    })

    it('finds closest to be ancestor', () => {
      expect($vm.find('foo')[0].closest('qux')!.is('qux')).toBe(true)
    })

    it('doesnt find invalid closest', () => {
      expect($vm.find('foo')[0].closest('cuckoo')).toBeNull()
    })
  })

  describe('has()', () => {
    it('has direct descendant', () => {
      expect($vm.has('qux')).toBe(true)
    })

    it('has distant descendant', () => {
      expect($vm.has('bar')).toBe(true)
    })

    it('doesnt have invalid descendant', () => {
      expect($vm.has('cuckoo')).toBe(false)
    })
  })

  describe('is()', () => {
    it('is itself', () => {
      expect($vm.is($vm)).toBe(true)
    })

    it('is of a name', () => {
      expect($vm.find('qux')[0].is('qux')).toBe(true)
    })
  })

  describe('next()', () => {
    it('finds next without name', () => {
      expect($vm.find('baz')[0].next()!.is('noop')).toBe(true)
    })

    it('finds next with name', () => {
      expect($vm.find('baz')[0].next('noop')!.is('noop')).toBe(true)
    })

    it('doesnt find next with invalid name', () => {
      expect($vm.find('baz')[0].next('baz')).toBeNull()
    })

    it('doesnt find next at end', () => {
      expect($vm.find('baz')[2].next()).toBeNull()
    })

    it('doesnt find next with invalid name', () => {
      expect($vm.find('baz')[0].next('cuckoo')).toBeNull()
    })
  })

  describe('nextAll()', () => {
    it('finds all next without name', () => {
      const collected = $vm.find('baz')[0].nextAll()
      expect(collected).toHaveLength(3)
      expect(collected[0].is('noop')).toBe(true)
      expect(collected[1].is('baz')).toBe(true)
      expect(collected[2].is('baz')).toBe(true)
    })

    it('finds all next with name', () => {
      const collected = $vm.find('baz')[0].nextAll('baz')
      expect(collected).toHaveLength(2)
      expect(collected[0].is('baz')).toBe(true)
      expect(collected[1].is('baz')).toBe(true)
    })

    it('doesnt find any next with invalid name', () => {
      const collected = $vm.find('baz')[0].nextAll('cuckoo')
      expect(collected).toHaveLength(0)
    })
  })

  describe('nextUntil()', () => {
    it('finds all next until', () => {
      const collected = $vm.find('baz')[0].nextUntil('baz')
      expect(collected).toHaveLength(1)
      expect(collected[0].is('noop')).toBe(true)
    })

    it('finds no next until', () => {
      expect($vm.find('baz')[0].nextUntil('baz', 'baz')).toHaveLength(0)
    })
  })

  describe('parent()', () => {
    it('finds parent', () => {
      expect($vm.find('baz')[0].parent()!.is('qux'))
    })

    it('finds parent with name specified', () => {
      expect($vm.find('baz')[0].parent('qux')!.is('qux')).toBe(true)
    })

    it('doesnt find parent with invalid name specified', () => {
      expect($vm.find('baz')[0].parent('cuckoo')).toBeNull()
    })

    it('doesnt find parent of root', () => {
      expect($vm.parent()).toBeNull()
    })
  })

  describe('parents()', () => {
    it('finds direct parents', () => {
      const parents = $vm.find('foo')[0].parents('bar')
      expect(parents).toHaveLength(1)
      expect(parents[0].is('bar')).toBe(true)
    })

    it('finds distant parents', () => {
      const parents = $vm.find('foo')[0].parents('baz')
      expect(parents).toHaveLength(1)
      expect(parents[0].is('baz')).toBe(true)
    })

    it('find parents without name specified', () => {
      const parents = $vm.find('foo')[0].parents()
      expect(parents).toHaveLength(4)
      expect(parents[0].is('bar')).toBe(true)
      expect(parents[1].is('baz')).toBe(true)
      expect(parents[2].is('qux')).toBe(true)
      expect(parents[3].vm === parents[3].vm.$root).toBe(true)
    })

    it('doesnt find parents with invalid name specified', () => {
      expect($vm.find('baz')[0].parents('cuckoo')).toHaveLength(0)
    })

    it('doesnt find parents of root', () => {
      expect($vm.parents()).toHaveLength(0)
    })
  })

  describe('parentsUntil()', () => {
    it('finds parents until', () => {
      const parents = $vm.find('foo')[0].parentsUntil('qux')
      expect(parents).toHaveLength(2)
      expect(parents[0].is('bar')).toBe(true)
      expect(parents[1].is('baz')).toBe(true)
    })

    it('doesnt finds parents of root', () => {
      expect($vm.parentsUntil()).toHaveLength(0)
    })
  })

  describe('prev()', () => {
    it('finds prev without name', () => {
      expect($vm.find('baz')[1].prev()!.is('noop')).toBe(true)
    })

    it('finds prev with name', () => {
      expect($vm.find('baz')[1].prev('noop')!.is('noop')).toBe(true)
    })

    it('doesnt find prev with invalid name', () => {
      expect($vm.find('baz')[1].prev('baz')).toBeNull()
    })

    it('doesnt find prev at beginning', () => {
      expect($vm.find('baz')[0].prev()).toBeNull()
    })

    it('doesnt find prev with invalid name', () => {
      expect($vm.find('baz')[1].prev('cuckoo')).toBeNull()
    })
  })

  describe('prevAll()', () => {
    it('finds all prev without name', () => {
      const collected = $vm.find('baz')[2].prevAll()
      expect(collected).toHaveLength(3)
      expect(collected[0].is('baz')).toBe(true)
      expect(collected[1].is('noop')).toBe(true)
      expect(collected[2].is('baz')).toBe(true)
    })

    it('finds all prev with name', () => {
      const collected = $vm.find('baz')[2].prevAll('baz')
      expect(collected).toHaveLength(2)
      expect(collected[0].is('baz')).toBe(true)
      expect(collected[1].is('baz')).toBe(true)
    })

    it('doesnt find any prev with invalid name', () => {
      expect($vm.find('baz')[2].prevAll('cuckoo')).toHaveLength(0)
    })
  })

  describe('prevUntil()', () => {
    it('finds all prev until', () => {
      const collected = $vm.find('baz')[1].prevUntil('baz')
      expect(collected).toHaveLength(1)
      expect(collected[0].is('noop')).toBe(true)
    })

    it('finds no prev until', () => {
      expect($vm.find('baz')[1].nextUntil('baz', 'baz')).toHaveLength(0)
    })
  })

  describe('siblings()', () => {
    it('finds all siblings', () => {
      const me = $vm.find('baz')[1]
      const collected = me.siblings()
      expect(collected).toHaveLength(3)
      expect(collected).not.toContain(me)
    })
  })
})
