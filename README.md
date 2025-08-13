# JSON Conversation Beautifier

Convert your JSON conversation exports to beautiful, readable Markdown files.

## Features

- 🔄 Convert single conversation files
- 📁 Batch convert entire directories
- 🌐 Web-based GUI converter
- 📝 Preserves conversation structure and thinking blocks
- 🎯 Smart title extraction from conversation names
- 📊 Includes metadata (creation date, token count)
- ✅ Tested with exports from LM Studio v0.3.22

## Usage

### Method 1: Command Line (Single File)

```bash
node convert-conversation.js your-conversation.json
```

This creates a markdown file with the same base name (e.g., `your-conversation.md`).

### Method 2: Web GUI

Open `convert-gui.html` in your browser and drag & drop your JSON conversation file. You can preview the result and download the markdown file.

### Method 3: Batch Convert

Convert all conversation files in a directory:

```bash
node batch-convert.js ./path/to/conversations
```

This will recursively find all JSON conversation files and convert them to markdown in the same directories.

## Output Format

The generated markdown includes:

- **Title** from the conversation name
- **Metadata** (creation date, token count)
- **System prompt** (if present)
- **Conversation flow** with clear User/Assistant sections
- **Thinking blocks** formatted as quotes with italicized titles
- **Code blocks** and formatting preserved

## Example Output

```markdown
# My Conversation Title

**Created:** 8/12/2025, 12:01:01 PM
**Token Count:** 23,031

---

## User

Your question here...

---

## Assistant

*Thought for 2.3 seconds*

> Internal reasoning appears here as a quote block

The actual response follows here...
```

## Requirements

- Node.js (for command-line tools)
- Modern web browser (for GUI version)

## Files

- `convert-conversation.js` - Single file converter
- `batch-convert.js` - Batch directory converter  
- `convert-gui.html` - Web-based GUI converter
- `README.md` - This documentation

## Tips

- Works with various JSON conversation formats
- The converter handles both single-step and multi-step assistant responses  
- Thinking blocks are clearly marked and formatted as quotes
- Code blocks and markdown formatting from the original conversation are preserved
- File names are automatically generated from the original JSON filename
- Supports both `.conversation.json` and `.json` file extensions

## License

MIT License - see below for full text.

## Credits

Created by Rich Conlan using Kiro with Claude Sonnet 4.0.

LM Studio is a trademark of LM Studio, Inc. This project is not affiliated with or endorsed by LM Studio.

---

## MIT License

Copyright (c) 2025 Rich Conlan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.