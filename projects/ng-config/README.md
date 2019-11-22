# ng-config

Configuration library for Angular handling environments in continuous delivery systems. 

## Why using ng-config?
Angular comes with built-in mechanism of environment files but this mechanism requires you to build for each environment. This approach doesn't fit to modern development paradigm which advocate for `build once - deploy anywhere`.

## Getting started

### Installation

```
npm install @golavr/ng-config --save
```

### Create files

1. Create `assets/configs` folder.
2. Create `assets/configs/env.json` file.
3. Create `assets/configs/config.json` file.
4. Create `assets/configs/config.prod.json` file.
5. Add more `assets/configs/config.$$$.json` files to support all environments.

You should have this folder structure:
```
- assets
    - configs
        - config.json
        - config.prod.json
        - env.json
```

> Note: Library depends on the above folder and file names.

### env.json file

Open `assets/configs/env.json` and add this content:
```json
{
  "env": "prod"
}
```
In continues delivery system you should edit the `env` value to target the selected environment.

> Note: you can replace `prod` with other environment `$$$` as long as you have `assets/configs/config.$$$.json` file for it.

## How to use?

Lets set two configuration values for demonstration purpose.

Open `assets/configs/config.json` file and add:
```json
{
    "baseValue": "other configurations will inherit this value",
    "overrideValue": "base"
}
```

Open `assets/configs/config.prod.json` file and add:
```json
{
    "overrideValue": "prod"
}
```

Create interface reflecting the configuration:

```typescript
export interface MyConfig {
  baseValue: string;
  overrideValue: string;
}
```

Inject it and use it:

```typescript
import { Component } from '@angular/core';
import { ConfigService } from '@golavr/ng-config';
import { MyConfig } from './my-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(config: ConfigService) {
    config.get<MyConfig>().subscribe(conf => console.log(conf.overrideValue));
  }
}
```

## How does it work?

Each request will read config values during the call, so changes can be made to config files while the app is running.
The returned config object will be composed from `config.json` and will be overridden with env config.
In continues delivery system you need to edit `env.json` and set which env config (`config.prod.json`) will be selected at runtime.
You can have multiple env config files like `config.integration.json` etc.
