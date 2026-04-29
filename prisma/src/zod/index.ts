import { z } from 'zod';
import type { Prisma } from '../client/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','email','name','password']);

export const CollectionScalarFieldEnumSchema = z.enum(['id','name','defaultListId','userId']);

export const ListScalarFieldEnumSchema = z.enum(['id','name','protected','backgroundColor','startingRating','collectionId']);

export const ItemScalarFieldEnumSchema = z.enum(['id','name','description','rating','collectionId','listId','prevId','nextId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  collections: CollectionWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  collections: z.lazy(() => CollectionWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// COLLECTION SCHEMA
/////////////////////////////////////////

export const CollectionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  /**
   * ID of the list that newly added items are placed into by default
   */
  defaultListId: z.string().nullable(),
  userId: z.number().int(),
})

export type Collection = z.infer<typeof CollectionSchema>

// COLLECTION RELATION SCHEMA
//------------------------------------------------------

export type CollectionRelations = {
  user: UserWithRelations;
  lists: ListWithRelations[];
  items: ItemWithRelations[];
};

export type CollectionWithRelations = z.infer<typeof CollectionSchema> & CollectionRelations

export const CollectionWithRelationsSchema: z.ZodType<CollectionWithRelations> = CollectionSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  lists: z.lazy(() => ListWithRelationsSchema).array(),
  items: z.lazy(() => ItemWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// LIST SCHEMA
/////////////////////////////////////////

export const ListSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  /**
   * When true the list cannot be deleted or renamed by the user
   */
  protected: z.boolean(),
  backgroundColor: z.string().nullable(),
  startingRating: z.number().nullable(),
  collectionId: z.string(),
})

export type List = z.infer<typeof ListSchema>

// LIST RELATION SCHEMA
//------------------------------------------------------

export type ListRelations = {
  collection: CollectionWithRelations;
  items: ItemWithRelations[];
};

export type ListWithRelations = z.infer<typeof ListSchema> & ListRelations

export const ListWithRelationsSchema: z.ZodType<ListWithRelations> = ListSchema.merge(z.object({
  collection: z.lazy(() => CollectionWithRelationsSchema),
  items: z.lazy(() => ItemWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ITEM SCHEMA
/////////////////////////////////////////

export const ItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  /**
   * Computed from linked-list position within the list's startingRating
   */
  rating: z.number().nullable(),
  collectionId: z.string(),
  listId: z.string(),
  /**
   * ID of the item that comes immediately before this one in the list (null = head)
   */
  prevId: z.number().int().nullable(),
  /**
   * ID of the item that comes immediately after this one in the list (null = tail)
   */
  nextId: z.number().int().nullable(),
})

export type Item = z.infer<typeof ItemSchema>

// ITEM RELATION SCHEMA
//------------------------------------------------------

export type ItemRelations = {
  prev?: ItemWithRelations | null;
  prevOf?: ItemWithRelations | null;
  next?: ItemWithRelations | null;
  nextOf?: ItemWithRelations | null;
  collection: CollectionWithRelations;
  list: ListWithRelations;
};

export type ItemWithRelations = z.infer<typeof ItemSchema> & ItemRelations

export const ItemWithRelationsSchema: z.ZodType<ItemWithRelations> = ItemSchema.merge(z.object({
  prev: z.lazy(() => ItemWithRelationsSchema).nullable(),
  prevOf: z.lazy(() => ItemWithRelationsSchema).nullable(),
  next: z.lazy(() => ItemWithRelationsSchema).nullable(),
  nextOf: z.lazy(() => ItemWithRelationsSchema).nullable(),
  collection: z.lazy(() => CollectionWithRelationsSchema),
  list: z.lazy(() => ListWithRelationsSchema),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  collections: z.union([z.boolean(),z.lazy(() => CollectionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  collections: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  password: z.boolean().optional(),
  collections: z.union([z.boolean(),z.lazy(() => CollectionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COLLECTION
//------------------------------------------------------

export const CollectionIncludeSchema: z.ZodType<Prisma.CollectionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  lists: z.union([z.boolean(),z.lazy(() => ListFindManyArgsSchema)]).optional(),
  items: z.union([z.boolean(),z.lazy(() => ItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CollectionCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const CollectionArgsSchema: z.ZodType<Prisma.CollectionDefaultArgs> = z.object({
  select: z.lazy(() => CollectionSelectSchema).optional(),
  include: z.lazy(() => CollectionIncludeSchema).optional(),
}).strict();

export const CollectionCountOutputTypeArgsSchema: z.ZodType<Prisma.CollectionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CollectionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CollectionCountOutputTypeSelectSchema: z.ZodType<Prisma.CollectionCountOutputTypeSelect> = z.object({
  lists: z.boolean().optional(),
  items: z.boolean().optional(),
}).strict();

export const CollectionSelectSchema: z.ZodType<Prisma.CollectionSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  defaultListId: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  lists: z.union([z.boolean(),z.lazy(() => ListFindManyArgsSchema)]).optional(),
  items: z.union([z.boolean(),z.lazy(() => ItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CollectionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// LIST
//------------------------------------------------------

export const ListIncludeSchema: z.ZodType<Prisma.ListInclude> = z.object({
  collection: z.union([z.boolean(),z.lazy(() => CollectionArgsSchema)]).optional(),
  items: z.union([z.boolean(),z.lazy(() => ItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ListCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ListArgsSchema: z.ZodType<Prisma.ListDefaultArgs> = z.object({
  select: z.lazy(() => ListSelectSchema).optional(),
  include: z.lazy(() => ListIncludeSchema).optional(),
}).strict();

export const ListCountOutputTypeArgsSchema: z.ZodType<Prisma.ListCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ListCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ListCountOutputTypeSelectSchema: z.ZodType<Prisma.ListCountOutputTypeSelect> = z.object({
  items: z.boolean().optional(),
}).strict();

export const ListSelectSchema: z.ZodType<Prisma.ListSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  protected: z.boolean().optional(),
  backgroundColor: z.boolean().optional(),
  startingRating: z.boolean().optional(),
  collectionId: z.boolean().optional(),
  collection: z.union([z.boolean(),z.lazy(() => CollectionArgsSchema)]).optional(),
  items: z.union([z.boolean(),z.lazy(() => ItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ListCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ITEM
//------------------------------------------------------

export const ItemIncludeSchema: z.ZodType<Prisma.ItemInclude> = z.object({
  prev: z.union([z.boolean(),z.lazy(() => ItemArgsSchema)]).optional(),
  prevOf: z.union([z.boolean(),z.lazy(() => ItemArgsSchema)]).optional(),
  next: z.union([z.boolean(),z.lazy(() => ItemArgsSchema)]).optional(),
  nextOf: z.union([z.boolean(),z.lazy(() => ItemArgsSchema)]).optional(),
  collection: z.union([z.boolean(),z.lazy(() => CollectionArgsSchema)]).optional(),
  list: z.union([z.boolean(),z.lazy(() => ListArgsSchema)]).optional(),
}).strict();

export const ItemArgsSchema: z.ZodType<Prisma.ItemDefaultArgs> = z.object({
  select: z.lazy(() => ItemSelectSchema).optional(),
  include: z.lazy(() => ItemIncludeSchema).optional(),
}).strict();

export const ItemSelectSchema: z.ZodType<Prisma.ItemSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  rating: z.boolean().optional(),
  collectionId: z.boolean().optional(),
  listId: z.boolean().optional(),
  prevId: z.boolean().optional(),
  nextId: z.boolean().optional(),
  prev: z.union([z.boolean(),z.lazy(() => ItemArgsSchema)]).optional(),
  prevOf: z.union([z.boolean(),z.lazy(() => ItemArgsSchema)]).optional(),
  next: z.union([z.boolean(),z.lazy(() => ItemArgsSchema)]).optional(),
  nextOf: z.union([z.boolean(),z.lazy(() => ItemArgsSchema)]).optional(),
  collection: z.union([z.boolean(),z.lazy(() => CollectionArgsSchema)]).optional(),
  list: z.union([z.boolean(),z.lazy(() => ListArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  collections: z.lazy(() => CollectionListRelationFilterSchema).optional(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  collections: z.lazy(() => CollectionOrderByRelationAggregateInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    username: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.number().int(),
    username: z.string(),
  }),
  z.object({
    id: z.number().int(),
    email: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    username: z.string(),
    email: z.string(),
  }),
  z.object({
    username: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  collections: z.lazy(() => CollectionListRelationFilterSchema).optional(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const CollectionWhereInputSchema: z.ZodType<Prisma.CollectionWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CollectionWhereInputSchema), z.lazy(() => CollectionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionWhereInputSchema), z.lazy(() => CollectionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  defaultListId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  lists: z.lazy(() => ListListRelationFilterSchema).optional(),
  items: z.lazy(() => ItemListRelationFilterSchema).optional(),
});

export const CollectionOrderByWithRelationInputSchema: z.ZodType<Prisma.CollectionOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  defaultListId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  lists: z.lazy(() => ListOrderByRelationAggregateInputSchema).optional(),
  items: z.lazy(() => ItemOrderByRelationAggregateInputSchema).optional(),
});

export const CollectionWhereUniqueInputSchema: z.ZodType<Prisma.CollectionWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => CollectionWhereInputSchema), z.lazy(() => CollectionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionWhereInputSchema), z.lazy(() => CollectionWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  defaultListId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  lists: z.lazy(() => ListListRelationFilterSchema).optional(),
  items: z.lazy(() => ItemListRelationFilterSchema).optional(),
}));

export const CollectionOrderByWithAggregationInputSchema: z.ZodType<Prisma.CollectionOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  defaultListId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CollectionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CollectionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CollectionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CollectionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CollectionSumOrderByAggregateInputSchema).optional(),
});

export const CollectionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CollectionScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema), z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema), z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  defaultListId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const ListWhereInputSchema: z.ZodType<Prisma.ListWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ListWhereInputSchema), z.lazy(() => ListWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListWhereInputSchema), z.lazy(() => ListWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  protected: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  backgroundColor: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  startingRating: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  collectionId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  collection: z.union([ z.lazy(() => CollectionScalarRelationFilterSchema), z.lazy(() => CollectionWhereInputSchema) ]).optional(),
  items: z.lazy(() => ItemListRelationFilterSchema).optional(),
});

export const ListOrderByWithRelationInputSchema: z.ZodType<Prisma.ListOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  protected: z.lazy(() => SortOrderSchema).optional(),
  backgroundColor: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  startingRating: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  collection: z.lazy(() => CollectionOrderByWithRelationInputSchema).optional(),
  items: z.lazy(() => ItemOrderByRelationAggregateInputSchema).optional(),
});

export const ListWhereUniqueInputSchema: z.ZodType<Prisma.ListWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => ListWhereInputSchema), z.lazy(() => ListWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListWhereInputSchema), z.lazy(() => ListWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  protected: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  backgroundColor: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  startingRating: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  collectionId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  collection: z.union([ z.lazy(() => CollectionScalarRelationFilterSchema), z.lazy(() => CollectionWhereInputSchema) ]).optional(),
  items: z.lazy(() => ItemListRelationFilterSchema).optional(),
}));

export const ListOrderByWithAggregationInputSchema: z.ZodType<Prisma.ListOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  protected: z.lazy(() => SortOrderSchema).optional(),
  backgroundColor: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  startingRating: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ListCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ListAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ListMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ListMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ListSumOrderByAggregateInputSchema).optional(),
});

export const ListScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ListScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ListScalarWhereWithAggregatesInputSchema), z.lazy(() => ListScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListScalarWhereWithAggregatesInputSchema), z.lazy(() => ListScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  protected: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  backgroundColor: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  startingRating: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  collectionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ItemWhereInputSchema: z.ZodType<Prisma.ItemWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ItemWhereInputSchema), z.lazy(() => ItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ItemWhereInputSchema), z.lazy(() => ItemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  rating: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  collectionId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  listId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  prevId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  nextId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  prev: z.union([ z.lazy(() => ItemNullableScalarRelationFilterSchema), z.lazy(() => ItemWhereInputSchema) ]).optional().nullable(),
  prevOf: z.union([ z.lazy(() => ItemNullableScalarRelationFilterSchema), z.lazy(() => ItemWhereInputSchema) ]).optional().nullable(),
  next: z.union([ z.lazy(() => ItemNullableScalarRelationFilterSchema), z.lazy(() => ItemWhereInputSchema) ]).optional().nullable(),
  nextOf: z.union([ z.lazy(() => ItemNullableScalarRelationFilterSchema), z.lazy(() => ItemWhereInputSchema) ]).optional().nullable(),
  collection: z.union([ z.lazy(() => CollectionScalarRelationFilterSchema), z.lazy(() => CollectionWhereInputSchema) ]).optional(),
  list: z.union([ z.lazy(() => ListScalarRelationFilterSchema), z.lazy(() => ListWhereInputSchema) ]).optional(),
});

export const ItemOrderByWithRelationInputSchema: z.ZodType<Prisma.ItemOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  rating: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  listId: z.lazy(() => SortOrderSchema).optional(),
  prevId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  nextId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  prev: z.lazy(() => ItemOrderByWithRelationInputSchema).optional(),
  prevOf: z.lazy(() => ItemOrderByWithRelationInputSchema).optional(),
  next: z.lazy(() => ItemOrderByWithRelationInputSchema).optional(),
  nextOf: z.lazy(() => ItemOrderByWithRelationInputSchema).optional(),
  collection: z.lazy(() => CollectionOrderByWithRelationInputSchema).optional(),
  list: z.lazy(() => ListOrderByWithRelationInputSchema).optional(),
});

export const ItemWhereUniqueInputSchema: z.ZodType<Prisma.ItemWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    prevId: z.number().int(),
    nextId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    prevId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    nextId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    prevId: z.number().int(),
    nextId: z.number().int(),
  }),
  z.object({
    prevId: z.number().int(),
  }),
  z.object({
    nextId: z.number().int(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  prevId: z.number().int().optional(),
  nextId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ItemWhereInputSchema), z.lazy(() => ItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ItemWhereInputSchema), z.lazy(() => ItemWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  rating: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  collectionId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  listId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  prev: z.union([ z.lazy(() => ItemNullableScalarRelationFilterSchema), z.lazy(() => ItemWhereInputSchema) ]).optional().nullable(),
  prevOf: z.union([ z.lazy(() => ItemNullableScalarRelationFilterSchema), z.lazy(() => ItemWhereInputSchema) ]).optional().nullable(),
  next: z.union([ z.lazy(() => ItemNullableScalarRelationFilterSchema), z.lazy(() => ItemWhereInputSchema) ]).optional().nullable(),
  nextOf: z.union([ z.lazy(() => ItemNullableScalarRelationFilterSchema), z.lazy(() => ItemWhereInputSchema) ]).optional().nullable(),
  collection: z.union([ z.lazy(() => CollectionScalarRelationFilterSchema), z.lazy(() => CollectionWhereInputSchema) ]).optional(),
  list: z.union([ z.lazy(() => ListScalarRelationFilterSchema), z.lazy(() => ListWhereInputSchema) ]).optional(),
}));

export const ItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.ItemOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  rating: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  listId: z.lazy(() => SortOrderSchema).optional(),
  prevId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  nextId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ItemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ItemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ItemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ItemSumOrderByAggregateInputSchema).optional(),
});

export const ItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ItemScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ItemScalarWhereWithAggregatesInputSchema), z.lazy(() => ItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ItemScalarWhereWithAggregatesInputSchema), z.lazy(() => ItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  rating: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  collectionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  listId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  prevId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  nextId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  username: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
  collections: z.lazy(() => CollectionCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
  collections: z.lazy(() => CollectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CollectionCreateInputSchema: z.ZodType<Prisma.CollectionCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutCollectionsInputSchema),
  lists: z.lazy(() => ListCreateNestedManyWithoutCollectionInputSchema).optional(),
  items: z.lazy(() => ItemCreateNestedManyWithoutCollectionInputSchema).optional(),
});

export const CollectionUncheckedCreateInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
  userId: z.number().int(),
  lists: z.lazy(() => ListUncheckedCreateNestedManyWithoutCollectionInputSchema).optional(),
  items: z.lazy(() => ItemUncheckedCreateNestedManyWithoutCollectionInputSchema).optional(),
});

export const CollectionUpdateInputSchema: z.ZodType<Prisma.CollectionUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  lists: z.lazy(() => ListUpdateManyWithoutCollectionNestedInputSchema).optional(),
  items: z.lazy(() => ItemUpdateManyWithoutCollectionNestedInputSchema).optional(),
});

export const CollectionUncheckedUpdateInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  lists: z.lazy(() => ListUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional(),
  items: z.lazy(() => ItemUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional(),
});

export const CollectionCreateManyInputSchema: z.ZodType<Prisma.CollectionCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
  userId: z.number().int(),
});

export const CollectionUpdateManyMutationInputSchema: z.ZodType<Prisma.CollectionUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const CollectionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ListCreateInputSchema: z.ZodType<Prisma.ListCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().optional().nullable(),
  startingRating: z.number().optional().nullable(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutListsInputSchema),
  items: z.lazy(() => ItemCreateNestedManyWithoutListInputSchema).optional(),
});

export const ListUncheckedCreateInputSchema: z.ZodType<Prisma.ListUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().optional().nullable(),
  startingRating: z.number().optional().nullable(),
  collectionId: z.string(),
  items: z.lazy(() => ItemUncheckedCreateNestedManyWithoutListInputSchema).optional(),
});

export const ListUpdateInputSchema: z.ZodType<Prisma.ListUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  backgroundColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startingRating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutListsNestedInputSchema).optional(),
  items: z.lazy(() => ItemUpdateManyWithoutListNestedInputSchema).optional(),
});

export const ListUncheckedUpdateInputSchema: z.ZodType<Prisma.ListUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  backgroundColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startingRating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => ItemUncheckedUpdateManyWithoutListNestedInputSchema).optional(),
});

export const ListCreateManyInputSchema: z.ZodType<Prisma.ListCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().optional().nullable(),
  startingRating: z.number().optional().nullable(),
  collectionId: z.string(),
});

export const ListUpdateManyMutationInputSchema: z.ZodType<Prisma.ListUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  backgroundColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startingRating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ListUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ListUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  backgroundColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startingRating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ItemCreateInputSchema: z.ZodType<Prisma.ItemCreateInput> = z.strictObject({
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  prev: z.lazy(() => ItemCreateNestedOneWithoutPrevOfInputSchema).optional(),
  prevOf: z.lazy(() => ItemCreateNestedOneWithoutPrevInputSchema).optional(),
  next: z.lazy(() => ItemCreateNestedOneWithoutNextOfInputSchema).optional(),
  nextOf: z.lazy(() => ItemCreateNestedOneWithoutNextInputSchema).optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutItemsInputSchema),
  list: z.lazy(() => ListCreateNestedOneWithoutItemsInputSchema),
});

export const ItemUncheckedCreateInputSchema: z.ZodType<Prisma.ItemUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  collectionId: z.string(),
  listId: z.string(),
  prevId: z.number().int().optional().nullable(),
  nextId: z.number().int().optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutPrevInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutNextInputSchema).optional(),
});

export const ItemUpdateInputSchema: z.ZodType<Prisma.ItemUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prev: z.lazy(() => ItemUpdateOneWithoutPrevOfNestedInputSchema).optional(),
  prevOf: z.lazy(() => ItemUpdateOneWithoutPrevNestedInputSchema).optional(),
  next: z.lazy(() => ItemUpdateOneWithoutNextOfNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUpdateOneWithoutNextNestedInputSchema).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  list: z.lazy(() => ListUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const ItemUncheckedUpdateInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prevId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nextId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedUpdateOneWithoutPrevNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedUpdateOneWithoutNextNestedInputSchema).optional(),
});

export const ItemCreateManyInputSchema: z.ZodType<Prisma.ItemCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  collectionId: z.string(),
  listId: z.string(),
  prevId: z.number().int().optional().nullable(),
  nextId: z.number().int().optional().nullable(),
});

export const ItemUpdateManyMutationInputSchema: z.ZodType<Prisma.ItemUpdateManyMutationInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prevId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nextId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const CollectionListRelationFilterSchema: z.ZodType<Prisma.CollectionListRelationFilter> = z.strictObject({
  every: z.lazy(() => CollectionWhereInputSchema).optional(),
  some: z.lazy(() => CollectionWhereInputSchema).optional(),
  none: z.lazy(() => CollectionWhereInputSchema).optional(),
});

export const CollectionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CollectionOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const ListListRelationFilterSchema: z.ZodType<Prisma.ListListRelationFilter> = z.strictObject({
  every: z.lazy(() => ListWhereInputSchema).optional(),
  some: z.lazy(() => ListWhereInputSchema).optional(),
  none: z.lazy(() => ListWhereInputSchema).optional(),
});

export const ItemListRelationFilterSchema: z.ZodType<Prisma.ItemListRelationFilter> = z.strictObject({
  every: z.lazy(() => ItemWhereInputSchema).optional(),
  some: z.lazy(() => ItemWhereInputSchema).optional(),
  none: z.lazy(() => ItemWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const ListOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ListOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ItemOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const CollectionCountOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  defaultListId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const CollectionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionAvgOrderByAggregateInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const CollectionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  defaultListId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const CollectionMinOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  defaultListId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const CollectionSumOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionSumOrderByAggregateInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const CollectionScalarRelationFilterSchema: z.ZodType<Prisma.CollectionScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => CollectionWhereInputSchema).optional(),
  isNot: z.lazy(() => CollectionWhereInputSchema).optional(),
});

export const ListCountOrderByAggregateInputSchema: z.ZodType<Prisma.ListCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  protected: z.lazy(() => SortOrderSchema).optional(),
  backgroundColor: z.lazy(() => SortOrderSchema).optional(),
  startingRating: z.lazy(() => SortOrderSchema).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
});

export const ListAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ListAvgOrderByAggregateInput> = z.strictObject({
  startingRating: z.lazy(() => SortOrderSchema).optional(),
});

export const ListMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ListMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  protected: z.lazy(() => SortOrderSchema).optional(),
  backgroundColor: z.lazy(() => SortOrderSchema).optional(),
  startingRating: z.lazy(() => SortOrderSchema).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
});

export const ListMinOrderByAggregateInputSchema: z.ZodType<Prisma.ListMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  protected: z.lazy(() => SortOrderSchema).optional(),
  backgroundColor: z.lazy(() => SortOrderSchema).optional(),
  startingRating: z.lazy(() => SortOrderSchema).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
});

export const ListSumOrderByAggregateInputSchema: z.ZodType<Prisma.ListSumOrderByAggregateInput> = z.strictObject({
  startingRating: z.lazy(() => SortOrderSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const ItemNullableScalarRelationFilterSchema: z.ZodType<Prisma.ItemNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ItemWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ItemWhereInputSchema).optional().nullable(),
});

export const ListScalarRelationFilterSchema: z.ZodType<Prisma.ListScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ListWhereInputSchema).optional(),
  isNot: z.lazy(() => ListWhereInputSchema).optional(),
});

export const ItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.ItemCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  listId: z.lazy(() => SortOrderSchema).optional(),
  prevId: z.lazy(() => SortOrderSchema).optional(),
  nextId: z.lazy(() => SortOrderSchema).optional(),
});

export const ItemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ItemAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  prevId: z.lazy(() => SortOrderSchema).optional(),
  nextId: z.lazy(() => SortOrderSchema).optional(),
});

export const ItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ItemMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  listId: z.lazy(() => SortOrderSchema).optional(),
  prevId: z.lazy(() => SortOrderSchema).optional(),
  nextId: z.lazy(() => SortOrderSchema).optional(),
});

export const ItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.ItemMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  listId: z.lazy(() => SortOrderSchema).optional(),
  prevId: z.lazy(() => SortOrderSchema).optional(),
  nextId: z.lazy(() => SortOrderSchema).optional(),
});

export const ItemSumOrderByAggregateInputSchema: z.ZodType<Prisma.ItemSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  prevId: z.lazy(() => SortOrderSchema).optional(),
  nextId: z.lazy(() => SortOrderSchema).optional(),
});

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const CollectionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CollectionCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema), z.lazy(() => CollectionCreateWithoutUserInputSchema).array(), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema), z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
});

export const CollectionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema), z.lazy(() => CollectionCreateWithoutUserInputSchema).array(), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema), z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const CollectionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CollectionUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema), z.lazy(() => CollectionCreateWithoutUserInputSchema).array(), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema), z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionScalarWhereInputSchema), z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const CollectionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema), z.lazy(() => CollectionCreateWithoutUserInputSchema).array(), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema), z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema), z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionScalarWhereInputSchema), z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutCollectionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCollectionsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutCollectionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const ListCreateNestedManyWithoutCollectionInputSchema: z.ZodType<Prisma.ListCreateNestedManyWithoutCollectionInput> = z.strictObject({
  create: z.union([ z.lazy(() => ListCreateWithoutCollectionInputSchema), z.lazy(() => ListCreateWithoutCollectionInputSchema).array(), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ListCreateOrConnectWithoutCollectionInputSchema), z.lazy(() => ListCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ListCreateManyCollectionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
});

export const ItemCreateNestedManyWithoutCollectionInputSchema: z.ZodType<Prisma.ItemCreateNestedManyWithoutCollectionInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutCollectionInputSchema), z.lazy(() => ItemCreateWithoutCollectionInputSchema).array(), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ItemCreateOrConnectWithoutCollectionInputSchema), z.lazy(() => ItemCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ItemCreateManyCollectionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
});

export const ListUncheckedCreateNestedManyWithoutCollectionInputSchema: z.ZodType<Prisma.ListUncheckedCreateNestedManyWithoutCollectionInput> = z.strictObject({
  create: z.union([ z.lazy(() => ListCreateWithoutCollectionInputSchema), z.lazy(() => ListCreateWithoutCollectionInputSchema).array(), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ListCreateOrConnectWithoutCollectionInputSchema), z.lazy(() => ListCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ListCreateManyCollectionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
});

export const ItemUncheckedCreateNestedManyWithoutCollectionInputSchema: z.ZodType<Prisma.ItemUncheckedCreateNestedManyWithoutCollectionInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutCollectionInputSchema), z.lazy(() => ItemCreateWithoutCollectionInputSchema).array(), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ItemCreateOrConnectWithoutCollectionInputSchema), z.lazy(() => ItemCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ItemCreateManyCollectionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const UserUpdateOneRequiredWithoutCollectionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCollectionsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutCollectionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCollectionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCollectionsInputSchema), z.lazy(() => UserUpdateWithoutCollectionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutCollectionsInputSchema) ]).optional(),
});

export const ListUpdateManyWithoutCollectionNestedInputSchema: z.ZodType<Prisma.ListUpdateManyWithoutCollectionNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ListCreateWithoutCollectionInputSchema), z.lazy(() => ListCreateWithoutCollectionInputSchema).array(), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ListCreateOrConnectWithoutCollectionInputSchema), z.lazy(() => ListCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ListUpsertWithWhereUniqueWithoutCollectionInputSchema), z.lazy(() => ListUpsertWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ListCreateManyCollectionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ListUpdateWithWhereUniqueWithoutCollectionInputSchema), z.lazy(() => ListUpdateWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ListUpdateManyWithWhereWithoutCollectionInputSchema), z.lazy(() => ListUpdateManyWithWhereWithoutCollectionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ListScalarWhereInputSchema), z.lazy(() => ListScalarWhereInputSchema).array() ]).optional(),
});

export const ItemUpdateManyWithoutCollectionNestedInputSchema: z.ZodType<Prisma.ItemUpdateManyWithoutCollectionNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutCollectionInputSchema), z.lazy(() => ItemCreateWithoutCollectionInputSchema).array(), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ItemCreateOrConnectWithoutCollectionInputSchema), z.lazy(() => ItemCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ItemUpsertWithWhereUniqueWithoutCollectionInputSchema), z.lazy(() => ItemUpsertWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ItemCreateManyCollectionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ItemUpdateWithWhereUniqueWithoutCollectionInputSchema), z.lazy(() => ItemUpdateWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ItemUpdateManyWithWhereWithoutCollectionInputSchema), z.lazy(() => ItemUpdateManyWithWhereWithoutCollectionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ItemScalarWhereInputSchema), z.lazy(() => ItemScalarWhereInputSchema).array() ]).optional(),
});

export const ListUncheckedUpdateManyWithoutCollectionNestedInputSchema: z.ZodType<Prisma.ListUncheckedUpdateManyWithoutCollectionNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ListCreateWithoutCollectionInputSchema), z.lazy(() => ListCreateWithoutCollectionInputSchema).array(), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ListCreateOrConnectWithoutCollectionInputSchema), z.lazy(() => ListCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ListUpsertWithWhereUniqueWithoutCollectionInputSchema), z.lazy(() => ListUpsertWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ListCreateManyCollectionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ListWhereUniqueInputSchema), z.lazy(() => ListWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ListUpdateWithWhereUniqueWithoutCollectionInputSchema), z.lazy(() => ListUpdateWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ListUpdateManyWithWhereWithoutCollectionInputSchema), z.lazy(() => ListUpdateManyWithWhereWithoutCollectionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ListScalarWhereInputSchema), z.lazy(() => ListScalarWhereInputSchema).array() ]).optional(),
});

export const ItemUncheckedUpdateManyWithoutCollectionNestedInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateManyWithoutCollectionNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutCollectionInputSchema), z.lazy(() => ItemCreateWithoutCollectionInputSchema).array(), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ItemCreateOrConnectWithoutCollectionInputSchema), z.lazy(() => ItemCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ItemUpsertWithWhereUniqueWithoutCollectionInputSchema), z.lazy(() => ItemUpsertWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ItemCreateManyCollectionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ItemUpdateWithWhereUniqueWithoutCollectionInputSchema), z.lazy(() => ItemUpdateWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ItemUpdateManyWithWhereWithoutCollectionInputSchema), z.lazy(() => ItemUpdateManyWithWhereWithoutCollectionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ItemScalarWhereInputSchema), z.lazy(() => ItemScalarWhereInputSchema).array() ]).optional(),
});

export const CollectionCreateNestedOneWithoutListsInputSchema: z.ZodType<Prisma.CollectionCreateNestedOneWithoutListsInput> = z.strictObject({
  create: z.union([ z.lazy(() => CollectionCreateWithoutListsInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutListsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CollectionCreateOrConnectWithoutListsInputSchema).optional(),
  connect: z.lazy(() => CollectionWhereUniqueInputSchema).optional(),
});

export const ItemCreateNestedManyWithoutListInputSchema: z.ZodType<Prisma.ItemCreateNestedManyWithoutListInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutListInputSchema), z.lazy(() => ItemCreateWithoutListInputSchema).array(), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ItemCreateOrConnectWithoutListInputSchema), z.lazy(() => ItemCreateOrConnectWithoutListInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ItemCreateManyListInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
});

export const ItemUncheckedCreateNestedManyWithoutListInputSchema: z.ZodType<Prisma.ItemUncheckedCreateNestedManyWithoutListInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutListInputSchema), z.lazy(() => ItemCreateWithoutListInputSchema).array(), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ItemCreateOrConnectWithoutListInputSchema), z.lazy(() => ItemCreateOrConnectWithoutListInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ItemCreateManyListInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const CollectionUpdateOneRequiredWithoutListsNestedInputSchema: z.ZodType<Prisma.CollectionUpdateOneRequiredWithoutListsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CollectionCreateWithoutListsInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutListsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CollectionCreateOrConnectWithoutListsInputSchema).optional(),
  upsert: z.lazy(() => CollectionUpsertWithoutListsInputSchema).optional(),
  connect: z.lazy(() => CollectionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateToOneWithWhereWithoutListsInputSchema), z.lazy(() => CollectionUpdateWithoutListsInputSchema), z.lazy(() => CollectionUncheckedUpdateWithoutListsInputSchema) ]).optional(),
});

export const ItemUpdateManyWithoutListNestedInputSchema: z.ZodType<Prisma.ItemUpdateManyWithoutListNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutListInputSchema), z.lazy(() => ItemCreateWithoutListInputSchema).array(), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ItemCreateOrConnectWithoutListInputSchema), z.lazy(() => ItemCreateOrConnectWithoutListInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ItemUpsertWithWhereUniqueWithoutListInputSchema), z.lazy(() => ItemUpsertWithWhereUniqueWithoutListInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ItemCreateManyListInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ItemUpdateWithWhereUniqueWithoutListInputSchema), z.lazy(() => ItemUpdateWithWhereUniqueWithoutListInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ItemUpdateManyWithWhereWithoutListInputSchema), z.lazy(() => ItemUpdateManyWithWhereWithoutListInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ItemScalarWhereInputSchema), z.lazy(() => ItemScalarWhereInputSchema).array() ]).optional(),
});

export const ItemUncheckedUpdateManyWithoutListNestedInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateManyWithoutListNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutListInputSchema), z.lazy(() => ItemCreateWithoutListInputSchema).array(), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ItemCreateOrConnectWithoutListInputSchema), z.lazy(() => ItemCreateOrConnectWithoutListInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ItemUpsertWithWhereUniqueWithoutListInputSchema), z.lazy(() => ItemUpsertWithWhereUniqueWithoutListInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ItemCreateManyListInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ItemWhereUniqueInputSchema), z.lazy(() => ItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ItemUpdateWithWhereUniqueWithoutListInputSchema), z.lazy(() => ItemUpdateWithWhereUniqueWithoutListInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ItemUpdateManyWithWhereWithoutListInputSchema), z.lazy(() => ItemUpdateManyWithWhereWithoutListInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ItemScalarWhereInputSchema), z.lazy(() => ItemScalarWhereInputSchema).array() ]).optional(),
});

export const ItemCreateNestedOneWithoutPrevOfInputSchema: z.ZodType<Prisma.ItemCreateNestedOneWithoutPrevOfInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevOfInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevOfInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutPrevOfInputSchema).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
});

export const ItemCreateNestedOneWithoutPrevInputSchema: z.ZodType<Prisma.ItemCreateNestedOneWithoutPrevInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutPrevInputSchema).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
});

export const ItemCreateNestedOneWithoutNextOfInputSchema: z.ZodType<Prisma.ItemCreateNestedOneWithoutNextOfInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutNextOfInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextOfInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutNextOfInputSchema).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
});

export const ItemCreateNestedOneWithoutNextInputSchema: z.ZodType<Prisma.ItemCreateNestedOneWithoutNextInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutNextInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutNextInputSchema).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
});

export const CollectionCreateNestedOneWithoutItemsInputSchema: z.ZodType<Prisma.CollectionCreateNestedOneWithoutItemsInput> = z.strictObject({
  create: z.union([ z.lazy(() => CollectionCreateWithoutItemsInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CollectionCreateOrConnectWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => CollectionWhereUniqueInputSchema).optional(),
});

export const ListCreateNestedOneWithoutItemsInputSchema: z.ZodType<Prisma.ListCreateNestedOneWithoutItemsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ListCreateWithoutItemsInputSchema), z.lazy(() => ListUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ListCreateOrConnectWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => ListWhereUniqueInputSchema).optional(),
});

export const ItemUncheckedCreateNestedOneWithoutPrevInputSchema: z.ZodType<Prisma.ItemUncheckedCreateNestedOneWithoutPrevInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutPrevInputSchema).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
});

export const ItemUncheckedCreateNestedOneWithoutNextInputSchema: z.ZodType<Prisma.ItemUncheckedCreateNestedOneWithoutNextInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutNextInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutNextInputSchema).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
});

export const ItemUpdateOneWithoutPrevOfNestedInputSchema: z.ZodType<Prisma.ItemUpdateOneWithoutPrevOfNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevOfInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevOfInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutPrevOfInputSchema).optional(),
  upsert: z.lazy(() => ItemUpsertWithoutPrevOfInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ItemUpdateToOneWithWhereWithoutPrevOfInputSchema), z.lazy(() => ItemUpdateWithoutPrevOfInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutPrevOfInputSchema) ]).optional(),
});

export const ItemUpdateOneWithoutPrevNestedInputSchema: z.ZodType<Prisma.ItemUpdateOneWithoutPrevNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutPrevInputSchema).optional(),
  upsert: z.lazy(() => ItemUpsertWithoutPrevInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ItemUpdateToOneWithWhereWithoutPrevInputSchema), z.lazy(() => ItemUpdateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutPrevInputSchema) ]).optional(),
});

export const ItemUpdateOneWithoutNextOfNestedInputSchema: z.ZodType<Prisma.ItemUpdateOneWithoutNextOfNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutNextOfInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextOfInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutNextOfInputSchema).optional(),
  upsert: z.lazy(() => ItemUpsertWithoutNextOfInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ItemUpdateToOneWithWhereWithoutNextOfInputSchema), z.lazy(() => ItemUpdateWithoutNextOfInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutNextOfInputSchema) ]).optional(),
});

export const ItemUpdateOneWithoutNextNestedInputSchema: z.ZodType<Prisma.ItemUpdateOneWithoutNextNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutNextInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutNextInputSchema).optional(),
  upsert: z.lazy(() => ItemUpsertWithoutNextInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ItemUpdateToOneWithWhereWithoutNextInputSchema), z.lazy(() => ItemUpdateWithoutNextInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutNextInputSchema) ]).optional(),
});

export const CollectionUpdateOneRequiredWithoutItemsNestedInputSchema: z.ZodType<Prisma.CollectionUpdateOneRequiredWithoutItemsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CollectionCreateWithoutItemsInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CollectionCreateOrConnectWithoutItemsInputSchema).optional(),
  upsert: z.lazy(() => CollectionUpsertWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => CollectionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateToOneWithWhereWithoutItemsInputSchema), z.lazy(() => CollectionUpdateWithoutItemsInputSchema), z.lazy(() => CollectionUncheckedUpdateWithoutItemsInputSchema) ]).optional(),
});

export const ListUpdateOneRequiredWithoutItemsNestedInputSchema: z.ZodType<Prisma.ListUpdateOneRequiredWithoutItemsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ListCreateWithoutItemsInputSchema), z.lazy(() => ListUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ListCreateOrConnectWithoutItemsInputSchema).optional(),
  upsert: z.lazy(() => ListUpsertWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => ListWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ListUpdateToOneWithWhereWithoutItemsInputSchema), z.lazy(() => ListUpdateWithoutItemsInputSchema), z.lazy(() => ListUncheckedUpdateWithoutItemsInputSchema) ]).optional(),
});

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const ItemUncheckedUpdateOneWithoutPrevNestedInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateOneWithoutPrevNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutPrevInputSchema).optional(),
  upsert: z.lazy(() => ItemUpsertWithoutPrevInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ItemUpdateToOneWithWhereWithoutPrevInputSchema), z.lazy(() => ItemUpdateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutPrevInputSchema) ]).optional(),
});

export const ItemUncheckedUpdateOneWithoutNextNestedInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateOneWithoutNextNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ItemCreateWithoutNextInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ItemCreateOrConnectWithoutNextInputSchema).optional(),
  upsert: z.lazy(() => ItemUpsertWithoutNextInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ItemWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ItemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ItemUpdateToOneWithWhereWithoutNextInputSchema), z.lazy(() => ItemUpdateWithoutNextInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutNextInputSchema) ]).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const CollectionCreateWithoutUserInputSchema: z.ZodType<Prisma.CollectionCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
  lists: z.lazy(() => ListCreateNestedManyWithoutCollectionInputSchema).optional(),
  items: z.lazy(() => ItemCreateNestedManyWithoutCollectionInputSchema).optional(),
});

export const CollectionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
  lists: z.lazy(() => ListUncheckedCreateNestedManyWithoutCollectionInputSchema).optional(),
  items: z.lazy(() => ItemUncheckedCreateNestedManyWithoutCollectionInputSchema).optional(),
});

export const CollectionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.CollectionCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema) ]),
});

export const CollectionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.CollectionCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => CollectionCreateManyUserInputSchema), z.lazy(() => CollectionCreateManyUserInputSchema).array() ]),
});

export const CollectionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CollectionUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CollectionUpdateWithoutUserInputSchema), z.lazy(() => CollectionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema) ]),
});

export const CollectionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CollectionUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CollectionUpdateWithoutUserInputSchema), z.lazy(() => CollectionUncheckedUpdateWithoutUserInputSchema) ]),
});

export const CollectionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.CollectionUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => CollectionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CollectionUpdateManyMutationInputSchema), z.lazy(() => CollectionUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const CollectionScalarWhereInputSchema: z.ZodType<Prisma.CollectionScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CollectionScalarWhereInputSchema), z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionScalarWhereInputSchema), z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  defaultListId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
});

export const UserCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.UserCreateWithoutCollectionsInput> = z.strictObject({
  username: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export const UserUncheckedCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCollectionsInput> = z.strictObject({
  id: z.number().int().optional(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export const UserCreateOrConnectWithoutCollectionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCollectionsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCollectionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutCollectionsInputSchema) ]),
});

export const ListCreateWithoutCollectionInputSchema: z.ZodType<Prisma.ListCreateWithoutCollectionInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().optional().nullable(),
  startingRating: z.number().optional().nullable(),
  items: z.lazy(() => ItemCreateNestedManyWithoutListInputSchema).optional(),
});

export const ListUncheckedCreateWithoutCollectionInputSchema: z.ZodType<Prisma.ListUncheckedCreateWithoutCollectionInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().optional().nullable(),
  startingRating: z.number().optional().nullable(),
  items: z.lazy(() => ItemUncheckedCreateNestedManyWithoutListInputSchema).optional(),
});

export const ListCreateOrConnectWithoutCollectionInputSchema: z.ZodType<Prisma.ListCreateOrConnectWithoutCollectionInput> = z.strictObject({
  where: z.lazy(() => ListWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ListCreateWithoutCollectionInputSchema), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema) ]),
});

export const ListCreateManyCollectionInputEnvelopeSchema: z.ZodType<Prisma.ListCreateManyCollectionInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ListCreateManyCollectionInputSchema), z.lazy(() => ListCreateManyCollectionInputSchema).array() ]),
});

export const ItemCreateWithoutCollectionInputSchema: z.ZodType<Prisma.ItemCreateWithoutCollectionInput> = z.strictObject({
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  prev: z.lazy(() => ItemCreateNestedOneWithoutPrevOfInputSchema).optional(),
  prevOf: z.lazy(() => ItemCreateNestedOneWithoutPrevInputSchema).optional(),
  next: z.lazy(() => ItemCreateNestedOneWithoutNextOfInputSchema).optional(),
  nextOf: z.lazy(() => ItemCreateNestedOneWithoutNextInputSchema).optional(),
  list: z.lazy(() => ListCreateNestedOneWithoutItemsInputSchema),
});

export const ItemUncheckedCreateWithoutCollectionInputSchema: z.ZodType<Prisma.ItemUncheckedCreateWithoutCollectionInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  listId: z.string(),
  prevId: z.number().int().optional().nullable(),
  nextId: z.number().int().optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutPrevInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutNextInputSchema).optional(),
});

export const ItemCreateOrConnectWithoutCollectionInputSchema: z.ZodType<Prisma.ItemCreateOrConnectWithoutCollectionInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ItemCreateWithoutCollectionInputSchema), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema) ]),
});

export const ItemCreateManyCollectionInputEnvelopeSchema: z.ZodType<Prisma.ItemCreateManyCollectionInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ItemCreateManyCollectionInputSchema), z.lazy(() => ItemCreateManyCollectionInputSchema).array() ]),
});

export const UserUpsertWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutCollectionsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutCollectionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutCollectionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCollectionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutCollectionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCollectionsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCollectionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutCollectionsInputSchema) ]),
});

export const UserUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutCollectionsInput> = z.strictObject({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCollectionsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ListUpsertWithWhereUniqueWithoutCollectionInputSchema: z.ZodType<Prisma.ListUpsertWithWhereUniqueWithoutCollectionInput> = z.strictObject({
  where: z.lazy(() => ListWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ListUpdateWithoutCollectionInputSchema), z.lazy(() => ListUncheckedUpdateWithoutCollectionInputSchema) ]),
  create: z.union([ z.lazy(() => ListCreateWithoutCollectionInputSchema), z.lazy(() => ListUncheckedCreateWithoutCollectionInputSchema) ]),
});

export const ListUpdateWithWhereUniqueWithoutCollectionInputSchema: z.ZodType<Prisma.ListUpdateWithWhereUniqueWithoutCollectionInput> = z.strictObject({
  where: z.lazy(() => ListWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ListUpdateWithoutCollectionInputSchema), z.lazy(() => ListUncheckedUpdateWithoutCollectionInputSchema) ]),
});

export const ListUpdateManyWithWhereWithoutCollectionInputSchema: z.ZodType<Prisma.ListUpdateManyWithWhereWithoutCollectionInput> = z.strictObject({
  where: z.lazy(() => ListScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ListUpdateManyMutationInputSchema), z.lazy(() => ListUncheckedUpdateManyWithoutCollectionInputSchema) ]),
});

export const ListScalarWhereInputSchema: z.ZodType<Prisma.ListScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ListScalarWhereInputSchema), z.lazy(() => ListScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ListScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ListScalarWhereInputSchema), z.lazy(() => ListScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  protected: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  backgroundColor: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  startingRating: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  collectionId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const ItemUpsertWithWhereUniqueWithoutCollectionInputSchema: z.ZodType<Prisma.ItemUpsertWithWhereUniqueWithoutCollectionInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ItemUpdateWithoutCollectionInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutCollectionInputSchema) ]),
  create: z.union([ z.lazy(() => ItemCreateWithoutCollectionInputSchema), z.lazy(() => ItemUncheckedCreateWithoutCollectionInputSchema) ]),
});

export const ItemUpdateWithWhereUniqueWithoutCollectionInputSchema: z.ZodType<Prisma.ItemUpdateWithWhereUniqueWithoutCollectionInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ItemUpdateWithoutCollectionInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutCollectionInputSchema) ]),
});

export const ItemUpdateManyWithWhereWithoutCollectionInputSchema: z.ZodType<Prisma.ItemUpdateManyWithWhereWithoutCollectionInput> = z.strictObject({
  where: z.lazy(() => ItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ItemUpdateManyMutationInputSchema), z.lazy(() => ItemUncheckedUpdateManyWithoutCollectionInputSchema) ]),
});

export const ItemScalarWhereInputSchema: z.ZodType<Prisma.ItemScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ItemScalarWhereInputSchema), z.lazy(() => ItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ItemScalarWhereInputSchema), z.lazy(() => ItemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  rating: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  collectionId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  listId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  prevId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  nextId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
});

export const CollectionCreateWithoutListsInputSchema: z.ZodType<Prisma.CollectionCreateWithoutListsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutCollectionsInputSchema),
  items: z.lazy(() => ItemCreateNestedManyWithoutCollectionInputSchema).optional(),
});

export const CollectionUncheckedCreateWithoutListsInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateWithoutListsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
  userId: z.number().int(),
  items: z.lazy(() => ItemUncheckedCreateNestedManyWithoutCollectionInputSchema).optional(),
});

export const CollectionCreateOrConnectWithoutListsInputSchema: z.ZodType<Prisma.CollectionCreateOrConnectWithoutListsInput> = z.strictObject({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionCreateWithoutListsInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutListsInputSchema) ]),
});

export const ItemCreateWithoutListInputSchema: z.ZodType<Prisma.ItemCreateWithoutListInput> = z.strictObject({
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  prev: z.lazy(() => ItemCreateNestedOneWithoutPrevOfInputSchema).optional(),
  prevOf: z.lazy(() => ItemCreateNestedOneWithoutPrevInputSchema).optional(),
  next: z.lazy(() => ItemCreateNestedOneWithoutNextOfInputSchema).optional(),
  nextOf: z.lazy(() => ItemCreateNestedOneWithoutNextInputSchema).optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutItemsInputSchema),
});

export const ItemUncheckedCreateWithoutListInputSchema: z.ZodType<Prisma.ItemUncheckedCreateWithoutListInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  collectionId: z.string(),
  prevId: z.number().int().optional().nullable(),
  nextId: z.number().int().optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutPrevInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutNextInputSchema).optional(),
});

export const ItemCreateOrConnectWithoutListInputSchema: z.ZodType<Prisma.ItemCreateOrConnectWithoutListInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ItemCreateWithoutListInputSchema), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema) ]),
});

export const ItemCreateManyListInputEnvelopeSchema: z.ZodType<Prisma.ItemCreateManyListInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ItemCreateManyListInputSchema), z.lazy(() => ItemCreateManyListInputSchema).array() ]),
});

export const CollectionUpsertWithoutListsInputSchema: z.ZodType<Prisma.CollectionUpsertWithoutListsInput> = z.strictObject({
  update: z.union([ z.lazy(() => CollectionUpdateWithoutListsInputSchema), z.lazy(() => CollectionUncheckedUpdateWithoutListsInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionCreateWithoutListsInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutListsInputSchema) ]),
  where: z.lazy(() => CollectionWhereInputSchema).optional(),
});

export const CollectionUpdateToOneWithWhereWithoutListsInputSchema: z.ZodType<Prisma.CollectionUpdateToOneWithWhereWithoutListsInput> = z.strictObject({
  where: z.lazy(() => CollectionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CollectionUpdateWithoutListsInputSchema), z.lazy(() => CollectionUncheckedUpdateWithoutListsInputSchema) ]),
});

export const CollectionUpdateWithoutListsInputSchema: z.ZodType<Prisma.CollectionUpdateWithoutListsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  items: z.lazy(() => ItemUpdateManyWithoutCollectionNestedInputSchema).optional(),
});

export const CollectionUncheckedUpdateWithoutListsInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateWithoutListsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => ItemUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional(),
});

export const ItemUpsertWithWhereUniqueWithoutListInputSchema: z.ZodType<Prisma.ItemUpsertWithWhereUniqueWithoutListInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ItemUpdateWithoutListInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutListInputSchema) ]),
  create: z.union([ z.lazy(() => ItemCreateWithoutListInputSchema), z.lazy(() => ItemUncheckedCreateWithoutListInputSchema) ]),
});

export const ItemUpdateWithWhereUniqueWithoutListInputSchema: z.ZodType<Prisma.ItemUpdateWithWhereUniqueWithoutListInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ItemUpdateWithoutListInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutListInputSchema) ]),
});

export const ItemUpdateManyWithWhereWithoutListInputSchema: z.ZodType<Prisma.ItemUpdateManyWithWhereWithoutListInput> = z.strictObject({
  where: z.lazy(() => ItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ItemUpdateManyMutationInputSchema), z.lazy(() => ItemUncheckedUpdateManyWithoutListInputSchema) ]),
});

export const ItemCreateWithoutPrevOfInputSchema: z.ZodType<Prisma.ItemCreateWithoutPrevOfInput> = z.strictObject({
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  prev: z.lazy(() => ItemCreateNestedOneWithoutPrevOfInputSchema).optional(),
  next: z.lazy(() => ItemCreateNestedOneWithoutNextOfInputSchema).optional(),
  nextOf: z.lazy(() => ItemCreateNestedOneWithoutNextInputSchema).optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutItemsInputSchema),
  list: z.lazy(() => ListCreateNestedOneWithoutItemsInputSchema),
});

export const ItemUncheckedCreateWithoutPrevOfInputSchema: z.ZodType<Prisma.ItemUncheckedCreateWithoutPrevOfInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  collectionId: z.string(),
  listId: z.string(),
  prevId: z.number().int().optional().nullable(),
  nextId: z.number().int().optional().nullable(),
  nextOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutNextInputSchema).optional(),
});

export const ItemCreateOrConnectWithoutPrevOfInputSchema: z.ZodType<Prisma.ItemCreateOrConnectWithoutPrevOfInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevOfInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevOfInputSchema) ]),
});

export const ItemCreateWithoutPrevInputSchema: z.ZodType<Prisma.ItemCreateWithoutPrevInput> = z.strictObject({
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  prevOf: z.lazy(() => ItemCreateNestedOneWithoutPrevInputSchema).optional(),
  next: z.lazy(() => ItemCreateNestedOneWithoutNextOfInputSchema).optional(),
  nextOf: z.lazy(() => ItemCreateNestedOneWithoutNextInputSchema).optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutItemsInputSchema),
  list: z.lazy(() => ListCreateNestedOneWithoutItemsInputSchema),
});

export const ItemUncheckedCreateWithoutPrevInputSchema: z.ZodType<Prisma.ItemUncheckedCreateWithoutPrevInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  collectionId: z.string(),
  listId: z.string(),
  nextId: z.number().int().optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutPrevInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutNextInputSchema).optional(),
});

export const ItemCreateOrConnectWithoutPrevInputSchema: z.ZodType<Prisma.ItemCreateOrConnectWithoutPrevInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevInputSchema) ]),
});

export const ItemCreateWithoutNextOfInputSchema: z.ZodType<Prisma.ItemCreateWithoutNextOfInput> = z.strictObject({
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  prev: z.lazy(() => ItemCreateNestedOneWithoutPrevOfInputSchema).optional(),
  prevOf: z.lazy(() => ItemCreateNestedOneWithoutPrevInputSchema).optional(),
  next: z.lazy(() => ItemCreateNestedOneWithoutNextOfInputSchema).optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutItemsInputSchema),
  list: z.lazy(() => ListCreateNestedOneWithoutItemsInputSchema),
});

export const ItemUncheckedCreateWithoutNextOfInputSchema: z.ZodType<Prisma.ItemUncheckedCreateWithoutNextOfInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  collectionId: z.string(),
  listId: z.string(),
  prevId: z.number().int().optional().nullable(),
  nextId: z.number().int().optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutPrevInputSchema).optional(),
});

export const ItemCreateOrConnectWithoutNextOfInputSchema: z.ZodType<Prisma.ItemCreateOrConnectWithoutNextOfInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ItemCreateWithoutNextOfInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextOfInputSchema) ]),
});

export const ItemCreateWithoutNextInputSchema: z.ZodType<Prisma.ItemCreateWithoutNextInput> = z.strictObject({
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  prev: z.lazy(() => ItemCreateNestedOneWithoutPrevOfInputSchema).optional(),
  prevOf: z.lazy(() => ItemCreateNestedOneWithoutPrevInputSchema).optional(),
  nextOf: z.lazy(() => ItemCreateNestedOneWithoutNextInputSchema).optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutItemsInputSchema),
  list: z.lazy(() => ListCreateNestedOneWithoutItemsInputSchema),
});

export const ItemUncheckedCreateWithoutNextInputSchema: z.ZodType<Prisma.ItemUncheckedCreateWithoutNextInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  collectionId: z.string(),
  listId: z.string(),
  prevId: z.number().int().optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutPrevInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedCreateNestedOneWithoutNextInputSchema).optional(),
});

export const ItemCreateOrConnectWithoutNextInputSchema: z.ZodType<Prisma.ItemCreateOrConnectWithoutNextInput> = z.strictObject({
  where: z.lazy(() => ItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ItemCreateWithoutNextInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextInputSchema) ]),
});

export const CollectionCreateWithoutItemsInputSchema: z.ZodType<Prisma.CollectionCreateWithoutItemsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutCollectionsInputSchema),
  lists: z.lazy(() => ListCreateNestedManyWithoutCollectionInputSchema).optional(),
});

export const CollectionUncheckedCreateWithoutItemsInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateWithoutItemsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
  userId: z.number().int(),
  lists: z.lazy(() => ListUncheckedCreateNestedManyWithoutCollectionInputSchema).optional(),
});

export const CollectionCreateOrConnectWithoutItemsInputSchema: z.ZodType<Prisma.CollectionCreateOrConnectWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionCreateWithoutItemsInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutItemsInputSchema) ]),
});

export const ListCreateWithoutItemsInputSchema: z.ZodType<Prisma.ListCreateWithoutItemsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().optional().nullable(),
  startingRating: z.number().optional().nullable(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutListsInputSchema),
});

export const ListUncheckedCreateWithoutItemsInputSchema: z.ZodType<Prisma.ListUncheckedCreateWithoutItemsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().optional().nullable(),
  startingRating: z.number().optional().nullable(),
  collectionId: z.string(),
});

export const ListCreateOrConnectWithoutItemsInputSchema: z.ZodType<Prisma.ListCreateOrConnectWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => ListWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ListCreateWithoutItemsInputSchema), z.lazy(() => ListUncheckedCreateWithoutItemsInputSchema) ]),
});

export const ItemUpsertWithoutPrevOfInputSchema: z.ZodType<Prisma.ItemUpsertWithoutPrevOfInput> = z.strictObject({
  update: z.union([ z.lazy(() => ItemUpdateWithoutPrevOfInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutPrevOfInputSchema) ]),
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevOfInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevOfInputSchema) ]),
  where: z.lazy(() => ItemWhereInputSchema).optional(),
});

export const ItemUpdateToOneWithWhereWithoutPrevOfInputSchema: z.ZodType<Prisma.ItemUpdateToOneWithWhereWithoutPrevOfInput> = z.strictObject({
  where: z.lazy(() => ItemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ItemUpdateWithoutPrevOfInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutPrevOfInputSchema) ]),
});

export const ItemUpdateWithoutPrevOfInputSchema: z.ZodType<Prisma.ItemUpdateWithoutPrevOfInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prev: z.lazy(() => ItemUpdateOneWithoutPrevOfNestedInputSchema).optional(),
  next: z.lazy(() => ItemUpdateOneWithoutNextOfNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUpdateOneWithoutNextNestedInputSchema).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  list: z.lazy(() => ListUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const ItemUncheckedUpdateWithoutPrevOfInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateWithoutPrevOfInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prevId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nextId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nextOf: z.lazy(() => ItemUncheckedUpdateOneWithoutNextNestedInputSchema).optional(),
});

export const ItemUpsertWithoutPrevInputSchema: z.ZodType<Prisma.ItemUpsertWithoutPrevInput> = z.strictObject({
  update: z.union([ z.lazy(() => ItemUpdateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutPrevInputSchema) ]),
  create: z.union([ z.lazy(() => ItemCreateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedCreateWithoutPrevInputSchema) ]),
  where: z.lazy(() => ItemWhereInputSchema).optional(),
});

export const ItemUpdateToOneWithWhereWithoutPrevInputSchema: z.ZodType<Prisma.ItemUpdateToOneWithWhereWithoutPrevInput> = z.strictObject({
  where: z.lazy(() => ItemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ItemUpdateWithoutPrevInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutPrevInputSchema) ]),
});

export const ItemUpdateWithoutPrevInputSchema: z.ZodType<Prisma.ItemUpdateWithoutPrevInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prevOf: z.lazy(() => ItemUpdateOneWithoutPrevNestedInputSchema).optional(),
  next: z.lazy(() => ItemUpdateOneWithoutNextOfNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUpdateOneWithoutNextNestedInputSchema).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  list: z.lazy(() => ListUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const ItemUncheckedUpdateWithoutPrevInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateWithoutPrevInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nextId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedUpdateOneWithoutPrevNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedUpdateOneWithoutNextNestedInputSchema).optional(),
});

export const ItemUpsertWithoutNextOfInputSchema: z.ZodType<Prisma.ItemUpsertWithoutNextOfInput> = z.strictObject({
  update: z.union([ z.lazy(() => ItemUpdateWithoutNextOfInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutNextOfInputSchema) ]),
  create: z.union([ z.lazy(() => ItemCreateWithoutNextOfInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextOfInputSchema) ]),
  where: z.lazy(() => ItemWhereInputSchema).optional(),
});

export const ItemUpdateToOneWithWhereWithoutNextOfInputSchema: z.ZodType<Prisma.ItemUpdateToOneWithWhereWithoutNextOfInput> = z.strictObject({
  where: z.lazy(() => ItemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ItemUpdateWithoutNextOfInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutNextOfInputSchema) ]),
});

export const ItemUpdateWithoutNextOfInputSchema: z.ZodType<Prisma.ItemUpdateWithoutNextOfInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prev: z.lazy(() => ItemUpdateOneWithoutPrevOfNestedInputSchema).optional(),
  prevOf: z.lazy(() => ItemUpdateOneWithoutPrevNestedInputSchema).optional(),
  next: z.lazy(() => ItemUpdateOneWithoutNextOfNestedInputSchema).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  list: z.lazy(() => ListUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const ItemUncheckedUpdateWithoutNextOfInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateWithoutNextOfInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prevId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nextId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedUpdateOneWithoutPrevNestedInputSchema).optional(),
});

export const ItemUpsertWithoutNextInputSchema: z.ZodType<Prisma.ItemUpsertWithoutNextInput> = z.strictObject({
  update: z.union([ z.lazy(() => ItemUpdateWithoutNextInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutNextInputSchema) ]),
  create: z.union([ z.lazy(() => ItemCreateWithoutNextInputSchema), z.lazy(() => ItemUncheckedCreateWithoutNextInputSchema) ]),
  where: z.lazy(() => ItemWhereInputSchema).optional(),
});

export const ItemUpdateToOneWithWhereWithoutNextInputSchema: z.ZodType<Prisma.ItemUpdateToOneWithWhereWithoutNextInput> = z.strictObject({
  where: z.lazy(() => ItemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ItemUpdateWithoutNextInputSchema), z.lazy(() => ItemUncheckedUpdateWithoutNextInputSchema) ]),
});

export const ItemUpdateWithoutNextInputSchema: z.ZodType<Prisma.ItemUpdateWithoutNextInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prev: z.lazy(() => ItemUpdateOneWithoutPrevOfNestedInputSchema).optional(),
  prevOf: z.lazy(() => ItemUpdateOneWithoutPrevNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUpdateOneWithoutNextNestedInputSchema).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  list: z.lazy(() => ListUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const ItemUncheckedUpdateWithoutNextInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateWithoutNextInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  listId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prevId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedUpdateOneWithoutPrevNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedUpdateOneWithoutNextNestedInputSchema).optional(),
});

export const CollectionUpsertWithoutItemsInputSchema: z.ZodType<Prisma.CollectionUpsertWithoutItemsInput> = z.strictObject({
  update: z.union([ z.lazy(() => CollectionUpdateWithoutItemsInputSchema), z.lazy(() => CollectionUncheckedUpdateWithoutItemsInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionCreateWithoutItemsInputSchema), z.lazy(() => CollectionUncheckedCreateWithoutItemsInputSchema) ]),
  where: z.lazy(() => CollectionWhereInputSchema).optional(),
});

export const CollectionUpdateToOneWithWhereWithoutItemsInputSchema: z.ZodType<Prisma.CollectionUpdateToOneWithWhereWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => CollectionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CollectionUpdateWithoutItemsInputSchema), z.lazy(() => CollectionUncheckedUpdateWithoutItemsInputSchema) ]),
});

export const CollectionUpdateWithoutItemsInputSchema: z.ZodType<Prisma.CollectionUpdateWithoutItemsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  lists: z.lazy(() => ListUpdateManyWithoutCollectionNestedInputSchema).optional(),
});

export const CollectionUncheckedUpdateWithoutItemsInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateWithoutItemsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  lists: z.lazy(() => ListUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional(),
});

export const ListUpsertWithoutItemsInputSchema: z.ZodType<Prisma.ListUpsertWithoutItemsInput> = z.strictObject({
  update: z.union([ z.lazy(() => ListUpdateWithoutItemsInputSchema), z.lazy(() => ListUncheckedUpdateWithoutItemsInputSchema) ]),
  create: z.union([ z.lazy(() => ListCreateWithoutItemsInputSchema), z.lazy(() => ListUncheckedCreateWithoutItemsInputSchema) ]),
  where: z.lazy(() => ListWhereInputSchema).optional(),
});

export const ListUpdateToOneWithWhereWithoutItemsInputSchema: z.ZodType<Prisma.ListUpdateToOneWithWhereWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => ListWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ListUpdateWithoutItemsInputSchema), z.lazy(() => ListUncheckedUpdateWithoutItemsInputSchema) ]),
});

export const ListUpdateWithoutItemsInputSchema: z.ZodType<Prisma.ListUpdateWithoutItemsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  backgroundColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startingRating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutListsNestedInputSchema).optional(),
});

export const ListUncheckedUpdateWithoutItemsInputSchema: z.ZodType<Prisma.ListUncheckedUpdateWithoutItemsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  backgroundColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startingRating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CollectionCreateManyUserInputSchema: z.ZodType<Prisma.CollectionCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  defaultListId: z.string().optional().nullable(),
});

export const CollectionUpdateWithoutUserInputSchema: z.ZodType<Prisma.CollectionUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lists: z.lazy(() => ListUpdateManyWithoutCollectionNestedInputSchema).optional(),
  items: z.lazy(() => ItemUpdateManyWithoutCollectionNestedInputSchema).optional(),
});

export const CollectionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lists: z.lazy(() => ListUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional(),
  items: z.lazy(() => ItemUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional(),
});

export const CollectionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  defaultListId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ListCreateManyCollectionInputSchema: z.ZodType<Prisma.ListCreateManyCollectionInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  protected: z.boolean().optional(),
  backgroundColor: z.string().optional().nullable(),
  startingRating: z.number().optional().nullable(),
});

export const ItemCreateManyCollectionInputSchema: z.ZodType<Prisma.ItemCreateManyCollectionInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  listId: z.string(),
  prevId: z.number().int().optional().nullable(),
  nextId: z.number().int().optional().nullable(),
});

export const ListUpdateWithoutCollectionInputSchema: z.ZodType<Prisma.ListUpdateWithoutCollectionInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  backgroundColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startingRating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  items: z.lazy(() => ItemUpdateManyWithoutListNestedInputSchema).optional(),
});

export const ListUncheckedUpdateWithoutCollectionInputSchema: z.ZodType<Prisma.ListUncheckedUpdateWithoutCollectionInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  backgroundColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startingRating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  items: z.lazy(() => ItemUncheckedUpdateManyWithoutListNestedInputSchema).optional(),
});

export const ListUncheckedUpdateManyWithoutCollectionInputSchema: z.ZodType<Prisma.ListUncheckedUpdateManyWithoutCollectionInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protected: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  backgroundColor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startingRating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ItemUpdateWithoutCollectionInputSchema: z.ZodType<Prisma.ItemUpdateWithoutCollectionInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prev: z.lazy(() => ItemUpdateOneWithoutPrevOfNestedInputSchema).optional(),
  prevOf: z.lazy(() => ItemUpdateOneWithoutPrevNestedInputSchema).optional(),
  next: z.lazy(() => ItemUpdateOneWithoutNextOfNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUpdateOneWithoutNextNestedInputSchema).optional(),
  list: z.lazy(() => ListUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const ItemUncheckedUpdateWithoutCollectionInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateWithoutCollectionInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  listId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prevId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nextId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedUpdateOneWithoutPrevNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedUpdateOneWithoutNextNestedInputSchema).optional(),
});

export const ItemUncheckedUpdateManyWithoutCollectionInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateManyWithoutCollectionInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  listId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prevId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nextId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ItemCreateManyListInputSchema: z.ZodType<Prisma.ItemCreateManyListInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  description: z.string(),
  rating: z.number().optional().nullable(),
  collectionId: z.string(),
  prevId: z.number().int().optional().nullable(),
  nextId: z.number().int().optional().nullable(),
});

export const ItemUpdateWithoutListInputSchema: z.ZodType<Prisma.ItemUpdateWithoutListInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prev: z.lazy(() => ItemUpdateOneWithoutPrevOfNestedInputSchema).optional(),
  prevOf: z.lazy(() => ItemUpdateOneWithoutPrevNestedInputSchema).optional(),
  next: z.lazy(() => ItemUpdateOneWithoutNextOfNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUpdateOneWithoutNextNestedInputSchema).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const ItemUncheckedUpdateWithoutListInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateWithoutListInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prevId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nextId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prevOf: z.lazy(() => ItemUncheckedUpdateOneWithoutPrevNestedInputSchema).optional(),
  nextOf: z.lazy(() => ItemUncheckedUpdateOneWithoutNextNestedInputSchema).optional(),
});

export const ItemUncheckedUpdateManyWithoutListInputSchema: z.ZodType<Prisma.ItemUncheckedUpdateManyWithoutListInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prevId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  nextId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const CollectionFindFirstArgsSchema: z.ZodType<Prisma.CollectionFindFirstArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereInputSchema.optional(), 
  orderBy: z.union([ CollectionOrderByWithRelationInputSchema.array(), CollectionOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionScalarFieldEnumSchema, CollectionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CollectionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CollectionFindFirstOrThrowArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereInputSchema.optional(), 
  orderBy: z.union([ CollectionOrderByWithRelationInputSchema.array(), CollectionOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionScalarFieldEnumSchema, CollectionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CollectionFindManyArgsSchema: z.ZodType<Prisma.CollectionFindManyArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereInputSchema.optional(), 
  orderBy: z.union([ CollectionOrderByWithRelationInputSchema.array(), CollectionOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionScalarFieldEnumSchema, CollectionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CollectionAggregateArgsSchema: z.ZodType<Prisma.CollectionAggregateArgs> = z.object({
  where: CollectionWhereInputSchema.optional(), 
  orderBy: z.union([ CollectionOrderByWithRelationInputSchema.array(), CollectionOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CollectionGroupByArgsSchema: z.ZodType<Prisma.CollectionGroupByArgs> = z.object({
  where: CollectionWhereInputSchema.optional(), 
  orderBy: z.union([ CollectionOrderByWithAggregationInputSchema.array(), CollectionOrderByWithAggregationInputSchema ]).optional(),
  by: CollectionScalarFieldEnumSchema.array(), 
  having: CollectionScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CollectionFindUniqueArgsSchema: z.ZodType<Prisma.CollectionFindUniqueArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereUniqueInputSchema, 
}).strict();

export const CollectionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CollectionFindUniqueOrThrowArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereUniqueInputSchema, 
}).strict();

export const ListFindFirstArgsSchema: z.ZodType<Prisma.ListFindFirstArgs> = z.object({
  select: ListSelectSchema.optional(),
  include: ListIncludeSchema.optional(),
  where: ListWhereInputSchema.optional(), 
  orderBy: z.union([ ListOrderByWithRelationInputSchema.array(), ListOrderByWithRelationInputSchema ]).optional(),
  cursor: ListWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ListScalarFieldEnumSchema, ListScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ListFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ListFindFirstOrThrowArgs> = z.object({
  select: ListSelectSchema.optional(),
  include: ListIncludeSchema.optional(),
  where: ListWhereInputSchema.optional(), 
  orderBy: z.union([ ListOrderByWithRelationInputSchema.array(), ListOrderByWithRelationInputSchema ]).optional(),
  cursor: ListWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ListScalarFieldEnumSchema, ListScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ListFindManyArgsSchema: z.ZodType<Prisma.ListFindManyArgs> = z.object({
  select: ListSelectSchema.optional(),
  include: ListIncludeSchema.optional(),
  where: ListWhereInputSchema.optional(), 
  orderBy: z.union([ ListOrderByWithRelationInputSchema.array(), ListOrderByWithRelationInputSchema ]).optional(),
  cursor: ListWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ListScalarFieldEnumSchema, ListScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ListAggregateArgsSchema: z.ZodType<Prisma.ListAggregateArgs> = z.object({
  where: ListWhereInputSchema.optional(), 
  orderBy: z.union([ ListOrderByWithRelationInputSchema.array(), ListOrderByWithRelationInputSchema ]).optional(),
  cursor: ListWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ListGroupByArgsSchema: z.ZodType<Prisma.ListGroupByArgs> = z.object({
  where: ListWhereInputSchema.optional(), 
  orderBy: z.union([ ListOrderByWithAggregationInputSchema.array(), ListOrderByWithAggregationInputSchema ]).optional(),
  by: ListScalarFieldEnumSchema.array(), 
  having: ListScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ListFindUniqueArgsSchema: z.ZodType<Prisma.ListFindUniqueArgs> = z.object({
  select: ListSelectSchema.optional(),
  include: ListIncludeSchema.optional(),
  where: ListWhereUniqueInputSchema, 
}).strict();

export const ListFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ListFindUniqueOrThrowArgs> = z.object({
  select: ListSelectSchema.optional(),
  include: ListIncludeSchema.optional(),
  where: ListWhereUniqueInputSchema, 
}).strict();

export const ItemFindFirstArgsSchema: z.ZodType<Prisma.ItemFindFirstArgs> = z.object({
  select: ItemSelectSchema.optional(),
  include: ItemIncludeSchema.optional(),
  where: ItemWhereInputSchema.optional(), 
  orderBy: z.union([ ItemOrderByWithRelationInputSchema.array(), ItemOrderByWithRelationInputSchema ]).optional(),
  cursor: ItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ItemScalarFieldEnumSchema, ItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ItemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ItemFindFirstOrThrowArgs> = z.object({
  select: ItemSelectSchema.optional(),
  include: ItemIncludeSchema.optional(),
  where: ItemWhereInputSchema.optional(), 
  orderBy: z.union([ ItemOrderByWithRelationInputSchema.array(), ItemOrderByWithRelationInputSchema ]).optional(),
  cursor: ItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ItemScalarFieldEnumSchema, ItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ItemFindManyArgsSchema: z.ZodType<Prisma.ItemFindManyArgs> = z.object({
  select: ItemSelectSchema.optional(),
  include: ItemIncludeSchema.optional(),
  where: ItemWhereInputSchema.optional(), 
  orderBy: z.union([ ItemOrderByWithRelationInputSchema.array(), ItemOrderByWithRelationInputSchema ]).optional(),
  cursor: ItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ItemScalarFieldEnumSchema, ItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ItemAggregateArgsSchema: z.ZodType<Prisma.ItemAggregateArgs> = z.object({
  where: ItemWhereInputSchema.optional(), 
  orderBy: z.union([ ItemOrderByWithRelationInputSchema.array(), ItemOrderByWithRelationInputSchema ]).optional(),
  cursor: ItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ItemGroupByArgsSchema: z.ZodType<Prisma.ItemGroupByArgs> = z.object({
  where: ItemWhereInputSchema.optional(), 
  orderBy: z.union([ ItemOrderByWithAggregationInputSchema.array(), ItemOrderByWithAggregationInputSchema ]).optional(),
  by: ItemScalarFieldEnumSchema.array(), 
  having: ItemScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ItemFindUniqueArgsSchema: z.ZodType<Prisma.ItemFindUniqueArgs> = z.object({
  select: ItemSelectSchema.optional(),
  include: ItemIncludeSchema.optional(),
  where: ItemWhereUniqueInputSchema, 
}).strict();

export const ItemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ItemFindUniqueOrThrowArgs> = z.object({
  select: ItemSelectSchema.optional(),
  include: ItemIncludeSchema.optional(),
  where: ItemWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CollectionCreateArgsSchema: z.ZodType<Prisma.CollectionCreateArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  data: z.union([ CollectionCreateInputSchema, CollectionUncheckedCreateInputSchema ]),
}).strict();

export const CollectionUpsertArgsSchema: z.ZodType<Prisma.CollectionUpsertArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereUniqueInputSchema, 
  create: z.union([ CollectionCreateInputSchema, CollectionUncheckedCreateInputSchema ]),
  update: z.union([ CollectionUpdateInputSchema, CollectionUncheckedUpdateInputSchema ]),
}).strict();

export const CollectionCreateManyArgsSchema: z.ZodType<Prisma.CollectionCreateManyArgs> = z.object({
  data: z.union([ CollectionCreateManyInputSchema, CollectionCreateManyInputSchema.array() ]),
}).strict();

export const CollectionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CollectionCreateManyAndReturnArgs> = z.object({
  data: z.union([ CollectionCreateManyInputSchema, CollectionCreateManyInputSchema.array() ]),
}).strict();

export const CollectionDeleteArgsSchema: z.ZodType<Prisma.CollectionDeleteArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereUniqueInputSchema, 
}).strict();

export const CollectionUpdateArgsSchema: z.ZodType<Prisma.CollectionUpdateArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  data: z.union([ CollectionUpdateInputSchema, CollectionUncheckedUpdateInputSchema ]),
  where: CollectionWhereUniqueInputSchema, 
}).strict();

export const CollectionUpdateManyArgsSchema: z.ZodType<Prisma.CollectionUpdateManyArgs> = z.object({
  data: z.union([ CollectionUpdateManyMutationInputSchema, CollectionUncheckedUpdateManyInputSchema ]),
  where: CollectionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CollectionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CollectionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CollectionUpdateManyMutationInputSchema, CollectionUncheckedUpdateManyInputSchema ]),
  where: CollectionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CollectionDeleteManyArgsSchema: z.ZodType<Prisma.CollectionDeleteManyArgs> = z.object({
  where: CollectionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ListCreateArgsSchema: z.ZodType<Prisma.ListCreateArgs> = z.object({
  select: ListSelectSchema.optional(),
  include: ListIncludeSchema.optional(),
  data: z.union([ ListCreateInputSchema, ListUncheckedCreateInputSchema ]),
}).strict();

export const ListUpsertArgsSchema: z.ZodType<Prisma.ListUpsertArgs> = z.object({
  select: ListSelectSchema.optional(),
  include: ListIncludeSchema.optional(),
  where: ListWhereUniqueInputSchema, 
  create: z.union([ ListCreateInputSchema, ListUncheckedCreateInputSchema ]),
  update: z.union([ ListUpdateInputSchema, ListUncheckedUpdateInputSchema ]),
}).strict();

export const ListCreateManyArgsSchema: z.ZodType<Prisma.ListCreateManyArgs> = z.object({
  data: z.union([ ListCreateManyInputSchema, ListCreateManyInputSchema.array() ]),
}).strict();

export const ListCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ListCreateManyAndReturnArgs> = z.object({
  data: z.union([ ListCreateManyInputSchema, ListCreateManyInputSchema.array() ]),
}).strict();

export const ListDeleteArgsSchema: z.ZodType<Prisma.ListDeleteArgs> = z.object({
  select: ListSelectSchema.optional(),
  include: ListIncludeSchema.optional(),
  where: ListWhereUniqueInputSchema, 
}).strict();

export const ListUpdateArgsSchema: z.ZodType<Prisma.ListUpdateArgs> = z.object({
  select: ListSelectSchema.optional(),
  include: ListIncludeSchema.optional(),
  data: z.union([ ListUpdateInputSchema, ListUncheckedUpdateInputSchema ]),
  where: ListWhereUniqueInputSchema, 
}).strict();

export const ListUpdateManyArgsSchema: z.ZodType<Prisma.ListUpdateManyArgs> = z.object({
  data: z.union([ ListUpdateManyMutationInputSchema, ListUncheckedUpdateManyInputSchema ]),
  where: ListWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ListUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ListUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ListUpdateManyMutationInputSchema, ListUncheckedUpdateManyInputSchema ]),
  where: ListWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ListDeleteManyArgsSchema: z.ZodType<Prisma.ListDeleteManyArgs> = z.object({
  where: ListWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ItemCreateArgsSchema: z.ZodType<Prisma.ItemCreateArgs> = z.object({
  select: ItemSelectSchema.optional(),
  include: ItemIncludeSchema.optional(),
  data: z.union([ ItemCreateInputSchema, ItemUncheckedCreateInputSchema ]),
}).strict();

export const ItemUpsertArgsSchema: z.ZodType<Prisma.ItemUpsertArgs> = z.object({
  select: ItemSelectSchema.optional(),
  include: ItemIncludeSchema.optional(),
  where: ItemWhereUniqueInputSchema, 
  create: z.union([ ItemCreateInputSchema, ItemUncheckedCreateInputSchema ]),
  update: z.union([ ItemUpdateInputSchema, ItemUncheckedUpdateInputSchema ]),
}).strict();

export const ItemCreateManyArgsSchema: z.ZodType<Prisma.ItemCreateManyArgs> = z.object({
  data: z.union([ ItemCreateManyInputSchema, ItemCreateManyInputSchema.array() ]),
}).strict();

export const ItemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ItemCreateManyAndReturnArgs> = z.object({
  data: z.union([ ItemCreateManyInputSchema, ItemCreateManyInputSchema.array() ]),
}).strict();

export const ItemDeleteArgsSchema: z.ZodType<Prisma.ItemDeleteArgs> = z.object({
  select: ItemSelectSchema.optional(),
  include: ItemIncludeSchema.optional(),
  where: ItemWhereUniqueInputSchema, 
}).strict();

export const ItemUpdateArgsSchema: z.ZodType<Prisma.ItemUpdateArgs> = z.object({
  select: ItemSelectSchema.optional(),
  include: ItemIncludeSchema.optional(),
  data: z.union([ ItemUpdateInputSchema, ItemUncheckedUpdateInputSchema ]),
  where: ItemWhereUniqueInputSchema, 
}).strict();

export const ItemUpdateManyArgsSchema: z.ZodType<Prisma.ItemUpdateManyArgs> = z.object({
  data: z.union([ ItemUpdateManyMutationInputSchema, ItemUncheckedUpdateManyInputSchema ]),
  where: ItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ItemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ItemUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ItemUpdateManyMutationInputSchema, ItemUncheckedUpdateManyInputSchema ]),
  where: ItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ItemDeleteManyArgsSchema: z.ZodType<Prisma.ItemDeleteManyArgs> = z.object({
  where: ItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();