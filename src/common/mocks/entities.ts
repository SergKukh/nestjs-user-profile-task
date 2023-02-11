export const createQueryBuilder = {
  update: () => createQueryBuilder,
  delete: () => createQueryBuilder,
  insert: () => createQueryBuilder,
  from: () => createQueryBuilder,
  into: () => createQueryBuilder,
  set: () => createQueryBuilder,
  values: () => createQueryBuilder,
  where: () => createQueryBuilder,
  execute: () => ({}),
};

export const mockRepository = {
  createQueryBuilder: () => createQueryBuilder,
};
