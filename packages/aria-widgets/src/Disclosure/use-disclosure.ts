import { provide, inject, InjectionKey, Ref } from 'vue'
import { useIdGenerator } from 'vue-aria-composables'

export interface DisclosureAPI extends Record<string, any> {
  show: Ref<boolean>
  id: string
}
export type DisclosureAPIKey = InjectionKey<DisclosureAPI>
export const disclosureAPIKey = Symbol('disclosure') as DisclosureAPIKey

export function useDisclosure(
  show: Ref<boolean>,
  { skipProvide }: { skipProvide?: boolean } = {}
) {
  const id = useIdGenerator()('disclosure')

  !skipProvide &&
    provide(disclosureAPIKey, {
      show,
      id,
    })

  return {
    show,
    id,
  }
}

export function injectDisclosureAPI(key: DisclosureAPIKey = disclosureAPIKey) {
  const context = inject(key)
  if (!context) {
    throw new Error('Disclosure: useDisclosure() not called in parent')
  }
  return context
}
