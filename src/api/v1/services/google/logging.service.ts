import LoggerGCP from 'simple-gcp-logging';

import Locals from '../../config/locals';

export default class LoggingService {
    _logger;
    constructor() {
        this._logger = LoggerGCP.createLoggerGCP({
            projectId: Locals.config().googleProjectId,
            logName: Locals.config().googleLoggingName,
        });
    }

    sendDataInLogging(data: any, severity: any) {
        this._logger.setData(data);
        this._logger.setSeverity(severity);
        this._logger.writeLog();
    }
}
