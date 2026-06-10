import { supabase } from './supabase'
import type { Client } from '../types/completetypes'

// ---- Do a function to get all the clients -----
export async function getAllClients(includeInactive = false): Promise<Client[]> {
  let query = supabase
    .from('clients')
    .select('*')
    .order('client_name', { ascending: true })
  
  if (!includeInactive) {
    query = query.eq('is_active', true)
  }
  
  const { data, error } = await query
  if (error) {
    console.error('Error fetching the clients:', error);
    throw new Error('Failed to fetch clients');
  }
  return data as Client[];
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
// 5. SOFT DELETE (Deactivate - safer than hard delete)
// ==========================================

export async function deactivateClient(id: string): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('client_id', id)
    .select()
    .single()

  if (error) {
    console.error('Error deactivating client:', error)
    throw new Error('Failed to deactivate client')
  }

  return data as Client
}

// ==========================================
// 6. HARD DELETE (Only for admin use - dangerous!)
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
