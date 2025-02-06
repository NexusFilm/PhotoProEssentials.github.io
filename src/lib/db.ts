'use client';

import { supabase } from './supabase';
import { Database } from './database.types';

type Document = Database['public']['Tables']['documents']['Row'];
type Tutorial = Database['public']['Tables']['tutorials']['Row'];

// Document functions
export async function createDocument(data: Omit<Document, 'id' | 'created_at' | 'updated_at'>) {
  const { data: document, error } = await supabase
    .from('documents')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return document;
}

export async function updateDocument(id: string, data: Partial<Document>) {
  const { data: document, error } = await supabase
    .from('documents')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return document;
}

export async function deleteDocument(id: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getDocuments() {
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return documents;
}

export async function getDocumentsByCategory(category: string) {
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return documents;
}

// Tutorial functions
export async function createTutorial(data: Omit<Tutorial, 'id' | 'created_at' | 'updated_at'>) {
  const { data: tutorial, error } = await supabase
    .from('tutorials')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return tutorial;
}

export async function updateTutorial(id: string, data: Partial<Tutorial>) {
  const { data: tutorial, error } = await supabase
    .from('tutorials')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return tutorial;
}

export async function deleteTutorial(id: string) {
  const { error } = await supabase
    .from('tutorials')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getTutorials() {
  const { data: tutorials, error } = await supabase
    .from('tutorials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return tutorials;
}

export async function getTutorialsByCategory(category: string) {
  const { data: tutorials, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return tutorials;
}

// Storage functions
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;
  return data;
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

// Metadata extraction functions
export async function extractYouTubeMetadata(url: string) {
  // Extract video ID from URL
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/)?.[1];
  
  if (!videoId) throw new Error('Invalid YouTube URL');

  // Fetch video metadata from YouTube oEmbed API
  const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
  const data = await response.json();

  return {
    title: data.title,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: '00:00', // YouTube oEmbed doesn't provide duration
    description: data.description || ''
  };
}

export async function extractLinkMetadata(url: string) {
  // You might want to use a service like LinkPreview API or similar
  // For now, we'll return basic metadata
  return {
    title: url.split('/').pop() || url,
    description: '',
    thumbnailUrl: ''
  };
}

interface FeaturedContent {
  id: string;
  type: 'tutorial' | 'document';
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
  category: string;
}

export async function getFeaturedContent(): Promise<FeaturedContent[]> {
  const { data: featured, error } = await supabase
    .from('featured_content')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return featured;
}

export async function addToFeatured(content: Omit<FeaturedContent, 'id'>) {
  const { data, error } = await supabase
    .from('featured_content')
    .insert([content])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromFeatured(id: string) {
  const { error } = await supabase
    .from('featured_content')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 