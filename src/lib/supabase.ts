// import { createClient } from '@supabase/supabase-js';
// import { UserProfile, TileSeller, CustomerFavorite } from '../types';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // Create Supabase client
// export const supabase = supabaseUrl && supabaseAnonKey 
//   ? createClient(supabaseUrl, supabaseAnonKey)
//   : null;

// // Helper function to check if Supabase is configured
// export const isSupabaseConfigured = () => {
//   return supabase !== null && 
//     supabaseUrl && 
//     supabaseAnonKey && 
//     supabaseUrl !== 'your_supabase_project_url' && 
//     supabaseAnonKey !== 'your_supabase_anon_key';
// };

// // Analytics functions
// export const trackTileView = async (tileId: string, showroomId: string) => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Tile view tracking skipped.');
//     return;
//   }
  
//   try {
//     const { error } = await supabase
//       .from('tile_analytics')
//       .insert({
//         tile_id: tileId,
//         showroom_id: showroomId,
//         action_type: 'view',
//         timestamp: new Date().toISOString()
//       });
    
//     if (error) console.error('Error tracking tile view:', error);
//   } catch (error) {
//     console.error('Error tracking tile view:', error);
//   }
// };

// export const trackTileApplication = async (tileId: string, showroomId: string, surface: string, roomType: string) => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Tile application tracking skipped.');
//     return;
//   }
  
//   try {
//     const { error } = await supabase
//       .from('tile_analytics')
//       .insert({
//         tile_id: tileId,
//         showroom_id: showroomId,
//         action_type: 'apply',
//         surface_type: surface,
//         room_type: roomType,
//         timestamp: new Date().toISOString()
//       });
    
//     if (error) console.error('Error tracking tile application:', error);
//   } catch (error) {
//     console.error('Error tracking tile application:', error);
//   }
// };

// export const getTileAnalytics = async (showroomId: string) => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning empty analytics.');
//     return [];
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('tile_analytics_summary')
//       .select('*')
//       .eq('showroom_id', showroomId);
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error fetching tile analytics:', error);
//     return [];
//   }
// };

// export const getMostViewedTiles = async (showroomId: string, limit = 10) => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning empty most viewed tiles.');
//     return [];
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('most_viewed_tiles')
//       .select('*')
//       .eq('showroom_id', showroomId)
//       .limit(limit);
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error fetching most viewed tiles:', error);
//     return [];
//   }
// };

// export const getMostTriedTiles = async (showroomId: string, limit = 10) => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning empty most tried tiles.');
//     return [];
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('most_tried_tiles')
//       .select('*')
//       .eq('showroom_id', showroomId)
//       .limit(limit);
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error fetching most tried tiles:', error);
//     return [];
//   }
// };

// // Authentication functions
// export const signUp = async (email: string, password: string, fullName: string, role: 'seller' | 'admin' = 'seller') => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     // Only allow admin to create new accounts
//     const currentUser = await getCurrentUser();
//     if (!currentUser || currentUser.role !== 'admin') {
//       throw new Error('Only administrators can create new accounts. Please contact your admin.');
//     }
    
//     console.log('Starting signup process...', { email, role });
    
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName,
//           role: role
//         }
//       }
//     });
    
//     console.log('Supabase auth signup result:', { data, error });
    
//     if (error) throw error;
    
//     // Always try to create user profile manually for reliability
//     if (data.user) {
//       console.log('Creating user profile for:', data.user.id);
      
//       try {
//         // Wait a moment for auth to settle
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Try to create profile directly
//         const { data: profileData, error: profileError } = await supabase
//           .from('user_profiles')
//           .insert({
//             user_id: data.user.id,
//             email: email,
//             full_name: fullName,
//             role: role
//           })
//           .select()
//           .single();
        
//         if (profileError) {
//           console.error('Profile creation error:', profileError);
          
//           // If it's a duplicate key error, that's actually OK
//           if (profileError.code === '23505') {
//             console.log('Profile already exists, continuing...');
//           } else {
//             // For other errors, throw a more specific error
//             throw new Error(`Failed to create user profile: ${profileError.message}`);
//           }
//         } else {
//           console.log('Profile created successfully:', profileData);
//         }
//       } catch (profileError) {
//         console.error('Profile creation failed:', profileError);
//         throw new Error(`Database error saving new user: ${profileError.message}`);
//       }
//     }
    
//     console.log('Signup completed successfully');
//     return data;
//   } catch (error) {
//     console.error('Error signing up:', error);
//     throw error;
//   }
// };

// export const signIn = async (email: string, password: string) => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     console.log('Attempting to sign in with:', email);
    
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
    
//     console.log('Sign in result:', { data, error });
    
//     if (error) {
//       // Provide more specific error messages
//       if (error.message.includes('Invalid login credentials')) {
//         throw new Error('Invalid email or password. Please check your credentials and try again.');
//       } else if (error.message.includes('Email not confirmed')) {
//         throw new Error('Please check your email and click the confirmation link before signing in.');
//       } else if (error.message.includes('Too many requests')) {
//         throw new Error('Too many login attempts. Please wait a moment and try again.');
//       } else {
//         throw new Error(`Login failed: ${error.message}`);
//       }
//     }
    
//     // Check if user profile exists
//     if (data.user) {
//       try {
//         const { data: profile, error: profileError } = await supabase
//           .from('user_profiles')
//           .select('*')
//           .eq('user_id', data.user.id)
//           .single();
        
//         if (profileError && profileError.code !== 'PGRST116') {
//           console.error('Profile fetch error:', profileError);
//         }
        
//         if (!profile) {
//           console.log('No profile found, creating one...');
//           // Create profile if it doesn't exist
//           await supabase
//             .from('user_profiles')
//             .insert({
//               user_id: data.user.id,
//               email: data.user.email || email,
//               role: 'customer',
//               full_name: data.user.user_metadata?.full_name || ''
//             });
//         }
//       } catch (profileError) {
//         console.error('Error handling user profile:', profileError);
//         // Don't fail login if profile creation fails
//       }
//     }
    
//     return data;
//   } catch (error) {
//     console.error('Error signing in:', error);
//     throw error;
//   }
// };

// export const signOut = async () => {
//   if (!isSupabaseConfigured()) {
//     return;
//   }
  
//   try {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error signing out:', error);
//     throw error;
//   }
// };

// export const getCurrentUser = async (): Promise<UserProfile | null> => {
//   if (!isSupabaseConfigured()) {
//     console.log('❌ Supabase not configured in getCurrentUser');
//     return null;
//   }
  
//   try {
//     console.log('🔍 Getting current user...');
//     const { data: { user } } = await supabase.auth.getUser();
//     console.log('🔍 Auth user:', user ? { id: user.id, email: user.email } : null);
    
//     if (!user) return null;
    
//     const { data, error } = await supabase
//       .from('user_profiles')
//       .select('*')
//       .eq('user_id', user.id)
//       .single();
    
//     console.log('🔍 Profile query result:', { data, error });
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('❌ Error getting current user:', error);
//     return null;
//   }
// };

// // Seller functions
// export const createSellerProfile = async (sellerData: Partial<TileSeller>) => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('tile_sellers')
//       .insert(sellerData)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error creating seller profile:', error);
//     throw error;
//   }
// };

// export const getSellerProfile = async (userId: string): Promise<TileSeller | null> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning null for seller profile.');
//     return null;
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('tile_sellers')
//       .select('*')
//       .eq('user_id', userId)
//       .single();
    
//     if (error) {
//       if (error.code === 'PGRST116') {
//         // No seller profile found - this is expected for non-sellers
//         console.log('No seller profile found for user:', userId);
//         return null;
//       }
//       throw error;
//     }
//     return data;
//   } catch (error) {
//     console.warn('Seller profile not found or error occurred:', error.message);
//     return null;
//   }
// };

// export const getAllSellers = async (): Promise<TileSeller[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('tile_sellers')
//       .select('*')
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error getting all sellers:', error);
//     return [];
//   }
// };

// // Customer favorites functions
// export const addToFavorites = async (tileId: string, showroomId: string) => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Favorites not saved.');
//     return;
//   }
  
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) throw new Error('User not authenticated');
    
//     const { error } = await supabase
//       .from('customer_favorites')
//       .insert({
//         customer_id: user.id,
//         tile_id: tileId,
//         showroom_id: showroomId
//       });
    
//     if (error && error.code !== '23505') throw error; // Ignore duplicate key error
//   } catch (error) {
//     console.error('Error adding to favorites:', error);
//     throw error;
//   }
// };

// export const removeFromFavorites = async (tileId: string) => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Favorites not removed.');
//     return;
//   }
  
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) throw new Error('User not authenticated');
    
//     const { error } = await supabase
//       .from('customer_favorites')
//       .delete()
//       .eq('customer_id', user.id)
//       .eq('tile_id', tileId);
    
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error removing from favorites:', error);
//     throw error;
//   }
// };

// export const getFavorites = async (): Promise<string[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return [];
    
//     const { data, error } = await supabase
//       .from('customer_favorites')
//       .select('tile_id')
//       .eq('customer_id', user.id);
    
//     if (error) throw error;
//     return data?.map(fav => fav.tile_id) || [];
//   } catch (error) {
//     console.error('Error getting favorites:', error);
//     return [];
//   }
// };

// // Tile management functions
// export const uploadTile = async (tileData: any, sellerId?: string) => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     const finalTileData = {
//       ...tileData,
//       seller_id: sellerId || user?.id,
//       qr_code: tileData.qrCode || null,
//       qr_code_url: tileData.qrCodeUrl || null
//     };
    
//     const { data, error } = await supabase
//       .from('tiles')
//       .insert(finalTileData)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error uploading tile:', error);
//     throw error;
//   }
// };

// export const uploadBulkTiles = async (tilesData: any[], sellerId?: string) => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     const finalTilesData = tilesData.map(tile => ({
//       ...tile,
//       seller_id: sellerId || user?.id,
//       qr_code: tile.qrCode || null,
//       qr_code_url: tile.qrCodeUrl || null
//     }));
    
//     const { data, error } = await supabase
//       .from('tiles')
//       .insert(finalTilesData)
//       .select();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error uploading bulk tiles:', error);
//     throw error;
//   }
// };

// export const updateTile = async (tileId: string, updates: any) => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const finalUpdates = {
//       ...updates,
//       qr_code: updates.qrCode || updates.qr_code || null,
//       qr_code_url: updates.qrCodeUrl || updates.qr_code_url || null
//     };
    
//     const { data, error } = await supabase
//       .from('tiles')
//       .update(finalUpdates)
//       .eq('id', tileId)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error updating tile:', error);
//     throw error;
//   }
// };

// export const deleteTile = async (tileId: string) => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const { error } = await supabase
//       .from('tiles')
//       .delete()
//       .eq('id', tileId);
    
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error deleting tile:', error);
//     throw error;
//   }
// };

// // QR Code management functions
// export const updateTileQRCode = async (tileId: string, qrCode: string, qrCodeUrl?: string) => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('tiles')
//       .update({ 
//         qr_code: qrCode,
//         qr_code_url: qrCodeUrl || null,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', tileId)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error updating tile QR code:', error);
//     throw error;
//   }
// };

// export const getTileByQRScan = async (tileId: string, showroomId: string) => {
//   if (!isSupabaseConfigured()) {
//     return null;
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('tiles')
//       .select('*')
//       .eq('id', tileId)
//       .eq('showroom_id', showroomId)
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error fetching tile by QR scan:', error);
//     return null;
//   }
// };

// export const getSellerTilesWithQR = async (sellerId: string) => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('tiles')
//       .select('*')
//       .eq('seller_id', sellerId)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching seller tiles with QR:', error);
//     return [];
//   }
// };

// // Admin functions
// export const getSellerAnalytics = async (sellerId: string) => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('tile_analytics_summary')
//       .select(`
//         *,
//         tiles!inner(seller_id)
//       `)
//       .eq('tiles.seller_id', sellerId);
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error fetching seller analytics:', error);
//     return [];
//   }
// };

// export const getAllAnalytics = async () => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('tile_analytics_summary')
//       .select(`
//         *,
//         tiles!inner(seller_id),
//         tile_sellers!inner(business_name)
//       `);
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error fetching all analytics:', error);
//     return [];
//   }
// };


// import { createClient } from '@supabase/supabase-js';
// import { UserProfile, TileSeller } from '../types';

// // ✅ Correct for Vite
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // Create Supabase client
// export const supabase = supabaseUrl && supabaseAnonKey 
//   ? createClient(supabaseUrl, supabaseAnonKey)
//   : null;

// // Helper function to check if Supabase is configured
// export const isSupabaseConfigured = (): boolean => {
//   return supabase !== null && 
//     !!supabaseUrl && 
//     !!supabaseAnonKey && 
//     supabaseUrl !== 'your_supabase_project_url' && 
//     supabaseAnonKey !== 'your_supabase_anon_key';
// };

// // Helper to get supabase client safely
// const getSupabase = () => {
//   if (!supabase) {
//     throw new Error('Supabase client not initialized');
//   }
//   return supabase;
// };

// // Analytics functions
// export const trackTileView = async (tileId: string, showroomId: string): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Tile view tracking skipped.');
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
    
//     const { error } = await client
//       .from('tile_analytics')
//       .insert({
//         tile_id: tileId,
//         showroom_id: showroomId,
//         action_type: 'view',
//         customer_id: user?.id || null,
//         timestamp: new Date().toISOString()
//       });
    
//     if (error) console.error('Error tracking tile view:', error);
//   } catch (error) {
//     console.error('Error tracking tile view:', error);
//   }
// };

// export const trackTileApplication = async (
//   tileId: string, 
//   showroomId: string, 
//   surface: string, 
//   roomType: string
// ): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Tile application tracking skipped.');
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
    
//     const { error } = await client
//       .from('tile_analytics')
//       .insert({
//         tile_id: tileId,
//         showroom_id: showroomId,
//         action_type: 'apply',
//         surface_type: surface,
//         room_type: roomType,
//         customer_id: user?.id || null,
//         timestamp: new Date().toISOString()
//       });
    
//     if (error) console.error('Error tracking tile application:', error);
//   } catch (error) {
//     console.error('Error tracking tile application:', error);
//   }
// };

// export const getTileAnalytics = async (showroomId: string): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning empty analytics.');
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_analytics_summary')
//       .select('*')
//       .eq('showroom_id', showroomId);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching tile analytics:', error);
//     return [];
//   }
// };

// export const getMostViewedTiles = async (showroomId: string, limit = 10): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning empty most viewed tiles.');
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('most_viewed_tiles')
//       .select('*')
//       .eq('showroom_id', showroomId)
//       .limit(limit);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching most viewed tiles:', error);
//     return [];
//   }
// };

// export const getMostTriedTiles = async (showroomId: string, limit = 10): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning empty most tried tiles.');
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('most_tried_tiles')
//       .select('*')
//       .eq('showroom_id', showroomId)
//       .limit(limit);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching most tried tiles:', error);
//     return [];
//   }
// };

// // Authentication functions
// export const signUpCustomer = async (email: string, password: string, fullName: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     console.log('Starting customer signup process...', { email, fullName });
    
//     const { data, error } = await client.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName,
//           role: 'customer'
//         }
//       }
//     });
    
//     console.log('Customer signup result:', { data, error });
    
//     if (error) throw error;
    
//     console.log('Customer signup completed successfully');
//     return data;
//   } catch (error) {
//     console.error('Error signing up customer:', error);
//     throw error;
//   }
// };

// export const signUpSeller = async (
//   email: string, 
//   password: string, 
//   fullName: string, 
//   role: 'seller' | 'admin' = 'seller'
// ): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser || currentUser.role !== 'admin') {
//       throw new Error('Only administrators can create seller/admin accounts. Please contact your admin.');
//     }
    
//     const client = getSupabase();
//     console.log('Starting seller/admin signup process...', { email, role });
    
//     const { data, error } = await client.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName,
//           role: role
//         }
//       }
//     });
    
//     console.log('Seller/admin signup result:', { data, error });
    
//     if (error) throw error;
    
//     if (data.user) {
//       console.log('Creating seller/admin profile for:', data.user.id);
      
//       try {
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         const { data: profileData, error: profileError } = await client
//           .from('user_profiles')
//           .insert({
//             user_id: data.user.id,
//             email: email,
//             full_name: fullName,
//             role: role
//           })
//           .select()
//           .single();
        
//         if (profileError && (profileError as any).code !== '23505') {
//           throw new Error(`Failed to create user profile: ${(profileError as any).message}`);
//         }
        
//         console.log('Profile created successfully:', profileData);
//       } catch (profileError: any) {
//         console.error('Profile creation failed:', profileError);
//         throw new Error(`Database error saving new user: ${profileError.message}`);
//       }
//     }
    
//     console.log('Seller/admin signup completed successfully');
//     return data;
//   } catch (error) {
//     console.error('Error signing up seller/admin:', error);
//     throw error;
//   }
// };

// export const signIn = async (email: string, password: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     console.log('Attempting to sign in with:', email);
    
//     const { data, error } = await client.auth.signInWithPassword({
//       email,
//       password,
//     });
    
//     console.log('Sign in result:', { data, error });
    
//     if (error) {
//       if (error.message.includes('Invalid login credentials')) {
//         throw new Error('Invalid email or password. Please check your credentials and try again.');
//       } else if (error.message.includes('Email not confirmed')) {
//         throw new Error('Please check your email and click the confirmation link before signing in.');
//       } else if (error.message.includes('Too many requests')) {
//         throw new Error('Too many login attempts. Please wait a moment and try again.');
//       } else {
//         throw new Error(`Login failed: ${error.message}`);
//       }
//     }
    
//     return data;
//   } catch (error) {
//     console.error('Error signing in:', error);
//     throw error;
//   }
// };

// export const signOut = async (): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     const { error } = await client.auth.signOut();
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error signing out:', error);
//     throw error;
//   }
// };

// export const getCurrentUser = async (): Promise<UserProfile | null> => {
//   if (!isSupabaseConfigured()) {
//     console.log('❌ Supabase not configured in getCurrentUser');
//     return null;
//   }
  
//   try {
//     const client = getSupabase();
//     console.log('🔍 Getting current user...');
//     const { data: { user } } = await client.auth.getUser();
//     console.log('🔍 Auth user:', user ? { id: user.id, email: user.email } : null);
    
//     if (!user) return null;
    
//     const { data, error } = await client
//       .from('user_profiles')
//       .select('*')
//       .eq('user_id', user.id)
//       .single();
    
//     console.log('🔍 Profile query result:', { data, error });
    
//     if (error) throw error;
//     return data;
//   } catch (error: any) {
//     console.error('❌ Error getting current user:', error);
//     return null;
//   }
// };

// // Seller functions
// export const createSellerProfile = async (sellerData: Partial<TileSeller>): Promise<TileSeller> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_sellers')
//       .insert(sellerData)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error creating seller profile:', error);
//     throw error;
//   }
// };

// export const getSellerProfile = async (userId: string): Promise<TileSeller | null> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning null for seller profile.');
//     return null;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_sellers')
//       .select('*')
//       .eq('user_id', userId)
//       .single();
    
//     if (error) {
//       if ((error as any).code === 'PGRST116') {
//         console.log('No seller profile found for user:', userId);
//         return null;
//       }
//       throw error;
//     }
//     return data;
//   } catch (error: any) {
//     console.warn('Seller profile not found or error occurred:', error.message);
//     return null;
//   }
// };

// export const getAllSellers = async (): Promise<TileSeller[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_sellers')
//       .select('*')
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error getting all sellers:', error);
//     return [];
//   }
// };

// // Customer favorites functions
// export const addToFavorites = async (tileId: string, showroomId: string): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Favorites not saved.');
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     if (!user) throw new Error('User not authenticated');
    
//     const { error } = await client
//       .from('customer_favorites')
//       .insert({
//         customer_id: user.id,
//         tile_id: tileId,
//         showroom_id: showroomId
//       });
    
//     if (error && (error as any).code !== '23505') throw error;
//   } catch (error) {
//     console.error('Error adding to favorites:', error);
//     throw error;
//   }
// };

// export const removeFromFavorites = async (tileId: string): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Favorites not removed.');
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     if (!user) throw new Error('User not authenticated');
    
//     const { error } = await client
//       .from('customer_favorites')
//       .delete()
//       .eq('customer_id', user.id)
//       .eq('tile_id', tileId);
    
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error removing from favorites:', error);
//     throw error;
//   }
// };

// export const getFavorites = async (): Promise<string[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     if (!user) return [];
    
//     const { data, error } = await client
//       .from('customer_favorites')
//       .select('tile_id')
//       .eq('customer_id', user.id);
    
//     if (error) throw error;
//     return data?.map(fav => fav.tile_id) || [];
//   } catch (error) {
//     console.error('Error getting favorites:', error);
//     return [];
//   }
// };

// export const getFavoritesByUserId = async (userId: string): Promise<string[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('customer_favorites')
//       .select('tile_id')
//       .eq('customer_id', userId);
    
//     if (error) throw error;
//     return data?.map(fav => fav.tile_id) || [];
//   } catch (error) {
//     console.error('Error getting favorites by user ID:', error);
//     return [];
//   }
// };

// // Tile management functions
// export const uploadTile = async (tileData: any, sellerId?: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     const finalTileData = {
//       ...tileData,
//       id: `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       seller_id: sellerId || user?.id,
//       qr_code: tileData.qrCode || null,
//       qr_code_url: tileData.qrCodeUrl || null
//     };
    
//     const { data, error } = await client
//       .from('tiles')
//       .insert(finalTileData)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error uploading tile:', error);
//     throw error;
//   }
// };

// export const uploadBulkTiles = async (tilesData: any[], sellerId?: string): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     const finalTilesData = tilesData.map(tile => ({
//       ...tile,
//       id: `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       seller_id: sellerId || user?.id,
//       qr_code: tile.qrCode || null,
//       qr_code_url: tile.qrCodeUrl || null
//     }));
    
//     const { data, error } = await client
//       .from('tiles')
//       .insert(finalTilesData)
//       .select();
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error uploading bulk tiles:', error);
//     throw error;
//   }
// };

// export const updateTile = async (tileId: string, updates: any): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const finalUpdates = {
//       ...updates,
//       qr_code: updates.qrCode || updates.qr_code || null,
//       qr_code_url: updates.qrCodeUrl || updates.qr_code_url || null
//     };
    
//     const { data, error } = await client
//       .from('tiles')
//       .update(finalUpdates)
//       .eq('id', tileId)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error updating tile:', error);
//     throw error;
//   }
// };

// export const deleteTile = async (tileId: string): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { error } = await client
//       .from('tiles')
//       .delete()
//       .eq('id', tileId);
    
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error deleting tile:', error);
//     throw error;
//   }
// };

// export const getSellerTiles = async (): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     if (!user) return [];
    
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .eq('seller_id', user.id)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error getting seller tiles:', error);
//     return [];
//   }
// };

// // Public tile functions
// export const getAllTiles = async (): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error getting all tiles:', error);
//     return [];
//   }
// };

// export const getTileById = async (tileId: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     return null;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .eq('id', tileId)
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error getting tile by ID:', error);
//     return null;
//   }
// };

// // QR Code management functions
// export const updateTileQRCode = async (tileId: string, qrCode: string, qrCodeUrl?: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .update({ 
//         qr_code: qrCode,
//         qr_code_url: qrCodeUrl || null,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', tileId)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error updating tile QR code:', error);
//     throw error;
//   }
// };

// export const getTileByQRScan = async (tileId: string, showroomId: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     return null;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .eq('id', tileId)
//       .eq('showroom_id', showroomId)
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error fetching tile by QR scan:', error);
//     return null;
//   }
// };

// export const getSellerTilesWithQR = async (sellerId: string): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .eq('seller_id', sellerId)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching seller tiles with QR:', error);
//     return [];
//   }
// };

// // Admin functions
// export const getSellerAnalytics = async (sellerId: string): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_analytics_summary')
//       .select(`
//         *,
//         tiles!inner(seller_id)
//       `)
//       .eq('tiles.seller_id', sellerId);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching seller analytics:', error);
//     return [];
//   }
// };

// export const getAllAnalytics = async (): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_analytics_summary')
//       .select(`
//         *,
//         tiles!inner(seller_id),
//         tile_sellers!inner(business_name)
//       `);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching all analytics:', error);
//     return [];
//   }
// };
// import { createClient } from '@supabase/supabase-js';
// import { UserProfile, TileSeller } from '../types';

// // ✅ Environment variables with debugging
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // ✅ Debug environment on load
// console.log('🔧 Supabase Environment Check:');
// console.log('URL:', supabaseUrl);
// console.log('Key exists:', !!supabaseAnonKey);
// console.log('Key length:', supabaseAnonKey?.length);

// // Create Supabase client
// export const supabase = supabaseUrl && supabaseAnonKey 
//   ? createClient(supabaseUrl, supabaseAnonKey, {
//       auth: {
//         persistSession: true,
//         autoRefreshToken: true,
//       }
//     })
//   : null;

// // ✅ Enhanced configuration check
// export const isSupabaseConfigured = (): boolean => {
//   const configured = supabase !== null && 
//     !!supabaseUrl && 
//     !!supabaseAnonKey && 
//     supabaseUrl !== 'your_supabase_project_url' && 
//     supabaseAnonKey !== 'your_supabase_anon_key' &&
//     supabaseUrl.includes('supabase.co');
    
//   console.log('🔧 Configuration check:', { configured, url: !!supabaseUrl, key: !!supabaseAnonKey });
//   return configured;
// };

// // Helper to get supabase client safely
// const getSupabase = () => {
//   if (!supabase) {
//     throw new Error('Supabase client not initialized. Check environment variables.');
//   }
//   return supabase;
// };

// // ✅ NEW: Debug function for testing
// export const debugSupabaseConnection = async () => {
//   console.log('🔧 === SUPABASE DEBUG START ===');
  
//   try {
//     console.log('Environment:', {
//       url: supabaseUrl,
//       keyExists: !!supabaseAnonKey,
//       keyLength: supabaseAnonKey?.length,
//       mode: import.meta.env.MODE
//     });
    
//     if (!isSupabaseConfigured()) {
//       console.error('❌ Supabase not configured');
//       return false;
//     }
    
//     const client = getSupabase();
    
//     // Test basic connection
//     const { data: sessionData, error: sessionError } = await client.auth.getSession();
//     console.log('Session test:', { sessionData, sessionError });
    
//     console.log('✅ Supabase connection test completed');
//     return true;
    
//   } catch (error) {
//     console.error('❌ Supabase debug failed:', error);
//     return false;
//   } finally {
//     console.log('🔧 === SUPABASE DEBUG END ===');
//   }
// };

// // ✅ NEW: Quick environment test
// export const quickEnvironmentTest = () => {
//   console.log('🔧 Quick Environment Test:');
//   console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
//   console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
//   console.log('VITE_SUPABASE_ANON_KEY length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);
//   console.log('Mode:', import.meta.env.MODE);
//   console.log('Configured:', isSupabaseConfigured());
// };

// // Analytics functions
// export const trackTileView = async (tileId: string, showroomId: string): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Tile view tracking skipped.');
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
    
//     const { error } = await client
//       .from('tile_analytics')
//       .insert({
//         tile_id: tileId,
//         showroom_id: showroomId,
//         action_type: 'view',
//         customer_id: user?.id || null,
//         timestamp: new Date().toISOString()
//       });
    
//     if (error) console.error('Error tracking tile view:', error);
//   } catch (error) {
//     console.error('Error tracking tile view:', error);
//   }
// };

// export const trackTileApplication = async (
//   tileId: string, 
//   showroomId: string, 
//   surface: string, 
//   roomType: string
// ): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Tile application tracking skipped.');
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
    
//     const { error } = await client
//       .from('tile_analytics')
//       .insert({
//         tile_id: tileId,
//         showroom_id: showroomId,
//         action_type: 'apply',
//         surface_type: surface,
//         room_type: roomType,
//         customer_id: user?.id || null,
//         timestamp: new Date().toISOString()
//       });
    
//     if (error) console.error('Error tracking tile application:', error);
//   } catch (error) {
//     console.error('Error tracking tile application:', error);
//   }
// };

// export const getTileAnalytics = async (showroomId: string): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning empty analytics.');
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_analytics_summary')
//       .select('*')
//       .eq('showroom_id', showroomId);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching tile analytics:', error);
//     return [];
//   }
// };

// export const getMostViewedTiles = async (showroomId: string, limit = 10): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning empty most viewed tiles.');
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('most_viewed_tiles')
//       .select('*')
//       .eq('showroom_id', showroomId)
//       .limit(limit);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching most viewed tiles:', error);
//     return [];
//   }
// };

// export const getMostTriedTiles = async (showroomId: string, limit = 10): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning empty most tried tiles.');
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('most_tried_tiles')
//       .select('*')
//       .eq('showroom_id', showroomId)
//       .limit(limit);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching most tried tiles:', error);
//     return [];
//   }
// };

// // Authentication functions
// export const signUpCustomer = async (email: string, password: string, fullName: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     console.log('Starting customer signup process...', { email, fullName });
    
//     const { data, error } = await client.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName,
//           role: 'customer'
//         }
//       }
//     });
    
//     console.log('Customer signup result:', { data, error });
    
//     if (error) throw error;
    
//     console.log('Customer signup completed successfully');
//     return data;
//   } catch (error) {
//     console.error('Error signing up customer:', error);
//     throw error;
//   }
// };

// export const signUpSeller = async (
//   email: string, 
//   password: string, 
//   fullName: string, 
//   role: 'seller' | 'admin' = 'seller'
// ): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser || currentUser.role !== 'admin') {
//       throw new Error('Only administrators can create seller/admin accounts. Please contact your admin.');
//     }
    
//     const client = getSupabase();
//     console.log('Starting seller/admin signup process...', { email, role });
    
//     const { data, error } = await client.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName,
//           role: role
//         }
//       }
//     });
    
//     console.log('Seller/admin signup result:', { data, error });
    
//     if (error) throw error;
    
//     if (data.user) {
//       console.log('Creating seller/admin profile for:', data.user.id);
      
//       try {
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         const { data: profileData, error: profileError } = await client
//           .from('user_profiles')
//           .insert({
//             user_id: data.user.id,
//             email: email,
//             full_name: fullName,
//             role: role
//           })
//           .select()
//           .single();
        
//         if (profileError && (profileError as any).code !== '23505') {
//           throw new Error(`Failed to create user profile: ${(profileError as any).message}`);
//         }
        
//         console.log('Profile created successfully:', profileData);
//       } catch (profileError: any) {
//         console.error('Profile creation failed:', profileError);
//         throw new Error(`Database error saving new user: ${profileError.message}`);
//       }
//     }
    
//     console.log('Seller/admin signup completed successfully');
//     return data;
//   } catch (error) {
//     console.error('Error signing up seller/admin:', error);
//     throw error;
//   }
// };

// // ✅ Enhanced signIn function
// export const signIn = async (email: string, password: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please check environment variables.');
//   }
  
//   try {
//     const client = getSupabase();
//     console.log('🔄 Attempting sign in with:', email);
//     console.log('🔄 Client configured:', !!client);
    
//     const { data, error } = await client.auth.signInWithPassword({
//       email: email.trim(),
//       password: password
//     });
    
//     console.log('📊 Sign in raw result:', { 
//       hasUser: !!data?.user, 
//       hasSession: !!data?.session,
//       errorMessage: error?.message,
//       errorStatus: error?.status 
//     });
    
//     if (error) {
//       console.error('❌ Sign in error details:', {
//         message: error.message,
//         status: error.status,
//         name: error.name
//       });
      
//       if (error.message.includes('Invalid login credentials')) {
//         throw new Error('Invalid email or password. Please check your credentials and try again.');
//       } else if (error.message.includes('Email not confirmed')) {
//         throw new Error('Please check your email and confirm your account before signing in.');
//       } else if (error.message.includes('Too many requests')) {
//         throw new Error('Too many login attempts. Please wait a moment and try again.');
//       } else if (error.message.includes('signup_disabled')) {
//         throw new Error('New signups are disabled. Please contact administrator.');
//       } else {
//         throw new Error(`Authentication failed: ${error.message}`);
//       }
//     }
    
//     if (!data?.user) {
//       throw new Error('No user data returned from authentication.');
//     }
    
//     console.log('✅ Sign in successful for user:', data.user.id);
//     return data;
    
//   } catch (error: any) {
//     console.error('❌ Sign in error:', error);
//     throw error;
//   }
// };

// export const signOut = async (): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     console.log('⚠️ Supabase not configured, skipping signOut');
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     console.log('🔄 Signing out...');
    
//     const { error } = await client.auth.signOut();
    
//     if (error) {
//       console.error('❌ Sign out error:', error);
//       throw error;
//     }
    
//     console.log('✅ Sign out successful');
    
//   } catch (error) {
//     console.error('❌ Error signing out:', error);
//     throw error;
//   }
// };

// // ✅ Enhanced getCurrentUser with better error handling
// export const getCurrentUser = async (): Promise<UserProfile | null> => {
//   if (!isSupabaseConfigured()) {
//     console.log('❌ Supabase not configured in getCurrentUser');
//     return null;
//   }
  
//   try {
//     const client = getSupabase();
//     console.log('🔍 Getting current user...');
    
//     const { data: { user }, error: authError } = await client.auth.getUser();
//     console.log('🔍 Auth user result:', { 
//       hasUser: !!user, 
//       userId: user?.id, 
//       email: user?.email,
//       authError: authError?.message 
//     });
    
//     if (authError) {
//       console.error('❌ Auth error:', authError);
//       return null;
//     }
    
//     if (!user) {
//       console.log('ℹ️ No authenticated user found');
//       return null;
//     }
    
//     const { data: profile, error: profileError } = await client
//       .from('user_profiles')
//       .select('*')
//       .eq('user_id', user.id)
//       .single();
    
//     console.log('🔍 Profile query result:', { 
//       hasProfile: !!profile, 
//       profileError: profileError?.message,
//       profileCode: profileError?.code 
//     });
    
//     if (profileError) {
//       if (profileError.code === 'PGRST116') {
//         console.warn('⚠️ User profile not found for user:', user.id);
//         return null;
//       }
      
//       console.error('❌ Profile query error:', profileError);
//       return null;
//     }
    
//     if (!profile) {
//       console.warn('⚠️ No profile data returned for user:', user.id);
//       return null;
//     }
    
//     console.log('✅ User profile loaded successfully:', {
//       id: profile.id,
//       email: profile.email,
//       role: profile.role
//     });
    
//     return profile;
    
//   } catch (error: any) {
//     console.error('❌ Error getting current user:', error);
//     return null;
//   }
// };

// // Seller functions
// export const createSellerProfile = async (sellerData: Partial<TileSeller>): Promise<TileSeller> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_sellers')
//       .insert(sellerData)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error creating seller profile:', error);
//     throw error;
//   }
// };

// export const getSellerProfile = async (userId: string): Promise<TileSeller | null> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Returning null for seller profile.');
//     return null;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_sellers')
//       .select('*')
//       .eq('user_id', userId)
//       .single();
    
//     if (error) {
//       if ((error as any).code === 'PGRST116') {
//         console.log('No seller profile found for user:', userId);
//         return null;
//       }
//       throw error;
//     }
//     return data;
//   } catch (error: any) {
//     console.warn('Seller profile not found or error occurred:', error.message);
//     return null;
//   }
// };

// export const getAllSellers = async (): Promise<TileSeller[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_sellers')
//       .select('*')
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error getting all sellers:', error);
//     return [];
//   }
// };

// // Customer favorites functions
// export const addToFavorites = async (tileId: string, showroomId: string): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Favorites not saved.');
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     if (!user) throw new Error('User not authenticated');
    
//     const { error } = await client
//       .from('customer_favorites')
//       .insert({
//         customer_id: user.id,
//         tile_id: tileId,
//         showroom_id: showroomId
//       });
    
//     if (error && (error as any).code !== '23505') throw error;
//   } catch (error) {
//     console.error('Error adding to favorites:', error);
//     throw error;
//   }
// };

// export const removeFromFavorites = async (tileId: string): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     console.warn('Supabase not configured. Favorites not removed.');
//     return;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     if (!user) throw new Error('User not authenticated');
    
//     const { error } = await client
//       .from('customer_favorites')
//       .delete()
//       .eq('customer_id', user.id)
//       .eq('tile_id', tileId);
    
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error removing from favorites:', error);
//     throw error;
//   }
// };

// export const getFavorites = async (): Promise<string[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     if (!user) return [];
    
//     const { data, error } = await client
//       .from('customer_favorites')
//       .select('tile_id')
//       .eq('customer_id', user.id);
    
//     if (error) throw error;
//     return data?.map(fav => fav.tile_id) || [];
//   } catch (error) {
//     console.error('Error getting favorites:', error);
//     return [];
//   }
// };

// export const getFavoritesByUserId = async (userId: string): Promise<string[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('customer_favorites')
//       .select('tile_id')
//       .eq('customer_id', userId);
    
//     if (error) throw error;
//     return data?.map(fav => fav.tile_id) || [];
//   } catch (error) {
//     console.error('Error getting favorites by user ID:', error);
//     return [];
//   }
// };

// // Tile management functions
// export const uploadTile = async (tileData: any, sellerId?: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     const finalTileData = {
//       ...tileData,
//       id: `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       seller_id: sellerId || user?.id,
//       qr_code: tileData.qrCode || null,
//       qr_code_url: tileData.qrCodeUrl || null
//     };
    
//     const { data, error } = await client
//       .from('tiles')
//       .insert(finalTileData)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error uploading tile:', error);
//     throw error;
//   }
// };

// export const uploadBulkTiles = async (tilesData: any[], sellerId?: string): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     const finalTilesData = tilesData.map(tile => ({
//       ...tile,
//       id: `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       seller_id: sellerId || user?.id,
//       qr_code: tile.qrCode || null,
//       qr_code_url: tile.qrCodeUrl || null
//     }));
    
//     const { data, error } = await client
//       .from('tiles')
//       .insert(finalTilesData)
//       .select();
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error uploading bulk tiles:', error);
//     throw error;
//   }
// };

// export const updateTile = async (tileId: string, updates: any): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const finalUpdates = {
//       ...updates,
//       qr_code: updates.qrCode || updates.qr_code || null,
//       qr_code_url: updates.qrCodeUrl || updates.qr_code_url || null
//     };
    
//     const { data, error } = await client
//       .from('tiles')
//       .update(finalUpdates)
//       .eq('id', tileId)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error updating tile:', error);
//     throw error;
//   }
// };

// export const deleteTile = async (tileId: string): Promise<void> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { error } = await client
//       .from('tiles')
//       .delete()
//       .eq('id', tileId);
    
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error deleting tile:', error);
//     throw error;
//   }
// };

// export const getSellerTiles = async (): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data: { user } } = await client.auth.getUser();
//     if (!user) return [];
    
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .eq('seller_id', user.id)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error getting seller tiles:', error);
//     return [];
//   }
// };

// // Public tile functions
// export const getAllTiles = async (): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error getting all tiles:', error);
//     return [];
//   }
// };

// export const getTileById = async (tileId: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     return null;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .eq('id', tileId)
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error getting tile by ID:', error);
//     return null;
//   }
// };

// // QR Code management functions
// export const updateTileQRCode = async (tileId: string, qrCode: string, qrCodeUrl?: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     throw new Error('Supabase not configured. Please set up your Supabase credentials.');
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .update({ 
//         qr_code: qrCode,
//         qr_code_url: qrCodeUrl || null,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', tileId)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error updating tile QR code:', error);
//     throw error;
//   }
// };

// export const getTileByQRScan = async (tileId: string, showroomId: string): Promise<any> => {
//   if (!isSupabaseConfigured()) {
//     return null;
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .eq('id', tileId)
//       .eq('showroom_id', showroomId)
//       .single();
    
//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error('Error fetching tile by QR scan:', error);
//     return null;
//   }
// };

// export const getSellerTilesWithQR = async (sellerId: string): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tiles')
//       .select('*')
//       .eq('seller_id', sellerId)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching seller tiles with QR:', error);
//     return [];
//   }
// };

// // Admin functions
// export const getSellerAnalytics = async (sellerId: string): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_analytics_summary')
//       .select(`
//         *,
//         tiles!inner(seller_id)
//       `)
//       .eq('tiles.seller_id', sellerId);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching seller analytics:', error);
//     return [];
//   }
// };

// export const getAllAnalytics = async (): Promise<any[]> => {
//   if (!isSupabaseConfigured()) {
//     return [];
//   }
  
//   try {
//     const client = getSupabase();
//     const { data, error } = await client
//       .from('tile_analytics_summary')
//       .select(`
//         *,
//         tiles!inner(seller_id),
//         tile_sellers!inner(business_name)
//       `);
    
//     if (error) throw error;
//     return data || [];
//   } catch (error) {
//     console.error('Error fetching all analytics:', error);
//     return [];
//   }
// };

// // Auto-run environment test
// quickEnvironmentTest();