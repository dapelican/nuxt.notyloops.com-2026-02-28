CREATE TABLE note_details (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  position INT NOT NULL,
  plain_content TEXT NOT NULL,
  html_content TEXT NOT NULL,
  to_be_hidden BOOLEAN,
  is_correct BOOLEAN
);

CREATE TRIGGER update_note_details_timestamp
BEFORE UPDATE ON note_details
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();