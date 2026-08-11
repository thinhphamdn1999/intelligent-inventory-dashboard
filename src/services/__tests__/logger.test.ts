import { Logger } from '@/services/logger';
import type { LogTransport } from '@/services/logger';

function createMockTransport(): LogTransport {
  return { log: jest.fn() };
}

describe('Logger', () => {
  it('calls the default console transport for info', () => {
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    const logger = new Logger();

    logger.info('test message', { foo: 'bar' });

    expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] test message', {
      foo: 'bar',
    });
    consoleInfoSpy.mockRestore();
  });

  it('routes warn and error to the correct console methods', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const logger = new Logger();

    logger.warn('a warning');
    logger.error('an error');

    expect(warnSpy).toHaveBeenCalledWith('[WARN] a warning', '');
    expect(errorSpy).toHaveBeenCalledWith('[ERROR] an error', '');

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('forwards log calls to every registered transport', () => {
    const transportA = createMockTransport();
    const transportB = createMockTransport();
    const logger = new Logger([transportA, transportB]);

    logger.error('failure', { code: 500 });

    expect(transportA.log).toHaveBeenCalledWith('error', 'failure', {
      code: 500,
    });
    expect(transportB.log).toHaveBeenCalledWith('error', 'failure', {
      code: 500,
    });
  });

  it('sends logs to a transport added after construction via addTransport', () => {
    const initialTransport = createMockTransport();
    const addedLater = createMockTransport();
    const logger = new Logger([initialTransport]);

    logger.addTransport(addedLater);
    logger.info('hello');

    expect(initialTransport.log).toHaveBeenCalledWith(
      'info',
      'hello',
      undefined,
    );
    expect(addedLater.log).toHaveBeenCalledWith('info', 'hello', undefined);
  });
});
