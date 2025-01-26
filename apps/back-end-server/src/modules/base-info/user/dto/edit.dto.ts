import { CreateDto } from './create.dto';

export type EditDto = Omit<CreateDto, 'password'>;
