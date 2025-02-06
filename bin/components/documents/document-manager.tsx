'use client';

import React, { useState, useEffect } from 'react';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Link as LinkIcon, 
  File, 
  Loader2, 
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import * as db from '../../lib/db';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  type: 'file' | 'link';
  url: string;
  thumbnail_url: string;
}

export function DocumentManager() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    url: '',
    file: null as File | null,
    thumbnail: null as File | null
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const docs = await db.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let url = '';
      let thumbnailUrl = '';

      if (uploadType === 'file' && formData.file) {
        // Upload file to storage
        const path = `documents/${user!.id}/${formData.file.name}`;
        await db.uploadFile('documents', path, formData.file);
        url = db.getPublicUrl('documents', path);
      } else {
        url = formData.url;
      }

      // Upload thumbnail if provided
      if (formData.thumbnail) {
        const thumbnailPath = `thumbnails/${user!.id}/${formData.thumbnail.name}`;
        await db.uploadFile('thumbnails', thumbnailPath, formData.thumbnail);
        thumbnailUrl = db.getPublicUrl('thumbnails', thumbnailPath);
      } else if (uploadType === 'link') {
        // Extract metadata for links
        const metadata = await db.extractLinkMetadata(formData.url);
        thumbnailUrl = metadata.thumbnailUrl;
      }

      const docData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        type: uploadType,
        url,
        thumbnail_url: thumbnailUrl,
        user_id: user!.id
      };

      if (selectedDoc) {
        await db.updateDocument(selectedDoc.id, docData);
      } else {
        await db.createDocument(docData);
      }

      // Reset form and reload documents
      resetForm();
      await loadDocuments();
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(doc: Document) {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    setLoading(true);
    try {
      await db.deleteDocument(doc.id);
      if (doc.type === 'file') {
        // Delete file from storage
        const path = doc.url.split('/').pop()!;
        await db.deleteFile('documents', path);
      }
      await loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(doc: Document) {
    setSelectedDoc(doc);
    setUploadType(doc.type);
    setFormData({
      title: doc.title,
      description: doc.description,
      category: doc.category,
      subcategory: doc.subcategory,
      url: doc.url,
      file: null,
      thumbnail: null
    });
    setIsEditing(true);
  }

  function resetForm() {
    setSelectedDoc(null);
    setIsEditing(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      subcategory: '',
      url: '',
      file: null,
      thumbnail: null
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {(isEditing || selectedDoc) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
            <div className="bg-card p-6 rounded-lg shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedDoc ? 'Edit Document' : 'Add Document'}
                </h3>
                <button
                  onClick={resetForm}
                  className="rounded-full p-2 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border ${
                      uploadType === 'file' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <File className="h-4 w-4" />
                    File Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('link')}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border ${
                      uploadType === 'link' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <LinkIcon className="h-4 w-4" />
                    Link
                  </button>
                </div>

                {uploadType === 'file' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">File</label>
                    <input
                      type="file"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      className="w-full"
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full p-2 rounded-md border"
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 rounded-md border"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 rounded-md border"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2 rounded-md border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subcategory</label>
                    <input
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full p-2 rounded-md border"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Thumbnail</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                    className="w-full"
                    accept="image/*"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg border hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : selectedDoc ? (
                      'Update'
                    ) : (
                      'Add'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Documents</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Document
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="relative group rounded-lg border bg-card p-4 hover:shadow-lg transition-shadow">
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(doc)}
                  className="p-2 rounded-full hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="p-2 rounded-full hover:bg-muted text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                {doc.thumbnail_url ? (
                  <img
                    src={doc.thumbnail_url}
                    alt={doc.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {doc.type === 'file' ? (
                    <File className="h-4 w-4 text-primary" />
                  ) : (
                    <LinkIcon className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {doc.category} / {doc.subcategory}
                  </span>
                </div>
                <h3 className="font-semibold line-clamp-1">{doc.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {doc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 