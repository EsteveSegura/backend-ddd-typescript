import { UUID } from 'mongodb';

export interface TodoDocument {
  _id: UUID;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
