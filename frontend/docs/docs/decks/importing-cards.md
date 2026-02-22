---
sidebar_position: 10
---

# Importing Flashcards

Noava allows you to quickly import flashcards using Excel or CSV files.
This makes it easy to create multiple cards at once instead of adding them manually.
You simply prepare your file with the correct column headers, upload it, and Noava will automatically create your flashcards.

You can import cards from the **Deck Detail** page:

1. Go to **Dashboard**
2. Click **Decks**
3. Open the deck you want to import cards into
4. Click the arrow next to **Create Card**
5. Select **Import from File**

Each download template is available in its respective section below.

## Media File Support

At this time, importing media files such as images or audio is not supported.
The import feature only supports text-based content through Excel and CSV files.
If your flashcards require images or audio, you will need to add those manually after importing.

---

## Required Structure

Your file must contain the following columns:

| Column Name         | Required | Description                               |
| ------------------- | -------- | ----------------------------------------- |
| `fronttext`         | Yes      | The text shown on the front of the card   |
| `backtext`          | Yes      | The answer shown on the back of the card  |
| `memo`              | No       | Extra notes shown on the back of the card |
| `hasvoiceassistant` | No       | Enables voice assistant for that card     |

**Important:**

- Column names are **not case-sensitive**.
  For example: `FrontText`, `FRONTTEXT`, and `fronttext` all work.
- The order of columns does **not** matter.
- `fronttext` and `backtext` must always be present.

---

## Importing from Excel

### Steps

1. Download the template: [Download Our Excel Template](/import-templates/Noava-import-template.xlsx)
2. Open the downloaded file in Excel.
3. Fill in one flashcard per row
4. Save the file (keep the format as **.xlsx**).
5. Go to your deck in Noava and choose **Import from File**.

### Create The File Yourself

If you do not want to use the template, your file must:

- Be saved as **.xlsx**
- Contain the following column headers in the first row:
  - `fronttext`
  - `backtext`
  - (optional) `memo`
  - (optional) `hasvoiceassistant`

### Example Format

![Excel Format Example](/img/import-excel-template.png)

> Each row represents one flashcard.

---

## Importing from CSV

### Steps

1. Download the template: [Download Our CSV Template](/import-templates/Noava-import-template.csv)
2. Open the downloaded file in your preferred program.
3. Fill in one flashcard per row.
4. Save the file (keep the format as **.csv**).
5. Go to your deck in Noava and choose **Import from File**.

### Create The File Yourself

If you do not want to use the template, your file must:

- Be saved as **.csv**
- Contain the following headers on the first line:
  - `fronttext`
  - `backtext`
  - (optional) `memo`
  - (optional) `hasvoiceassistant`

### Example Format

![CSV Format Example](/img/import-csv-template.png)

> Each line represents one flashcard.

---

## Voice Assistant Column

The `hasvoiceassistant` column controls whether the voice assistant is enabled for a specific card.

**Rules:**

- If the column is **missing**, voice assistant will be set to **false**.
- If the cell is **empty**, it will be set to **false**.
- If the value is exactly `"false"` (any letter case), it will be set to **false**.
- Any other text will enable the voice assistant for that card.

### Examples

| Value in cell | Voice Assistant |
| ------------- | --------------- |
| (empty)       | Disabled        |
| false         | Disabled        |
| FALSE         | Disabled        |
| true          | Enabled         |
| yes           | Enabled         |
| 1             | Enabled         |
| anything else | Enabled         |

> If you are unsure, simply leave the column empty to keep voice assistant disabled.

---

## Common Mistakes to Avoid

- Missing the `fronttext` or `backtext` column.
- Leaving `fronttext` or `backtext` empty for a row.
- Using a different file type (only `.xlsx`, `.xls` and `.csv` are supported).

Keep the file simple and clean for best results.

If you experience issues importing a file, verify the column names and check that required fields are filled in.

---

## Importing from Another Flashcard Tool

### Quizlet

### Anki
