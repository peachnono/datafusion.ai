import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';


export type UploadDocument = HydratedDocument<Upload>;

@Schema() 
export class Upload {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: Buffer }) // use Buffer to store data in binary.
  content: Buffer;

  @Prop({ type: String }) // Store file content in string.
  contentInStr: string;

  @Prop({ type: Date, default: Date.now })
  uploadedAt: Date;

  @Prop({ type: Object }) // Store only target data after the extraction. 
  processedData: Record<string, any>;

  // TODO: After merge User.shcema than uncommond line#29 and delete line#30.
  // @Prop({ type: Types.ObjectId, ref: 'User'}) 
  @Prop({ type: Types.ObjectId})
  uploadedBy: User;

  // Show the status if the OIE been apply to this upload.
  @Prop({ type: Boolean, default: false })  
  oieLibrary: boolean; 
}

// build the schema by SchemaFactory.
export const UploadSchema = SchemaFactory.createForClass(Upload);


