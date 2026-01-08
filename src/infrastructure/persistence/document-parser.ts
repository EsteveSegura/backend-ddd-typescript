export default interface DocumentParser<TDocument, TDomain> {
  toDocument(domain: TDomain): TDocument;
  toDomain(document: TDocument): TDomain;
}
