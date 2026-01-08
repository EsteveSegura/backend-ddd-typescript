export interface IdGenerator {
  generate(): string;
}

export interface IdGeneratorDeps {
  uuidv4: () => string;
}

export const createIdGenerator = ({ uuidv4 }: IdGeneratorDeps): IdGenerator => ({
  generate: () => uuidv4(),
});
