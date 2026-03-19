'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Plus, X } from 'lucide-react';

interface StringListInputProps {
  name: string;
  label: string;
  defaultValue?: string[];
}

export function StringListInput({ name, label, defaultValue = [''] }: StringListInputProps) {
  const [items, setItems] = useState<string[]>(defaultValue.length > 0 ? defaultValue : ['']);

  function addItem() {
    setItems([...items, '']);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, value: string) {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              name={`${name}[${index}]`}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
            />
            {items.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="mr-1 h-3 w-3" />
        Add Item
      </Button>
    </div>
  );
}
