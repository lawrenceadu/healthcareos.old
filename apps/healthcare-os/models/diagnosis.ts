export interface DiagnosisModel {
  id: string;
  code: string;
  name: string;
  description: string;
  gdrg: DiagnosisGDRDModel | DiagnosisGDRDModel[];
}

export interface DiagnosisGDRDModel {
  code: string;
  name: string;
  id: string;
  description: string;
}
