
# Logic 16-24
Welcome to Logic 16-24, a 16-bit computer architecture emulated on the web. This project is built with Bun and TypeScript, providing a modern and fast development environment for exploring low-level computing concepts.

## 🚀 Getting Started
To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation
1.  Clone the repo:
    ```sh
    git clone https://github.com/alataq/l16-24.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd l-16-24
    ```
3.  Install dependencies:
    ```sh
    bun install
    ```

### Running the Emulator
To start the development server and view the emulator in your browser, run:

```sh
bun start
```

## 📂 Project Structure
The project is organized into directories for simpler development and better maintenance:

-   `src/`: Contains all the source code.
    -   `pages/`: HTML files for the web interface.
    -   `styles/`: CSS stylesheets for styling the pages.
    -   `emulator/`: The core logic for the 16-bit computer emulator.
    -   `index.ts`: The main entry point for the web application.

## 🤝 How to Contribute
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

We have a few guidelines to follow to ensure the project remains easy to manage and contribute to.

### Submitting Changes
You are free to make pull requests to help improve the project. Please make sure your code follows the project's code style.

### Code Style and Readability
To ensure the maintainability of the project, we ask all contributors to adhere to a consistent code style. This makes the code easier to read and understand for everyone.

-   **Descriptive Naming:** Function and variable names should clearly indicate their purpose. For example, a function that gets a random entry from an array should be named `getRandomArrayEntry()`.
-   **Clarity and Simplicity:** Write code that is easy to follow. Add comments where necessary to explain complex logic.

## Architecture
The machine is a 16 bit computer with a 24 bit address bus.

### Memory
-   **Size**: 4MB to 16MB, must be a power of two.
-   **Address Bus**: 24-bit.
-   **Data Bus**: 8-bit, with support for 16-bit read/write operations.

### CPU Registers
The CPU has a set of registers for storing data and state.

#### General-Purpose Registers (16-bit)
-   `r0`, `r1`, `r2`, `r3`, `r4`, `r5`, `r6`, `r7`

#### Special-Purpose Registers
-   `cp` (Program Counter): A 24-bit register that holds the address of the next instruction to be executed.
-   `sp` (Stack Pointer): A 12-bit register.

### Flags
The CPU includes the following flags to track the status of operations:
-   `zero` (Z): Set if the result of an operation is zero.
-   `carry` (C): Set if an operation produces a carry.
-   `negative` (N): Set if the result of an operation is negative.
