'use client';

import { supabase } from './supabase';

interface ContentArrangement {
  id: string;
  category: string;
  type: 'doc' | 'tutorial';
  order: string[];
  updated_at: string;
}

export async function saveContentArrangement(
  category: string,
  type: 'doc' | 'tutorial',
  order: string[]
) {
  const { data: existingArrangement } = await supabase
    .from('content_arrangements')
    .select()
    .eq('category', category)
    .eq('type', type)
    .single();

  if (existingArrangement) {
    const { error } = await supabase
      .from('content_arrangements')
      .update({ order, updated_at: new Date().toISOString() })
      .eq('id', existingArrangement.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('content_arrangements')
      .insert([
        {
          category,
          type,
          order,
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
  }
}

export async function getContentArrangement(
  category: string,
  type: 'doc' | 'tutorial'
): Promise<string[]> {
  const { data: arrangement, error } = await supabase
    .from('content_arrangements')
    .select('order')
    .eq('category', category)
    .eq('type', type)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No arrangement found
      return [];
    }
    throw error;
  }

  return arrangement.order;
}

export async function applyContentArrangement<T extends { id: string }>(
  items: T[],
  category: string,
  type: 'doc' | 'tutorial'
): Promise<T[]> {
  const order = await getContentArrangement(category, type);
  
  if (order.length === 0) {
    return items;
  }

  // Create a map of id to item for efficient lookup
  const itemMap = new Map(items.map(item => [item.id, item]));
  
  // First, add all items that are in the order array
  const arranged = order
    .map(id => itemMap.get(id))
    .filter((item): item is T => item !== undefined);

  // Then add any remaining items that weren't in the order array
  const remainingItems = items.filter(item => !order.includes(item.id));
  
  return [...arranged, ...remainingItems];
} 