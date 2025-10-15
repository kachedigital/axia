-- Policy 1: Allow anonymous users to read/download PDF files
CREATE POLICY "Public read PDF documents"
ON storage.objects FOR SELECT USING (
  -- restrict to pdf-documents bucket
  bucket_id = 'pdf-documents'
  -- allow access to PDF files only
  AND storage."extension"(name) = 'pdf'
  -- allow anonymous users to read
  AND auth.role() = 'anon'
);

-- Policy 2: Allow authenticated users to upload PDF files
CREATE POLICY "Authenticated upload PDF documents"
ON storage.objects FOR INSERT WITH CHECK (
  -- restrict to pdf-documents bucket
  bucket_id = 'pdf-documents'
  -- allow PDF files only
  AND storage."extension"(name) = 'pdf'
  -- only authenticated users can upload
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow users to update their own PDF files
CREATE POLICY "Users update own PDF documents"
ON storage.objects FOR UPDATE USING (
  bucket_id = 'pdf-documents'
  AND storage."extension"(name) = 'pdf'
  AND auth.uid() = owner
) WITH CHECK (
  bucket_id = 'pdf-documents'
  AND storage."extension"(name) = 'pdf'
);

-- Policy 4: Allow users to delete their own PDF files
CREATE POLICY "Users delete own PDF documents"
ON storage.objects FOR DELETE USING (
  bucket_id = 'pdf-documents'
  AND storage."extension"(name) = 'pdf'
  AND auth.uid() = owner
);

-- Optional: If you want to restrict to a specific folder structure
-- CREATE POLICY "Public read PDF documents in uploads folder"
-- ON storage.objects FOR SELECT USING (
--   bucket_id = 'pdf-documents'
--   AND storage."extension"(name) = 'pdf'
--   AND LOWER((storage.foldername(name))[1]) = 'uploads'
--   AND auth.role() = 'anon'
-- );
