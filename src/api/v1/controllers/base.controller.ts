import LoggingService from '../services/google/logging.service';

export default class BaseController {
    _logger;

    constructor() {
        this._logger = new LoggingService();
    }
}
