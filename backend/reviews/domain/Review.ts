interface ReviewData {
  id: string;
  placeId: string;
  userId: string;
  petFriendly: boolean;
  comment?: string | null;
  createdAt: Date;
}

export class Review {
  public readonly id: string;
  public readonly placeId: string;
  public readonly userId: string;
  public readonly petFriendly: boolean;
  public readonly comment: string | null;
  public readonly createdAt: Date;

  constructor(data: ReviewData) {
    this.id = data.id;
    this.placeId = data.placeId;
    this.userId = data.userId;
    this.petFriendly = data.petFriendly;
    this.comment = data.comment || null;
    this.createdAt = data.createdAt;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      placeId: this.placeId,
      userId: this.userId,
      petFriendly: this.petFriendly,
      comment: this.comment,
      createdAt: this.createdAt,
    };
  }
}
