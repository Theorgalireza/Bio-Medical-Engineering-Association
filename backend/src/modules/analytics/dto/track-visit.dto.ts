import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class TrackVisitDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'مسیر صفحه باید متن باشد.' })
  @IsNotEmpty({ message: 'مسیر صفحه الزامی است.' })
  @MaxLength(500, { message: 'مسیر صفحه بیش از حد طولانی است.' })
  path!: string;
}
