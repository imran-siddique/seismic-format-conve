# 🤝 Contributing Guide

Welcome to the Seismic Format Converter project! We're excited to have you contribute to making seismic data conversion more accessible and powerful for the geophysics community.

## 🌟 How to Contribute

### **Types of Contributions**

We welcome various types of contributions:

| Type | Examples | Difficulty |
|------|----------|------------|
| **🐛 Bug Reports** | File format parsing issues, UI bugs | ⭐ Beginner |
| **📖 Documentation** | Improve guides, add examples | ⭐ Beginner |
| **✨ Feature Requests** | New format support, UI improvements | ⭐⭐ Intermediate |
| **🔧 Code Contributions** | Bug fixes, new features | ⭐⭐⭐ Advanced |
| **🧪 Testing** | Write tests, improve coverage | ⭐⭐ Intermediate |
| **🎨 Design** | UI/UX improvements, accessibility | ⭐⭐ Intermediate |

## 🚀 Getting Started

### **1. Set Up Development Environment**

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/seismic-format-conve.git
cd seismic-format-conve

# Add upstream remote
git remote add upstream https://github.com/imran-siddique/seismic-format-conve.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### **2. Development Workflow**

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Test your changes
npm run test
npm run lint

# Commit with conventional commits
git commit -m "feat: add support for new seismic format"

# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

## 📋 Development Guidelines

### **Code Style**

We use ESLint and Prettier for consistent code formatting:

```bash
# Check linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

**Key style guidelines:**
- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Functional components with hooks
- **File naming**: `PascalCase` for components, `camelCase` for utilities
- **Imports**: Absolute imports using `@/` prefix

### **Commit Convention**

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature additions
git commit -m "feat: add SEG-D format parser"

# Bug fixes
git commit -m "fix: resolve memory leak in large file processing"

# Documentation
git commit -m "docs: update Azure integration guide"

# Tests
git commit -m "test: add unit tests for format detection"

# Refactoring
git commit -m "refactor: optimize seismic data processing pipeline"
```

**Commit types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks

### **Branch Naming**

```bash
# Feature branches
feature/segd-format-support
feature/azure-batch-upload
feature/improved-ui-accessibility

# Bug fix branches
fix/memory-leak-large-files
fix/segy-header-parsing

# Documentation branches
docs/contributing-guide
docs/api-reference-update
```

## 🏗️ Project Structure

Understanding the codebase organization:

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── FileUploadZone.tsx
│   ├── FormatSelector.tsx
│   └── ConversionTest.tsx
├── lib/                 # Business logic
│   ├── seismicConverter.ts  # Main conversion engine
│   ├── ovdsValidator.ts     # OVDS validation
│   └── utils.ts             # Utility functions
├── hooks/               # Custom React hooks
├── styles/              # CSS and theme files
└── types/               # TypeScript type definitions

wiki/                    # Documentation
├── Home.md
├── Architecture.md
├── Installation-Guide.md
└── ...

tests/                   # Test files
├── unit/
├── integration/
└── e2e/
```

## 🧪 Testing Guidelines

### **Testing Strategy**

| Test Type | Coverage | Tools | Examples |
|-----------|----------|-------|----------|
| **Unit Tests** | Individual functions | Jest, Testing Library | Format parsers, utilities |
| **Integration Tests** | Component interactions | Jest, Testing Library | File upload + conversion |
| **E2E Tests** | Complete workflows | Playwright | Full conversion process |

### **Writing Tests**

#### **Unit Test Example**
```typescript
// tests/unit/formatDetection.test.ts
import { detectFormat } from '@/lib/seismicConverter'

describe('Format Detection', () => {
  test('should detect SEG-Y format from file extension', async () => {
    const mockFile = new File([''], 'seismic.segy', { type: 'application/octet-stream' })
    const result = await detectFormat(mockFile)
    
    expect(result.format).toBe('SEG-Y')
    expect(result.confidence).toBeGreaterThan(0.8)
  })

  test('should handle unknown formats gracefully', async () => {
    const mockFile = new File([''], 'unknown.xyz', { type: 'application/octet-stream' })
    const result = await detectFormat(mockFile)
    
    expect(result.format).toBe('Unknown')
    expect(result.warnings).toContain('Format not recognized')
  })
})
```

#### **Component Test Example**
```typescript
// tests/integration/FileUpload.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { FileUploadZone } from '@/components/FileUploadZone'

describe('FileUploadZone', () => {
  test('should accept valid seismic files', async () => {
    const onFileSelect = jest.fn()
    render(<FileUploadZone onFileSelect={onFileSelect} />)
    
    const file = new File(['test content'], 'test.segy', { type: 'application/octet-stream' })
    const input = screen.getByLabelText(/upload file/i)
    
    fireEvent.change(input, { target: { files: [file] } })
    
    expect(onFileSelect).toHaveBeenCalledWith(file)
  })
})
```

#### **E2E Test Example**
```typescript
// tests/e2e/conversion.spec.ts
import { test, expect } from '@playwright/test'

test('complete conversion workflow', async ({ page }) => {
  await page.goto('/')
  
  // Upload file
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.segy')
  
  // Select target format
  await page.selectOption('[data-testid="format-selector"]', 'HDF5')
  
  // Start conversion
  await page.click('[data-testid="convert-button"]')
  
  // Wait for completion
  await expect(page.locator('[data-testid="conversion-complete"]')).toBeVisible({ timeout: 30000 })
  
  // Verify download available
  await expect(page.locator('[data-testid="download-button"]')).toBeEnabled()
})
```

### **Running Tests**

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testNamePattern="Format Detection"

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Watch mode for development
npm run test:watch
```

## 🔧 Adding New Features

### **Adding a New Format Parser**

1. **Create the parser function:**
```typescript
// src/lib/parsers/newFormat.ts
export function parseNewFormat(data: ArrayBuffer): ParsedData {
  // Implementation
  return {
    traces: extractTraces(data),
    metadata: extractMetadata(data),
    headers: extractHeaders(data)
  }
}
```

2. **Register the parser:**
```typescript
// src/lib/seismicConverter.ts
import { parseNewFormat } from './parsers/newFormat'

const PARSERS = {
  // ... existing parsers
  'NewFormat': parseNewFormat
}
```

3. **Add format detection:**
```typescript
// src/lib/formatDetector.ts
const FORMAT_SIGNATURES = {
  // ... existing signatures
  'NewFormat': {
    extensions: ['.nf', '.newf'],
    magicNumbers: [0x4E, 0x46], // 'NF' in hex
    mimeTypes: ['application/x-newformat']
  }
}
```

4. **Add tests:**
```typescript
// tests/unit/newFormat.test.ts
describe('NewFormat Parser', () => {
  test('should parse valid NewFormat file', () => {
    // Test implementation
  })
})
```

5. **Update documentation:**
```markdown
<!-- wiki/Supported-Formats.md -->
### NewFormat
- **Description**: Brief format description
- **Extensions**: `.nf`, `.newf`
- **Use Cases**: When to use this format
```

### **Adding a New UI Component**

1. **Create the component:**
```typescript
// src/components/NewComponent.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface NewComponentProps {
  onAction: () => void
  disabled?: boolean
}

export function NewComponent({ onAction, disabled = false }: NewComponentProps) {
  return (
    <div className="new-component">
      <Button onClick={onAction} disabled={disabled}>
        Perform Action
      </Button>
    </div>
  )
}
```

2. **Add to exports:**
```typescript
// src/components/index.ts
export { NewComponent } from './NewComponent'
```

3. **Write component tests:**
```typescript
// tests/unit/NewComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { NewComponent } from '@/components/NewComponent'

describe('NewComponent', () => {
  test('should call onAction when button clicked', () => {
    const onAction = jest.fn()
    render(<NewComponent onAction={onAction} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(onAction).toHaveBeenCalled()
  })
})
```

## 📝 Documentation Contributions

### **Improving Existing Docs**

1. **Find areas to improve:**
   - Unclear explanations
   - Missing examples
   - Outdated information
   - Broken links

2. **Make changes:**
   - Edit markdown files in `wiki/` directory
   - Add code examples
   - Include screenshots if helpful
   - Update table of contents

3. **Test documentation:**
   - Verify all links work
   - Test code examples
   - Check formatting

### **Adding New Documentation**

1. **Follow the template:**
```markdown
# 📚 Page Title

Brief description of what this page covers.

## 🎯 Overview
Main concepts and objectives.

## 📋 Prerequisites
What users need before following this guide.

## 🚀 Step-by-Step Guide
Detailed instructions with code examples.

## 🔧 Troubleshooting
Common issues and solutions.

## 🎯 Next Steps
What to do after completing this guide.
```

2. **Use consistent formatting:**
   - Headers with emojis
   - Code blocks with language specification
   - Tables for structured information
   - Callout boxes for important notes

3. **Add to navigation:**
   - Update `wiki/Home.md` with links
   - Cross-reference related pages

## 🐛 Bug Reports

### **Before Reporting**

1. **Search existing issues** to avoid duplicates
2. **Test with latest version** to ensure bug still exists
3. **Gather information:**
   - Operating system and version
   - Browser version
   - File types that trigger the bug
   - Steps to reproduce

### **Bug Report Template**

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Upload file '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96.0]
- File Type: [e.g. SEG-Y, 150MB]
- Error Message: [exact error text]

**Additional Context**
Any other context about the problem.
```

## ✨ Feature Requests

### **Feature Request Template**

```markdown
**Feature Description**
Clear description of the feature you'd like to see.

**Problem Statement**
What problem does this solve? What use case does it address?

**Proposed Solution**
Describe how you envision this feature working.

**Alternatives Considered**
Any alternative solutions you've thought about.

**Additional Context**
Any other context, mockups, or examples.

**Implementation Notes**
Technical considerations (if you have any).
```

### **Popular Feature Areas**

- **New format support** (specific formats welcome)
- **Performance improvements** for large files
- **Batch processing** capabilities
- **Cloud integration** enhancements
- **UI/UX improvements** and accessibility
- **API enhancements** for programmatic use

## 🎯 Review Process

### **Pull Request Guidelines**

1. **Keep PRs focused** - one feature or fix per PR
2. **Write descriptive titles** and descriptions
3. **Include tests** for new functionality
4. **Update documentation** as needed
5. **Follow the checklist** in PR template

### **PR Template**

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added to hard-to-understand areas
- [ ] Documentation updated
- [ ] No new warnings
```

### **Review Criteria**

**Code Quality:**
- TypeScript best practices
- Proper error handling
- Performance considerations
- Security implications

**Testing:**
- Adequate test coverage
- Edge cases covered
- Tests are maintainable

**Documentation:**
- Code is well-commented
- Public APIs documented
- User-facing changes documented

## 🏆 Recognition

### **Contributors Hall of Fame**

We recognize contributors through:
- **GitHub contributors page**
- **Release notes** acknowledgments
- **Special mentions** in major releases
- **Contributor badges** for significant contributions

### **Types of Recognition**

| Contribution Level | Recognition |
|-------------------|-------------|
| **First-time contributor** | Welcome badge, mentorship offer |
| **Regular contributor** | Listed in contributors, early access to features |
| **Major contributor** | Co-maintainer invitation, release notes mention |
| **Core maintainer** | Full repository access, decision-making role |

## 🤔 Questions and Support

### **Getting Help**

1. **Documentation**: Check existing wiki pages
2. **GitHub Discussions**: Ask questions and share ideas
3. **Issues**: Report bugs or request features
4. **Discord** (coming soon): Real-time community chat

### **Mentorship Program**

New contributors can request mentorship for:
- **First-time contribution** guidance
- **Architecture understanding** deep dives
- **Best practices** learning
- **Code review** feedback

## 🎯 Contribution Opportunities

### **Good First Issues**

Look for issues labeled:
- `good first issue` - Perfect for newcomers
- `help wanted` - Community help needed
- `documentation` - Documentation improvements
- `easy` - Simple fixes and enhancements

### **High-Impact Areas**

- **Format parsers**: Add support for specialized seismic formats
- **Performance**: Optimize for large file processing
- **Accessibility**: Improve screen reader support
- **Internationalization**: Add multi-language support
- **Mobile experience**: Enhance mobile usability

---

## 🚀 Ready to Contribute?

1. **[Set up your development environment](Installation-Guide.md)**
2. **[Find an issue to work on](https://github.com/imran-siddique/seismic-format-conve/issues)**
3. **[Join our community discussions](https://github.com/imran-siddique/seismic-format-conve/discussions)**
4. **[Submit your first PR](https://github.com/imran-siddique/seismic-format-conve/pulls)**

---

*Thank you for contributing to the Seismic Format Converter! Together, we're making seismic data more accessible to the global geophysics community.*