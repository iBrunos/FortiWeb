import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Ip {
  @Prop({ unique: true })
  ip: string;

  @Prop()
  description: string;

  @Prop()
  status: boolean;

  @Prop()
  updatedAt: string;

  @Prop()
  permission: string;
}

export const IpsSchema = SchemaFactory.createForClass(Ip);