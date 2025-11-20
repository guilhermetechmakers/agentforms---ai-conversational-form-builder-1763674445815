export interface FieldValue {
  id: string;
  session_id: string;
  field_key: string;
  value: any; // JSONB
  created_at: string;
}

export interface FieldValueInsert {
  id?: string;
  session_id: string;
  field_key: string;
  value?: any;
}

export interface FieldValueUpdate {
  field_key?: string;
  value?: any;
}
