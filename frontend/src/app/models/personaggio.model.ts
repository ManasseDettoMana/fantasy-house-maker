export interface PersonaggioRequest {
  nome: string;
  ruolo: string;
  descrizione: string;
  eta: number;
  casataId: number;
}

export interface PersonaggioResponse {
  id: number;
  nome: string;
  ruolo: string;
  descrizione: string;
  eta: number;
  casataId: number;
  casataNome: string;
}