import { env } from '@/config/env'
import { Cradle, createContainer } from '@/createContainer'
import { RafikiService } from '@/rafiki/service'
import { Knex } from 'knex'
import { TestApp, createApp } from '../app'
import { truncateTables } from '../tables'
import { mockOutgoingPaymentCreatedEvent } from '../mocks'
import { AwilixContainer } from 'awilix'

describe('Rafiki Service', () => {
  let bindings: AwilixContainer<Cradle>
  let knex: Knex
  let rafikiService: RafikiService
  let appContainer: TestApp

  beforeAll(async (): Promise<void> => {
    bindings = await createContainer(env)
    appContainer = await createApp(bindings)
    knex = appContainer.knex
    rafikiService = await bindings.resolve('rafikiService')
  })

  afterAll(async (): Promise<void> => {
    appContainer.stop()
    knex.destroy()
  })

  afterEach(async (): Promise<void> => {
    await truncateTables(knex)
  })

  describe('OnWebHook', () => {
    it('should throw an error if the paymentPointer is invalid', async () => {
      const webHook = mockOutgoingPaymentCreatedEvent({})

      await expect(rafikiService.onWebHook(webHook)).rejects.toThrowError(
        /Invalid payment pointer/
      )
    })

    // TODO - Fix the typescript checking error to create te test case for unknow event type
    /* it('should throw an error unknow event type mock-event', async () => {
      // eslint-disable-next-line no-use-before-define
      const webHook = mockOutgoingPaymenteCreatedEvent({type: "mock-event"})

      await expect(rafikiService.onWebHook(webHook)).rejects.toThrowError(
        /unknow event type mock-event/
      )
    })
  */
  })
})
