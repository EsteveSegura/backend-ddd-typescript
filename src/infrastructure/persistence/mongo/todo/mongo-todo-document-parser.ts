import { UUID } from 'mongodb';
import { Todo, TodoStatus } from '../../../../domain/todo';
import DocumentParser from '../../document-parser';
import { TodoDocument } from './todo-document';

export default class MongoTodoDocumentParser implements DocumentParser<TodoDocument, Todo> {
  toDocument(domain: Todo): TodoDocument {
    return {
      _id: new UUID(domain.id),
      title: domain.title,
      description: domain.description,
      status: domain.status,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  toDomain(document: TodoDocument): Todo {
    return new Todo({
      id: document._id.toString(),
      title: document.title,
      description: document.description ?? undefined,
      status: document.status as TodoStatus,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }
}
