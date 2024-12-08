import { supabase } from '../lib/supabase';
import type { Quotation, QuotationItem } from '../types';

const QUOTATION_SELECT = `
  *,
  quotation_items (
    id,
    description,
    quantity,
    unit_price,
    total
  ),
  guests (
    id,
    first_name,
    last_name,
    email
  )
`;

export const quotationService = {
  async getQuotations(): Promise<Quotation[]> {
    const { data, error } = await supabase
      .from('quotations')
      .select(QUOTATION_SELECT)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getQuotationById(id: string): Promise<Quotation | null> {
    const { data, error } = await supabase
      .from('quotations')
      .select(QUOTATION_SELECT)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createQuotation(quotation: Omit<Quotation, 'id' | 'created_at' | 'updated_at'>): Promise<Quotation> {
    // Generate quotation number (Q-YYYY-MM-[sequential number])
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const { count, error: countError } = await supabase
      .from('quotations')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString()); // Current month

    console.log('Fetching quotation count with query:', {
      query: 'quotations',
      gte: startOfMonth.toISOString(),
    });

    if (countError) {
      console.error('Error fetching quotation count:', countError);
      throw new Error('Failed to fetch quotation count.');
    }

    const number = `Q-${new Date().toISOString().slice(0, 7)}-${String(count + 1).padStart(4, '0')}`;
    console.log('Generated Quotation Number:', number);

    // Start a transaction
    const { data: quotationData, error: quotationError } = await supabase
      .from('quotations')
      .insert([
        {
          number,
          guest_id: quotation.guest_id,
          amount: quotation.amount,
          subtotal: quotation.subtotal,
          tax: quotation.tax,
          status: quotation.status,
          valid_until: quotation.valid_until,
          date: quotation.date,
          notes: quotation.notes
        }
      ])
      .select()
      .single();

    console.log('Quotation Data Being Saved:', quotationData);

    if (quotationError) throw quotationError;

    // Insert quotation items
    if (quotation.items && quotation.items.length > 0) {
      console.log('Inserting quotation items:', quotation.items);
      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(
          quotation.items.map(item => ({
            quotation_id: quotationData.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total
          }))
        );

      if (itemsError) {
        console.error('Error inserting quotation items:', itemsError);
        throw itemsError;
      }
    }

    // Fetch the complete quotation with items
    const { data: completeQuotation, error: fetchError } = await supabase
      .from('quotations')
      .select(QUOTATION_SELECT)
      .eq('id', quotationData.id)
      .single();

    if (fetchError) throw fetchError;
    return completeQuotation;
  },

  async updateQuotation(id: string, quotation: Partial<Quotation>): Promise<Quotation> {
    // Update quotation
    const { error: quotationError } = await supabase
      .from('quotations')
      .update({
        guest_id: quotation.guestId,
        amount: quotation.total,
        subtotal: quotation.subtotal,
        tax: quotation.tax,
        status: quotation.status,
        valid_until: quotation.validUntil,
        date: quotation.date,
        notes: quotation.notes
      })
      .eq('id', id);

    if (quotationError) throw quotationError;

    // Update items if provided
    if (quotation.items) {
      // Delete existing items
      const { error: deleteError } = await supabase
        .from('quotation_items')
        .delete()
        .eq('quotation_id', id);

      if (deleteError) throw deleteError;

      // Insert new items
      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(
          quotation.items.map(item => ({
            quotation_id: id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total: item.quantity * item.unitPrice
          }))
        );

      if (itemsError) throw itemsError;
    }

    // Get the complete updated quotation
    const { data: updatedQuotation, error: getError } = await supabase
      .from('quotations')
      .select(QUOTATION_SELECT)
      .eq('id', id)
      .single();

    if (getError) throw getError;
    return updatedQuotation;
  },

  async deleteQuotation(id: string): Promise<void> {
    // Items will be automatically deleted due to ON DELETE CASCADE
    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getQuotationsByGuest(guestId: string): Promise<Quotation[]> {
    const { data, error } = await supabase
      .from('quotations')
      .select(QUOTATION_SELECT)
      .eq('guest_id', guestId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
