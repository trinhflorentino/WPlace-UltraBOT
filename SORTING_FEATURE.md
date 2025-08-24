# Accounts Sorting Feature

## Overview
The accounts table now supports sorting functionality that allows users to sort accounts by different columns.

## Features

### Sortable Columns
- **Account Name** (`name`): Sorts alphabetically by account name
- **Account Token** (`token`): Sorts alphabetically by token (shows abbreviated tokens)
- **Droplets** (`droplets`): Sorts numerically by droplet count
- **Pixel Rights** (`pixelRight`): Sorts by current pixel count, then by maximum pixels
- **Status** (`status`): Sorts by active/inactive status (inactive accounts first by default)

### How to Use
1. Click on any column header with a sort icon (↕)
2. The first click sorts in ascending order
3. Click again to sort in descending order
4. Click a different column to sort by that column instead

### Visual Indicators
- **Default state**: Sort icon shows ↕ (neutral)
- **Ascending sort**: Sort icon shows ↑ (rotated)
- **Descending sort**: Sort icon shows ↓ (normal position)
- **Hover effect**: Headers highlight when hovered over

### Technical Implementation

#### CSS Classes
- `.sortable`: Applied to sortable column headers
- `.sort-asc`: Applied when sorting ascending
- `.sort-desc`: Applied when sorting descending
- `.sort-icon`: The sort indicator icon

#### JavaScript Functions
- `updateSortIndicators()`: Updates visual indicators on headers
- `handleSortClick(sortField)`: Handles sort click events
- `initializeSorting()`: Sets up event listeners for sorting
- `renderAccountsTable(rows)`: Modified to support custom sorting

#### Sorting Logic
- **Text fields**: Use `localeCompare()` for proper alphabetical sorting
- **Numeric fields**: Handle invalid/missing values by placing them at the end
- **Status field**: Maintains original behavior (inactive first)
- **Pixel Rights**: Complex sorting by count then max, with proper null handling

### Default Behavior
- Default sort: Status (inactive accounts first)
- Default direction: Ascending
- Sort state persists during the session

### Browser Compatibility
- Works with all modern browsers
- Uses standard DOM APIs and CSS transitions
- No external dependencies required
