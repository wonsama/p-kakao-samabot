# TROUBLE SHOOTING

> Typescript guide gives "Duplicate function implementation" warning
> 중복된 함수 입니다.

https://stackoverflow.com/questions/44192541/typescript-guide-gives-duplicate-function-implementation-warning

`tsc --init to initialize the tsconfig.json`

> TypeScript – Visual Studio Code – Compiled Doesn´t Output 2 Spaces Tab
> 컴파일 된 js 파일 탭 사이즈 조절

https://stackoverflow.com/questions/68704665/typescript-visual-studio-code-compiled-doesn%C2%B4t-output-2-spaces-tab

조절 불가, 사실 사용자가 컴파일 된 결과물에 손을 될 필요는 없다. 소스를 수정하면 되지

> cannot find name console

https://stackoverflow.com/questions/42105984/cannot-find-name-console-what-could-be-the-reason-for-this
https://www.typescriptlang.org/docs/handbook/compiler-options.html
https://www.typescriptlang.org/tsconfig/#lib

```json
{
    "compilerOptions": {
        "rootDir": "src",
        "outDir": "bin",
        "module": "commonjs",
        "noImplicitAny": false,
        "removeComments": true,
        "preserveConstEnums": true,
        "sourceMap": true,
        "target": "es5",
        "lib": [
            "es6",
            "dom"    <------- Add this "dom" here
        ],
        "types": [
            "reflect-metadata"
        ],
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```
