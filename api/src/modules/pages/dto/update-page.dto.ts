import { IsObject, IsOptional, IsString, Matches } from 'class-validator';

export class UpdatePageDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters,numbers, and hyphens',
  })
  slug?: string;

  @IsOptional()
  @IsObject()
  content?: any; // Craft.js JSON
}
