import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateWebsiteDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Subdomain can only contain lowercase letters, numbers, and hyphens',
  })
  subdomain?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
