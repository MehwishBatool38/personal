import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ahegdcebnoshclkkudyy.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZWdkY2Vibm9zaGNsa2t1ZHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDI3NDgsImV4cCI6MjA5NDQxODc0OH0.ZZg-qg1uTOmgQ5fdIDVAvKXfeF4p2bj2SgDQlBNMiU8";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

/**
 * Upload an image to Supabase Storage and return its public URL
 * @param {File} file 
 * @param {string} folder optional folder name
 * @returns {Promise<string>} public URL of the uploaded image
 */
export async function uploadImage(file, folder = "uploads") {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('portfolio-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });

  if (error) {
    console.error('Upload error details:', error);
    if (error.message === 'The resource was not found') {
      throw new Error('Storage bucket "portfolio-images" not found. Please create it in your Supabase dashboard.');
    }
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
