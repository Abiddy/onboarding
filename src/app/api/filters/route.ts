import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Using a fixed anonymous user ID for demo purposes
const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000';

/**
 * GET /api/filters
 * Fetch all filters or by category
 * Optional query parameters:
 * - category: string - Filter by category
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Build query
    let query = supabase
      .from('filters')
      .select('*')
      .eq('user_id', ANONYMOUS_USER_ID);
    
    // Add category filter if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch filters', details: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ filters: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/filters
 * Create a new filter
 * Required body fields:
 * - name: string - Filter name
 * - category: string - Filter category
 * - criteria: object - Filter criteria
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, criteria } = body;
    
    // Validate required fields
    if (!name || !category || !criteria) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, and criteria are required' }, 
        { status: 400 }
      );
    }
    
    // Create new filter
    const { data, error } = await supabase
      .from('filters')
      .insert([
        { 
          name, 
          category, 
          criteria, 
          user_id: ANONYMOUS_USER_ID,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create filter', details: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ filter: data[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    );
  }
} 