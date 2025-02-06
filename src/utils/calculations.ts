import { supabase } from '@utils/supabase/supabase';
import { CalculationFunction } from '@/types/question';

// Fetch the user's age from Supabase
export const getUserAge = async (): Promise<number | null> => {
  try {
    const { data: user, error } = await supabase.auth.getUser();
    if (error || !user?.user?.id) throw new Error('User not authenticated');

    const user_id = user.user.id;
    console.log(`Fetching DOB for user: ${user_id}`);

    // Perform query with explicit logging
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('dob')
      .eq('user_id', user_id)
      .maybeSingle(); // ✅ Using maybeSingle() to prevent hard failures

    console.log(`Supabase response for user_id ${user_id}:`, data);

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return null;
    }

    if (!data || !data.dob) {
      console.warn(`DOB not found for user: ${user_id}`);
      return null;
    }

    const dob = new Date(data.dob);
    const age = new Date().getFullYear() - dob.getFullYear();
    console.log(`Calculated age for user ${user_id}: ${age}`);
    return age;
  } catch (err) {
    console.error('Error fetching user age:', err);
    return null;
  }
};

const calculations: Record<
  CalculationFunction,
  (...args: number[]) => Promise<boolean>
> = {
  ageBetween: async (min: number, max: number) => {
    const age = await getUserAge();
    return age !== null && age >= min && age <= max;
  },
  ageGreaterThan: async (min: number) => {
    const age = await getUserAge();
    return age !== null && age > min;
  },
  ageLessThan: async (max: number) => {
    const age = await getUserAge();
    return age !== null && age < max;
  },
};

// Function to evaluate a calculation dynamically
export const evaluateCalculation = async (calculation: {
  func: CalculationFunction;
  params: number[];
}) => {
  if (!calculation || !calculation.func) return true; // No calculation means auto-pass
  return await calculations[calculation.func](...calculation.params);
};
