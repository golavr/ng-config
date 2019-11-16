import { Injectable, Inject, forwardRef, resolveForwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * Performs config request.
 * This service is available as an injectable class, with methods to perform config request.
 *
 * Note that this service requires configs folder inside assets folder with the following structure:
 * - assets
 *  - configs
 *    - config.json
 *    - config.prod.json
 *    - env.json
 *
 * `env.json` file content should be:
 * ```json
 * {
 *    "env": "the selected runtime env (prod/integration etc.)"
 * }
 * ```
 * Each request method will read config values during the call, so changes can be made to config files at runtime.
 * The returned config object will be composed from `config.json` and will be overridden with env config.
 * Edit `env.json` to set which env config (`config.prod.json`) will be selected at runtime.
 * You can have multiple env config files like `config.integration.json` etc.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private configBase = 'config.json';
  private env = 'env.json';
  private configsFolder = 'assets/configs';
  private configBaseUrl = `${this.configsFolder}/${this.configBase}`;
  private envUrl = `${this.configsFolder}/${this.env}`;

  private configRuntimeUrl = (env: string) => `${this.configsFolder}/config.${env}.json`;

  constructor(@Inject(forwardRef(() => HttpClient)) private readonly http: HttpClient) { }

  /**
   * Get config object and returns the response body in a given type.
   *
   * @return An `Observable` of the config object.
   */
  get<T>(): Observable<T> {
    const http = resolveForwardRef(this.http);

    return http.get<T>(this.configBaseUrl).pipe(
      switchMap(baseConfig => http.get<{ env: string }>(this.envUrl).pipe(
        switchMap((env: { env: string }) => this.handleEnv(env.env) ? http.get<T>(this.configRuntimeUrl(env.env)).pipe(
          map(envConfig => Object.assign({} as T, baseConfig, envConfig)),
        ) : of(baseConfig))
      )),
    );
  }

  private handleEnv(env: any): string {
    if (env === undefined) {
      throw new Error('missing env value in env.json, env.json should have "env": "" or "env": "prod" defined');
    } else {
      return env;
    }
  }
}
