# Arium WebGen - Windows Batch Files

Quick launcher scripts for Windows to use Arium WebGen CLI without typing `node ./bin/arium` every time.

## Available Scripts

### `arium.bat`
Main CLI launcher - pass any command to it.

**Usage:**
```batch
arium.bat --version
arium.bat init my-site
arium.bat build
arium.bat preview
```

### `arium-init.bat`
Quick project initialization.

**Usage:**
```batch
arium-init.bat my-site
```

### `arium-build.bat`
Quick project build.

**Usage:**
```batch
cd my-site
..\arium-build.bat
```

### `arium-preview.bat`
Start preview server.

**Usage:**
```batch
cd my-site
..\arium-preview.bat
```

### `arium-agent.bat`
Run AI agent tasks.

**Usage:**
```batch
cd my-site
..\arium-agent.bat create-landing
..\arium-agent.bat create-landing --dry-run
..\arium-agent.bat fix-site
```

## Examples

### Complete Workflow

```batch
REM 1. Initialize project
arium-init.bat my-website

REM 2. Navigate to project
cd my-website

REM 3. Build project
..\arium-build.bat

REM 4. Start preview server
..\arium-preview.bat
```

### Using Main Launcher

```batch
REM All commands through main launcher
arium.bat init my-site
cd my-site
..\arium.bat add-page about
..\arium.bat make-component pricing
..\arium.bat build
..\arium.bat preview
```

## Adding to PATH (Optional)

To use `arium` command from anywhere:

1. Copy `arium.bat` to a directory in your PATH (e.g., `C:\Windows\System32`)
2. Or add the project directory to your PATH environment variable

Then you can use:
```batch
arium init my-site
arium build
arium preview
```

---

*For full CLI documentation, see [CLI_README.md](CLI_README.md)*

