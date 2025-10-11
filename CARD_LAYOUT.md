# Modern Bibliography Card Layout

This implementation transforms your bibliography entries into modern, card-style layouts similar to the design shown in your reference image.

## Features

### Visual Design
- **Clean Cards**: White background with subtle shadows and rounded corners
- **Grid Layout**: 3-column grid on desktop, 2-column on tablet, 1-column on mobile
- **Visual Abstracts**: Optional thumbnail images at the top of each card with proper scaling
- **Hover Effects**: Cards lift and show enhanced shadows on hover
- **Responsive Design**: Adapts to mobile and desktop screens
- **Dark Theme Support**: Automatically adapts to light/dark themes

### Card Structure
1. **Visual Abstract** (optional): Thumbnail image showcasing key visualizations
2. **Header**: Venue/conference info and tags
3. **Title**: Paper title in large, bold font
4. **Authors**: Author list with self-highlighting
5. **Abstract**: Truncated paper description
6. **Award Badge** (optional): Special highlighting for awards
7. **Action Links**: Interactive buttons for resources

### Supported Fields

#### Required
- `title` - Paper title
- `author` - Author list
- `selected={true}` - Mark as selected

#### Optional Enhancements
- `preview` - Thumbnail image path (e.g., `preview={teaser.png}`)
- `abstract` - Paper abstract text
- `tags` - Comma-separated tags (e.g., `tags={hci, ai, visualization}`)
- `booktitle` or `journal` - Venue name
- `year` - Publication year
- `award` - Award information
- `award_name` - Custom award text

#### Link Fields
- `pdf` - PDF file path
- `url` - Project website
- `website` - Demo website
- `code` - Code repository
- `poster` - Poster image/PDF
- `slides` - Presentation slides
- `doi` - DOI link
- `arxiv` - arXiv link

## Files Modified

### New Files
- `_includes/project_card.liquid` - Card template
- `CARD_LAYOUT.md` - This documentation

### Modified Files
- `_layouts/bib.liquid` - Updated to use card layout
- `_sass/_base.scss` - Added card styling
- `_bibliography/papers.bib` - Enhanced with tags and abstracts

## Example Bibliography Entry

```bibtex
@inproceedings{example2024,
  title={Example Paper Title},
  author={Author, First and Author, Second},
  booktitle={Conference Name},
  year={2024},
  abstract={This is the paper abstract that will be displayed in the card.},
  tags={hci, visualization, research},
  preview={teaser.png},
  url={https://example.com},
  code={https://github.com/example/repo},
  pdf={https://example.com/paper.pdf},
  award={true},
  award_name={BEST PAPER HONORABLE MENTION},
  selected={true}
}
```

## Adding Visual Abstracts

To add thumbnail images to your cards:

1. Place images in `/assets/img/publication_preview/`
2. Add `preview={filename.png}` to your bibliography entry
3. Images will automatically display as 200px tall thumbnails

## Customization

### Colors
The cards use CSS custom properties and will automatically adapt to your theme's color scheme.

### Styling
Key CSS classes for customization:
- `.project-card` - Main card container
- `.card-image` - Thumbnail image area
- `.card-header` - Venue and tags section
- `.card-title` - Paper title
- `.card-authors` - Author list
- `.card-abstract` - Abstract text
- `.card-links` - Action buttons container
- `.action-btn` - Individual action button
- `.tag` - Tag styling
- `.award-badge` - Award highlighting

### Responsive Breakpoints
- **Desktop (>1200px)**: 3-column grid layout
- **Tablet (768px-1200px)**: 2-column grid layout  
- **Mobile (≤768px)**: Single column layout with optimized spacing

## Browser Support
- Modern browsers with CSS Grid and Flexbox support
- Graceful degradation for older browsers
- Mobile-responsive design
