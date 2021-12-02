import { Digger } from './digger/digger';
import { DiggerConfigInterface } from './digger/digger.interface';

export const diggerService = {
    init: (config: DiggerConfigInterface) => new Digger(config)
}

export default diggerService;
