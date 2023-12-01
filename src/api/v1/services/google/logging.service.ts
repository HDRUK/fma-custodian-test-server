import LoggerGCP from 'simple-gcp-logging';

import Locals from '../../config/locals';

export default class LoggingService {
    _logger;
    constructor() {
        if (Locals.config().loggingType != 'gcp') {
            return;
        }
        this._logger = LoggerGCP.createLoggerGCP({
            projectId: Locals.config().googleProjectId,
            logName: Locals.config().googleLoggingName,
        });
    }

    sendDataInLogging(data: any, severity: any) {

        if (Locals.config().loggingType == "local")
        {
            process.stdout.write(severity.toString());
            process.stdout.write(" - ");
            process.stdout.write(data.toString());
            process.stdout.write("\n");
        }
        else
        {
            this._logger.setData(data);
            this._logger.setSeverity(severity);
            this._logger.writeLog();
        }
    }
}
