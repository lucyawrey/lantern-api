import { Entity } from "@mikro-orm/core";
import { AccessType } from "types/enums";
import { Static, t } from "elysia";
import { Owned } from "./Owned";

@Entity()
export class Ruleset extends Owned {}

export const CreateRuleset = t.Object({
  name: t.String(),
  displayName: t.Optional(t.String()),
  ownerRef: t.String(),
  hasReadAccess: t.Optional(AccessType),
  hasWriteAccess: t.Optional(AccessType),
});
export type CreateRuleset = Static<typeof CreateRuleset>;

export const UpdateRuleset = t.Partial(CreateRuleset);
export type UpdateRuleset = Static<typeof UpdateRuleset>;

export const GetRuleset = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  name: t.String(),
  displayName: t.Optional(t.String()),
  ownerId: t.String(),
  hasReadAccess: AccessType,
  hasWriteAccess: AccessType,
});
export type GetRuleset = Static<typeof GetRuleset>;
