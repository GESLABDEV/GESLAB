import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Novelties')
@Controller('novelties')
export class NoveltiesController {}