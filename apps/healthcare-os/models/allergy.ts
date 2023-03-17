export interface AllergyModel {
  id: string;
  substance: string;
  severity_of_reaction: 'moderate' | 'severe' | 'mild';
  symptoms: string;
  notes: string;
  created_at: string;
}
