import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import app from '../server.js'
import { supabase } from '../db/supabaseClient.js'

describe('isAuthenticated middleware', async () => {
  beforeEach(async () => {
    await supabase.from('users').delete().eq('email', 'testuser@test.com')
  })

  afterEach(async () => {
    await supabase.from('users').delete().eq('email', 'testuser@test.com')
  })

  it('should return 200 with valid user object', async () => {
    const agent = request.agent(app)

    await agent.post('/auth/signup')
    .send({
      email: 'testuser@test.com',
      password: 'password123',
      name: 'Test User'
    })

    const res = await agent.get('/test-protected')

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('authenticated')
  })

  it('should return 401 not authenticated user', async () => {
    const res = await request(app).get('/test-protected')

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Not authenticated')
  })
})