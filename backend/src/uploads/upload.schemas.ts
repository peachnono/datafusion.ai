import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';


export type UploadDocument = HydratedDocument<Upload>;

@Schema() //{ timestamps: true }
export class Upload {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: Buffer }) // use Buffer to store data in binary.
  content: Buffer;

  @Prop({ type: Date, default: Date.now })
  uploadedAt: Date;

  @Prop({ type: Object }) //TODO: check what file type we are need.
  processedData: Record<string, any>;

  // @Prop({ type: Types.ObjectId, ref: 'User'})
  @Prop({ type: Types.ObjectId})
  uploadedBy: User;

  @Prop({ type: Boolean, default: false })
  oieLibrary: boolean;
}

// build the schema by SchemaFactory.
export const UploadSchema = SchemaFactory.createForClass(Upload);


