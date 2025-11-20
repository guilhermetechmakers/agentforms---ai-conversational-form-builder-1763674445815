export interface Visitor {
  id: string;
  consent_given: boolean;
  ip_address: string | null;
  browser_info: Record<string, any> | null;
  created_at: string;
}

export interface VisitorInsert {
  id?: string;
  consent_given?: boolean;
  ip_address?: string | null;
  browser_info?: Record<string, any> | null;
}

export interface VisitorUpdate {
  consent_given?: boolean;
  ip_address?: string | null;
  browser_info?: Record<string, any> | null;
}
