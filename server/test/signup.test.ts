import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../server.js'
import { supabase } from '../db/supabaseClient.js'

describe('POST /auth/signup', () => {
  beforeAll(async () => {
    await supabase.from('users').delete().eq('email', 'testuser@test.com')
  })

  afterAll(async () => {
    await supabase.from('users').delete().eq('email', 'testuser@test.com')
  })

  it('should return 201 with user object on valid signup', async () => {

  })
})