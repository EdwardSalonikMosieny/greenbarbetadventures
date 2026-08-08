import morgan from 'morgan';

// Exclude query strings because they can contain reset tokens or other sensitive
// values. Neither format includes bodies, cookies, or authorization headers.
morgan.token('safe-path', (req) => req.url?.split('?', 1)[0] ?? '-');

const productionFormat =
  ':remote-addr - :method :safe-path HTTP/:http-version :status :res[content-length] :response-time ms';
const developmentFormat =
  ':method :safe-path :status :response-time ms - :res[content-length]';

export const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
);
