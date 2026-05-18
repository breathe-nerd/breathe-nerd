import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import app from '../server.js'
import { supabase } from '../db/supabaseClient.js'

describe('POST /auth/signup', () => {
  beforeEach(async () => {
    await supabase.from('users').delete().eq('email', 'testuser@test.com')
  })

  afterEach(async () => {
    await supabase.from('users').delete().eq('email', 'testuser@test.com')
  })

  it('should return 201 with user object on valid signup', async () => {
    const res = await request(app) 
    .post('/auth/signup')
    .send({
      email: 'testuser@test.com',
      password: 'password123',
      name: 'Test User'
    })
  
    expect(res.status).toBe(201)
    expect(res.body.user).toBeDefined()
    expect(res.body.user.email).toBe('testuser@test.com')
    // NOTE: this test currently fails due to a column name mismatch in auth.ts
    // Adel's insert uses 'password' but the Supabase column is 'password_hash'
    // Test will pass once that is fixed
    expect(res.body.user.password_hash).toBeUndefined()
    expect(res.body.user.name).toBe('Test User')
  })

  it('should return a 400 when required feilds are missing', async () => {
    const res = await request(app) 
    .post('/auth/signup')
    .send({
      email: 'testuser@test.com'
    })

    expect(res.status).toBe(400)
  })

  it('should return a 409 when user already exsists', async () => {
    const res = await request(app) 
    .post('/auth/signup')
    .send({
      email: 'testuser@test.com',
      password: 'password123',
      name: 'Test User'
    })

    const attempt = await request(app) 
    .post('/auth/signup')
    .send({
      email: 'testuser@test.com',
      password: 'password123',
      name: 'Test User'
    })

    expect(attempt.status).toBe(409)
  })

  it('should not return a passwaord_hash in res object', async () =>{
    const res = await request(app) 
    .post('/auth/signup')
    .send({
      email: 'testuser@test.com',
      password: 'password123',
      name: 'Test User'
    })

    expect(res.body.user.password_hash).toBeUndefined()
    expect(res.body.user.password).toBeUndefined()
  })
})