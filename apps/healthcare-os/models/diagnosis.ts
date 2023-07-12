export interface DiagnosisModel {
  id: string;
  code: string;
  name: string;
  description: string;
  gdrg:
    | { code: string; name; string; id: string }
    | { code: string; name: string; id: string }[];
}
