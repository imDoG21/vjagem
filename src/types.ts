export interface Pattern {
  id: string;
  cardNumber: string;
  author: string;
  difficulty: number; // 1-3
  finishedSize: string;
  knittingTime: string;
  dateCreated: string;
  name: string;
  photo: string; // base64
  materials: string;
  abbreviations: string;
  scheme: string;
  assembly: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export const emptyPattern: Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'> = {
  cardNumber: '',
  author: '',
  difficulty: 1,
  finishedSize: '',
  knittingTime: '',
  dateCreated: '',
  name: '',
  photo: '',
  materials: '',
  abbreviations: '',
  scheme: '',
  assembly: '',
  notes: '',
};
