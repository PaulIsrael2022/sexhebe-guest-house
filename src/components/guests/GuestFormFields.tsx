import React from 'react';
import { User, Mail, Phone, CreditCard, MapPin } from 'lucide-react';
import { FormField } from '../ui/FormField';
import { Guest } from '../../types';

interface GuestFormFieldsProps {
  formData: Omit<Guest, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Guest, 'id'>>>;
}

export function GuestFormFields({ formData, setFormData }: GuestFormFieldsProps) {
  const handleChange = (field: keyof Omit<Guest, 'id'>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Full Name"
        icon={User}
        type="text"
        value={formData.name}
        onChange={handleChange('name')}
        placeholder="Enter guest's full name"
        required
      />

      <FormField
        label="Email"
        icon={Mail}
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        placeholder="Enter guest's email"
        required
      />

      <FormField
        label="Phone"
        icon={Phone}
        type="tel"
        value={formData.phone}
        onChange={handleChange('phone')}
        placeholder="Enter guest's phone number"
        required
      />

      <FormField
        label="ID Number"
        icon={CreditCard}
        type="text"
        value={formData.idNumber}
        onChange={handleChange('idNumber')}
        placeholder="Enter guest's ID number"
        required
      />

      <FormField
        label="Address"
        icon={MapPin}
        type="text"
        value={formData.address}
        onChange={handleChange('address')}
        placeholder="Enter guest's address"
        required
      />
    </div>
  );
}