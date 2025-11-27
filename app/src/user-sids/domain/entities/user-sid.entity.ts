export class UserSidEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly sid: string,
    public readonly createdAt: Date,
  ) {}
}
