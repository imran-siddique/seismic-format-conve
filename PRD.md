# Seismic File Converter

A client-side application that converts seismic data files between different formats, with a focus on modern web-compatible outputs.

**Experience Qualities**: 
1. **Professional** - Clean, technical interface that inspires confidence in data processing accuracy
2. **Efficient** - Fast file processing with clear progress indicators and minimal steps
3. **Reliable** - Robust error handling and validation to ensure data integrity

**Complexity Level**: Light Application (multiple features with basic state)
- Handles file upload, format detection, conversion processing, and download management with persistent conversion history

## Essential Features

**File Upload & Detection**
- Functionality: Drag-and-drop or browse to upload seismic files, with automatic format detection
- Purpose: Streamline the input process and reduce user errors
- Trigger: User drags file or clicks upload button
- Progression: File select → Format detection → Validation → Ready for conversion
- Success criteria: File successfully uploaded and format correctly identified

**Format Conversion**
- Functionality: Convert between common seismic formats (SEG-Y, SU, ASCII) to web-compatible formats
- Purpose: Enable seismic data to be used in modern web applications and analysis tools
- Trigger: User selects target format and clicks convert
- Progression: Format selection → Processing with progress → Download ready → File delivered
- Success criteria: Converted file maintains data integrity and is properly formatted

**Conversion History**
- Functionality: Track previous conversions with file names, formats, and timestamps
- Purpose: Allow users to re-download recent conversions and track their work
- Trigger: Automatically logged after successful conversion
- Progression: Conversion complete → History entry created → Accessible in history panel
- Success criteria: History persists between sessions and allows file re-download

**Format Validation**
- Functionality: Verify file format and structure before conversion
- Purpose: Prevent processing errors and ensure data quality
- Trigger: Immediately after file upload
- Progression: File analysis → Structure validation → Format confirmation → Status display
- Success criteria: Invalid files are rejected with clear error messages

## Edge Case Handling

- **Large Files**: Progress indicators and chunked processing to prevent browser freezing
- **Corrupted Data**: Validation checks with detailed error reporting and recovery suggestions  
- **Unsupported Formats**: Clear messaging with list of supported formats and conversion alternatives
- **Memory Limits**: File size warnings and recommendations for optimal performance
- **Network Issues**: Local processing ensures conversions work offline

## Design Direction

The design should feel technical and professional like specialized scientific software, with a clean, data-focused interface that emphasizes functionality over decoration.

## Color Selection

Complementary (opposite colors) - Using a blue-orange palette that conveys both technical precision (blue) and energy/processing activity (orange).

- **Primary Color**: Deep Ocean Blue `oklch(0.45 0.15 240)` - Communicates technical expertise and reliability
- **Secondary Colors**: Light Gray `oklch(0.95 0.01 240)` for backgrounds, Dark Charcoal `oklch(0.25 0.02 240)` for text
- **Accent Color**: Vibrant Orange `oklch(0.68 0.18 45)` - Highlights active processes and successful conversions
- **Foreground/Background Pairings**: 
  - Background (Light Gray): Dark Charcoal text - Ratio 8.2:1 ✓
  - Card (White): Dark Charcoal text - Ratio 12.1:1 ✓  
  - Primary (Deep Ocean Blue): White text - Ratio 5.8:1 ✓
  - Secondary (Light Gray): Dark Charcoal text - Ratio 8.2:1 ✓
  - Accent (Vibrant Orange): White text - Ratio 4.9:1 ✓

## Font Selection

Use Inter for its technical clarity and excellent readability at all sizes, conveying precision and modern professionalism.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal spacing  
  - H3 (Card Titles): Inter Medium/18px/normal spacing
  - Body (Instructions): Inter Regular/16px/relaxed line height
  - Small (File Details): Inter Regular/14px/normal spacing

## Animations

Subtle functional animations that communicate processing states and guide attention to completed actions, avoiding distracting effects that might undermine the professional feel.

- **Purposeful Meaning**: Progress animations reinforce the sense of active data processing, while success states provide satisfying completion feedback
- **Hierarchy of Movement**: File upload gets priority animation focus, followed by conversion progress, then subtle hover states on interactive elements

## Component Selection

- **Components**: Cards for file upload areas and conversion results, Progress bars for processing, Tables for conversion history, Buttons with distinct primary/secondary styling, Alert dialogs for errors
- **Customizations**: Custom file drop zone with enhanced visual feedback, progress components with percentage display
- **States**: Upload buttons show hover/active states, processing buttons disable during conversion, success states show checkmarks
- **Icon Selection**: Upload cloud for file input, gear/cog for processing, download arrow for completed files, clock for history
- **Spacing**: Consistent 6-unit grid (24px) for major sections, 4-unit (16px) for related elements, 2-unit (8px) for tight groupings
- **Mobile**: Single-column layout with full-width cards, larger touch targets, collapsible history panel for space efficiency