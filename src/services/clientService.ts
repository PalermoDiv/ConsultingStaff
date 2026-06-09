import { supabase } from './supabase'
import type { Client } from '../types/completetypes'

// ==========================================
// 1. LIST
// ==========================================

export async function getAllClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('client_name', { ascending: true })

  if (error) {
    console.error('Error fetching clients:', error)
    throw new Error('Failed to fetch clients')
  }

  return data as Client[]
}

// ==========================================
// 2. GET ONE
// ==========================================

export async function getClientById(id: string): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('client_id', id)
    .single()

  if (error) {
    console.error('Error fetching client:', error)
    if (error.code === 'PGRST116') throw new Error('Client not found')
    throw new Error('Failed to fetch client')
  }

  if (!data) throw new Error('Client not found')
  return data as Client
}

// ==========================================
// 3. CREATE
// ==========================================

export async function createClient(
  client: Omit<Client, 'client_id' | 'created_at' | 'updated_at'>
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single()

  if (error) {
    console.error('Error creating client:', error)
    throw new Error('Failed to create client')
  }

  return data as Client
}

// ==========================================
// 4. UPDATE
// ==========================================

export async function updateClient(
  id: string,
  updates: Partial<Client>
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('client_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating client:', error)
    if (error.code === 'PGRST116') throw new Error('Client not found')
    throw new Error('Failed to update client')
  }

  return data as Client
}

// ==========================================
// 5. DELETE
// ==========================================

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('client_id', id)

  if (error) {
    console.error('Error deleting client:', error)
    throw new Error('Failed to delete client')
  }
}
