# Logic 16-24
Welcome to l16-24 a 16 bits computer emulated on the web with Bun and Typescript.

## How to contribute ?
You are free to make pull requests to help improving the project. You must respect some principles we established for the project. This section will guide you on how to write better code and help us simplify everyone's work.

### Files organization
The project is organized into directories for simpler developement and better maintenance. We use the following directories : 

- /src -> The entry point of the code, all sources are located there.
- /src/pages -> All html pages are there.
- /src/styles -> All css files are there.
- /src/emulator -> The logic for the emulator is there.

### Writing readable code
To insure maintenability of the project, we must ask to every contributors to use a single code style to make sure reading writen code is done without much effort to be easy to understand and increase productivity of our maintening team.

To begin, each function's name should indicate what the function do. For exemple if the function take an array of strings and return a random string, the name of the function should be "getRandomArrayEntry"; "get" is for the action, the rest is what it return. 