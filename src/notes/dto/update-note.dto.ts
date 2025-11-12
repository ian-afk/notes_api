import { IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
