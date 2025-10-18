// Test Supabase Connection
import { supabase } from '../config/supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful!');
    return { success: true, data };
    
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test user creation
export const testUserCreation = async () => {
  try {
    console.log('Testing user creation...');
    
    const testUser = {
      name: 'Test User',
      phone_number: '12345678',
      country_code: '+65'
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert([testUser])
      .select()
      .single();
    
    if (error) {
      console.error('User creation error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ User created successfully:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('User creation test failed:', error);
    return { success: false, error: error.message };
  }
};
