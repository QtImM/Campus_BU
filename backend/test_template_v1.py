import unittest

from PIL import Image, ImageDraw

import template_v1
from template_v1 import _parse_course_code, _parse_room, detect_schedule_blocks


def _draw_synthetic_template() -> bytes:
    width, height = 960, 845
    image = Image.new("RGB", (width, height), (240, 240, 240))
    draw = ImageDraw.Draw(image)

    left_col = 86
    day_width = 144
    header_bottom = 24
    row_height = 58

    draw.rectangle((0, 0, width - 1, height - 1), outline=(70, 70, 70), width=1)
    draw.rectangle((0, 0, width - 1, header_bottom), fill=(240, 185, 84), outline=(70, 70, 70), width=1)

    verticals = [0, left_col] + [left_col + day_width * i for i in range(1, 7)]
    verticals.append(width - 1)
    for x in verticals:
        draw.line((x, 0, x, height - 1), fill=(90, 90, 90), width=1)

    horizontals = [0, header_bottom] + [header_bottom + row_height * i for i in range(1, 15)]
    horizontals.append(height - 1)
    for y in horizontals:
        draw.line((0, y, width - 1, y), fill=(90, 90, 90), width=1)

    block_color = (156, 177, 194)
    margin = 3
    day_x = lambda day_index: left_col + day_width * day_index
    row_y = lambda row_index: header_bottom + row_height * row_index

    def add_block(day_index: int, start_row: int, end_row: int):
        draw.rectangle(
            (
                day_x(day_index) + margin,
                row_y(start_row) + margin,
                day_x(day_index + 1) - margin,
                row_y(end_row) - margin,
            ),
            fill=block_color,
            outline=(120, 130, 140),
            width=1,
        )

    add_block(5, 1, 4)   # Sat 09:30-12:30
    add_block(5, 5, 8)   # Sat 13:30-16:30
    add_block(3, 7, 10)  # Thu 15:30-18:30
    add_block(4, 7, 10)  # Fri 15:30-18:30
    add_block(3, 10, 13) # Thu 18:30-21:30
    add_block(4, 10, 13) # Fri 18:30-21:30

    import io

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


class TemplateV1Tests(unittest.TestCase):
    def setUp(self):
        self.original_ocr = template_v1.pytesseract
        template_v1.pytesseract = None

    def tearDown(self):
        template_v1.pytesseract = self.original_ocr

    def test_detect_schedule_blocks_returns_expected_geometry(self):
        image_bytes = _draw_synthetic_template()
        blocks = detect_schedule_blocks(image_bytes)

        self.assertEqual(len(blocks), 6)

        summary = [(item.day_of_week, item.start_time, item.end_time) for item in blocks]
        self.assertEqual(
            summary,
            [
                (4, "15:30", "18:30"),
                (4, "18:30", "21:30"),
                (5, "15:30", "18:30"),
                (5, "18:30", "21:30"),
                (6, "09:30", "12:30"),
                (6, "13:30", "16:30"),
            ],
        )

    def test_parse_course_code_and_room_from_ocr_text(self):
        source_text = "COMP7650 (00001)\nFSC801C, FSC801D,\nRRS638, WLB103"

        self.assertEqual(_parse_course_code(source_text), "COMP7650")
        self.assertEqual(_parse_room(source_text), "FSC801C, FSC801D, RRS638, WLB103")


if __name__ == "__main__":
    unittest.main()
